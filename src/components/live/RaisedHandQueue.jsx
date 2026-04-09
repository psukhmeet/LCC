import React, { useEffect, useRef } from 'react';
import {
  collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiX } from 'react-icons/fi';
import { format } from 'date-fns';

/**
 * RaisedHandQueue — visible only to teacher.
 * Shows live list of students who raised their hand (Firestore-backed).
 */
const RaisedHandQueue = ({ classId, raisedHands, onDismiss, onClearAll, isTeacher }) => {
  if (!isTeacher || raisedHands.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 100,
      background: 'rgba(8,15,26,0.9)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(245,158,11,0.3)',
      borderRadius: '14px',
      padding: '14px',
      minWidth: '240px',
      maxWidth: '300px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🖐 Raised Hands ({raisedHands.length})
        </div>
        <button onClick={onClearAll} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}>
          Clear All
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
        {raisedHands.map((h) => (
          <div key={h.userId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px', padding: '7px 10px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'white' }}>{h.name}</div>
              {h.raisedAt && (
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {format(h.raisedAt.toDate?.() || new Date(h.raisedAt), 'HH:mm:ss')}
                </div>
              )}
            </div>
            <button onClick={() => onDismiss(h.userId)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}>
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * useRaisedHands — hook to manage Firestore raised-hand state.
 * Returns { raisedHands, raiseHand, lowerHand, dismissHand, clearAll }
 */
export const useRaisedHands = (classId, currentUser, isTeacher) => {
  const [raisedHands, setRaisedHands] = React.useState([]);

  useEffect(() => {
    if (!classId) return;
    const q = query(
      collection(db, 'classes', classId, 'raisedHands'),
      orderBy('raisedAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setRaisedHands(snap.docs.map(d => ({ userId: d.id, ...d.data() })));
    });
    return unsub;
  }, [classId]);

  const raiseHand = async () => {
    if (!currentUser) return;
    await setDoc(doc(db, 'classes', classId, 'raisedHands', currentUser.uid), {
      userId: currentUser.uid,
      name: currentUser.name || currentUser.displayName || 'Student',
      raisedAt: serverTimestamp(),
    });
  };

  const lowerHand = async () => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'classes', classId, 'raisedHands', currentUser.uid));
  };

  const dismissHand = async (userId) => {
    if (!isTeacher) return;
    await deleteDoc(doc(db, 'classes', classId, 'raisedHands', userId));
  };

  const clearAll = async () => {
    if (!isTeacher) return;
    await Promise.all(raisedHands.map(h => deleteDoc(doc(db, 'classes', classId, 'raisedHands', h.userId))));
  };

  const hasRaisedHand = raisedHands.some(h => h.userId === currentUser?.uid);

  return { raisedHands, hasRaisedHand, raiseHand, lowerHand, dismissHand, clearAll };
};

export default RaisedHandQueue;
