import { createContext, useState, useEffect } from 'react';
import initialData from '../data/initialData.json';
import { db } from '../firebase/config';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('learnwood_data');
    if (!saved) return initialData;
    
    try {
      const parsed = JSON.parse(saved);
      // Deep merge logic for categories
      return {
        ...initialData,
        ...parsed,
        general: { 
          ...initialData.general, 
          ...(parsed.general || {}),
          // Force use of system phone numbers to ensure formatting fixes apply
          phoneNumbers: initialData.general.phoneNumbers 
        },
        stats: { ...initialData.stats, ...(parsed.stats || {}) },
      };

    } catch {
      return initialData;
    }
  });

  // 1. Sync state from Firestore (Global Sync)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'website'), (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        setData(prev => ({
          ...prev,
          general: { ...prev.general, ...(cloudData.general || {}) },
          stats: { ...prev.stats, ...(cloudData.stats || {}) },
          tutors: cloudData.tutors || prev.tutors
        }));
      }
    });
    return () => unsub();
  }, []);

  // 2. Sync notifications from Firestore
  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(prev => ({ ...prev, notifications: notes }));
    });
    return () => unsub();
  }, []);

  // 2. Persist to localStorage (Local Cache)
  useEffect(() => {
    localStorage.setItem('learnwood_data', JSON.stringify(data));
  }, [data]);

  // 3. Sync state across local tabs (Tab Sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'learnwood_data' && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setData(newData);
        } catch (err) {
          console.error('[DataContext] Failed to sync storage:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const updateData = (category, key, value) => {
    setData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateCategory = (category, newValuesObject) => {
    setData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...newValuesObject
      }
    }));
  };

  const updateTutor = (id, updatedTutor) => {
    setData((prev) => ({
      ...prev,
      tutors: prev.tutors.map((t) => (t.id === id ? updatedTutor : t))
    }));
  };

  const addTutor = (newTutor) => {
    setData((prev) => ({
      ...prev,
      tutors: [...prev.tutors, { ...newTutor, id: Date.now().toString() }]
    }));
  };

  const removeTutor = (id) => {
    setData((prev) => ({
      ...prev,
      tutors: prev.tutors.filter((t) => t.id !== id)
    }));
  };

  const addMessage = (message) => {
    setData((prev) => ({
      ...prev,
      messages: [{ ...message, id: Date.now().toString(), date: new Date().toISOString() }, ...(prev.messages || [])]
    }));
  };

  const removeMessage = (id) => {
    setData((prev) => ({
      ...prev,
      messages: (prev.messages || []).filter((m) => m.id !== id)
    }));
  };

  const moveTutor = (id, direction) => {
    setData((prev) => {
      const index = prev.tutors.findIndex((t) => t.id === id);
      if (index === -1) return prev;

      const newTutors = [...prev.tutors];
      const tutor = newTutors.splice(index, 1)[0];

      if (direction === 'top') {
        newTutors.unshift(tutor);
      } else if (direction === 'bottom') {
        newTutors.push(tutor);
      } else if (direction === 'up') {
        const newIndex = Math.max(0, index - 1);
        newTutors.splice(newIndex, 0, tutor);
      } else if (direction === 'down') {
        const newIndex = Math.min(newTutors.length, index + 1);
        newTutors.splice(newIndex, 0, tutor);
      }

      return { ...prev, tutors: newTutors };
    });
  };

  return (
    <DataContext.Provider value={{ 
      data, 
      updateData, 
      updateCategory,
      updateTutor, 
      addTutor, 
      removeTutor, 
      moveTutor,
      addMessage, 
      removeMessage, 
      resetToDefault: () => setData(initialData) 
    }}>
      {children}
    </DataContext.Provider>
  );
};

