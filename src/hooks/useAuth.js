import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * useAuth — handles Firebase authentication (Email/Password + Google).
 * Read auth state from useAuthContext().
 */
const useAuth = () => {
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const clearError = () => setError(null);

  // ─────────────────────────────────────────────
  // Helper: create Firestore user profile doc
  // ─────────────────────────────────────────────
  const createUserProfile = async (uid, name, role, email = null) => {
    await setDoc(doc(db, 'users', uid), {
      uid,
      name,
      role,             // 'teacher' | 'student'
      email,
      enrolledClasses: [],
      createdAt: serverTimestamp(),
    });
  };

  // ─────────────────────────────────────────────
  // Email / Password — Register
  // ─────────────────────────────────────────────
  const registerWithEmail = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      // Email registrations always start as 'student'
      await createUserProfile(result.user.uid, name, 'student', email);
      
      // Instantly send an official Firebase Email Verification link
      const { sendEmailVerification } = require('firebase/auth');
      await sendEmailVerification(result.user);
      
      return result.user;
    } catch (err) {
      console.error('[Auth] registerWithEmail error:', err.code, err.message);
      setError(friendlyError(err.code, err.message));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Email / Password — Login
  // ─────────────────────────────────────────────
  const loginWithEmail = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      console.error('[Auth] loginWithEmail error:', err.code, err.message);
      setError(friendlyError(err.code, err.message));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Forgot Password
  // ─────────────────────────────────────────────
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const { sendPasswordResetEmail } = require('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.error('[Auth] resetPassword error:', err.code, err.message);
      setError(friendlyError(err.code, err.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Google Sign-In  (role auto-assigned from authorizedTeachers)
  // ─────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Evaluate teacher role globally upon every Google sign-in
      let isAuthorizedTeacher = false;
      if (user.email) {
        const teacherSnap = await getDoc(doc(db, 'authorizedTeachers', user.email.toLowerCase()));
        isAuthorizedTeacher = teacherSnap.exists();
      }

      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid:             user.uid,
          name:            user.displayName || 'User',
          email:           user.email || null,
          role:            isAuthorizedTeacher ? 'teacher' : 'student',
          enrolledClasses: [],
          createdAt:       serverTimestamp(),
        });
      } else {
        // If they already exist, but they are newly whitelisted as a teacher, upgrade them!
        const existingData = snap.data();
        if (isAuthorizedTeacher && existingData.role !== 'teacher') {
          await setDoc(doc(db, 'users', user.uid), { role: 'teacher' }, { merge: true });
        }
      }

      return user;
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error('[Auth] Google sign-in error:', err.code, err.message);
        setError(friendlyError(err.code, err.message));
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
  };

  return {
    error,
    loading,
    clearError,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    resetPassword,
    logout,
  };
};

// Map Firebase error codes to friendly messages
const friendlyError = (code, rawMessage = '') => {
  const map = {
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/invalid-credential':      'Incorrect email or password. Please try again.',
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/too-many-requests':       'Too many attempts. Please wait a moment.',
    'auth/network-request-failed':  'Network error. Check your internet connection.',
    'auth/account-exists-with-different-credential': 'You already created an account with Email & Password. Please use the Email login instead, or enable account linking in Firebase Console.',
    'auth/operation-not-allowed':   'Email sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in methods.',
    'auth/configuration-not-found': 'Firebase Auth is not configured. Enable a sign-in method in Firebase Console.',
    'auth/internal-error':          'Firebase internal error. Check browser console for details.',
    'auth/app-not-authorized':      'App not authorised. Check your Firebase API key.',
  };
  return map[code] || `Error (${code || 'unknown'}): ${rawMessage || 'Something went wrong. Please try again.'}`;
};

export default useAuth;
