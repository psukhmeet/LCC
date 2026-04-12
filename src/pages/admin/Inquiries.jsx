import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import DefaultLayout from '../../layouts/admin/DefaultLayout';
import { Trash2, CheckCircle, RefreshCcw, Mail, Calendar, MessageSquare } from 'lucide-react';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleRead = async (id, currentRead) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { read: !currentRead });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: !currentRead } : i));
    } catch (err) {
      alert('Error updating inquiry: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Error deleting inquiry: ' + err.message);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Contact Inquiries
            </h4>
            <button
              onClick={fetchInquiries}
              className="flex items-center gap-2 rounded border border-stroke py-2 px-4.5 font-medium hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4"
            >
              <RefreshCcw size={18} /> Refresh
            </button>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase">Name</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase">Email</h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase">Message</h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase">Status</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase">Action</h5>
              </div>
            </div>

            {loading ? (
               <div className="p-5 text-center">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
               <div className="p-5 text-center py-20">No inquiries found.</div>
            ) : (
              inquiries.map((inquiry, key) => (
                <div
                  className={`grid grid-cols-3 sm:grid-cols-5 ${
                    key === inquiries.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                  } ${!inquiry.read ? 'bg-primary/5' : ''}`}
                  key={key}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <p className={`text-black dark:text-white ${!inquiry.read ? 'font-bold' : ''}`}>
                      {inquiry.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5 overflow-hidden">
                    <p className="text-sm truncate">{inquiry.email}</p>
                  </div>

                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <p className="text-sm italic line-clamp-2">{inquiry.message}</p>
                  </div>

                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <button
                      onClick={() => handleToggleRead(inquiry.id, inquiry.read)}
                      className={`inline-flex rounded-full py-1 px-3 text-xs font-medium ${
                        inquiry.read ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {inquiry.read ? 'Read' : 'New'}
                    </button>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5 gap-2">
                    <button 
                       onClick={() => handleToggleRead(inquiry.id, inquiry.read)}
                       className="hover:text-primary transition-colors"
                       title={inquiry.read ? "Mark as unread" : "Mark as read"}
                    >
                       <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(inquiry.id)}
                      className="hover:text-danger transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default InquiriesPage;
