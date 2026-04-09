import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser]   = useState(null);
  const [userProfile, setUserProfile]   = useState(null);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    let profileUnsubscribe = null;

    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        
        // Listen to the user's profile changes dynamically
        profileUnsubscribe = onSnapshot(doc(db, 'users', firebaseUser.uid), (snap) => {
          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            setUserProfile({ name: firebaseUser.displayName || 'User', role: 'student', enrolledClasses: [] });
          }
          setLoading(false);
        }, (err) => {
          console.error('Failed to listen to profile:', err);
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        if (profileUnsubscribe) profileUnsubscribe();
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const isTeacher = userProfile?.role === 'teacher';

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, isTeacher, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
