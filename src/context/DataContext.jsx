import { createContext, useState, useEffect } from 'react';
import initialData from '../data/initialData.json';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

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
          // Tutors are already in the top level if we save them there
          tutors: cloudData.tutors || prev.tutors
        }));
      }
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

  return (
    <DataContext.Provider value={{ 
      data, 
      updateData, 
      updateCategory,
      updateTutor, 
      addTutor, 
      removeTutor, 
      addMessage, 
      removeMessage, 
      resetToDefault: () => setData(initialData) 
    }}>
      {children}
    </DataContext.Provider>
  );
};

