import { createContext, useState, useEffect } from 'react';
import initialData from '../data/initialData.json';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('learnwood_data');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('learnwood_data', JSON.stringify(data));
  }, [data]);

  const updateData = (category, key, value) => {
    setData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
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
    <DataContext.Provider value={{ data, updateData, updateTutor, addTutor, removeTutor, addMessage, removeMessage, resetToDefault: () => setData(initialData) }}>
      {children}
    </DataContext.Provider>
  );
};
