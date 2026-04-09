import { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection, addDoc, query, orderBy, limit,
  onSnapshot, deleteDoc, updateDoc, doc, serverTimestamp,
  setDoc, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * useChat — manages real-time Firestore chat for a class.
 * Messages live at: classes/{classId}/messages
 */
const useChat = (classId, currentUser, isTeacher) => {
  const [messages, setMessages] = useState([]);
  const [chatError, setChatError] = useState(null);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!classId || !currentUser) return;

    const msgRef = collection(db, 'classes', classId, 'messages');
    const q = query(msgRef, orderBy('timestamp', 'asc'), limit(100));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setMessages(msgs);
        setChatError(null);
      },
      (err) => {
        console.error('[useChat] Firestore error:', err.message);
        setChatError('Chat unavailable. Check Firestore rules.');
      }
    );

    unsubRef.current = unsub;
    return () => unsub();
  }, [classId, currentUser]);

  // ── Send message ──
  const sendMessage = useCallback(async (text, type = 'text') => {
    if (!text.trim() || !currentUser) return;
    try {
      await addDoc(collection(db, 'classes', classId, 'messages'), {
        senderId:    currentUser.uid,
        senderName:  currentUser.name  || currentUser.displayName || 'Anonymous',
        senderRole:  currentUser.role  || 'student',
        text:        text.trim(),
        type,        // 'text' | 'question' | 'announcement'
        isPinned:    false,
        timestamp:   serverTimestamp(),
      });
    } catch (err) {
      console.error('[useChat] sendMessage failed:', err);
    }
  }, [classId, currentUser]);

  // ── Pin / Unpin (teacher only) ──
  const pinMessage = useCallback(async (msgId, currentPin) => {
    if (!isTeacher) return;
    try {
      await updateDoc(doc(db, 'classes', classId, 'messages', msgId), { isPinned: !currentPin });
    } catch (err) {
      console.error('[useChat] pinMessage failed:', err);
    }
  }, [classId, isTeacher]);

  // ── Delete (teacher only) ──
  const deleteMessage = useCallback(async (msgId) => {
    if (!isTeacher) return;
    try {
      await deleteDoc(doc(db, 'classes', classId, 'messages', msgId));
    } catch (err) {
      console.error('[useChat] deleteMessage failed:', err);
    }
  }, [classId, isTeacher]);

  return { messages, chatError, sendMessage, pinMessage, deleteMessage };
};

export default useChat;
