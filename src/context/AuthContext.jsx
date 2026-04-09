import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser]   = useState(null);   // Firebase Auth user
  const [userProfile, setUserProfile]   = useState(null);   // Firestore profile { name, role, enrolledClasses }
  const [loading, setLoading]           = useState(true);   // true while hydrating session

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            // Profile doc not yet created (edge case on first login)
            setUserProfile({ name: firebaseUser.displayName || 'User', role: 'student', enrolledClasses: [] });
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          setUserProfile({ name: 'User', role: 'student', enrolledClasses: [] });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isTeacher = userProfile?.role === 'teacher';

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, isTeacher, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
