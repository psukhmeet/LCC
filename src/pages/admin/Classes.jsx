import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import DefaultLayout from '../../layouts/admin/DefaultLayout';
import { Video, Plus, Trash2, Copy, Check, Calendar, Type, FileText } from 'lucide-react';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', scheduledTime: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchClasses = async () => {
    setFetchLoading(true);
    try {
      const q = query(collection(db, 'classes'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'classes'), {
        title:         form.title.trim(),
        description:   form.description.trim(),
        scheduledTime: form.scheduledTime ? new Date(form.scheduledTime) : null,
        teacherId:     'admin',
        isLive:        false,
        createdAt:     serverTimestamp(),
      });
      setForm({ title: '', description: '', scheduledTime: '' });
      await fetchClasses();
    } catch (err) {
      alert('Failed to create class: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await deleteDoc(doc(db, 'classes', classId));
      await fetchClasses();
    } catch (err) {
      alert('Error deleting class: ' + err.message);
    }
  };

  const copyLink = (classId) => {
    const link = `${window.location.origin}/live/${classId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(classId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark font-satoshi">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                <Plus size={20} /> Create New Class
              </h3>
            </div>
            <form onSubmit={handleCreate}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-medium">
                    Class Title <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                        type="text"
                        placeholder="e.g. Physics — Thermodynamics"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-medium">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short summary for students"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white font-medium">
                    Scheduled Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={form.scheduledTime}
                    onChange={e => setForm({ ...form, scheduledTime: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  {loading ? 'Creating...' : 'Create Class & Generate Link'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-fit">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
              <h3 className="font-medium text-black dark:text-white">
                Existing Classes
              </h3>
              <span className="rounded-full bg-primary/10 py-1 px-3 text-sm font-medium text-primary">
                {classes.length}
              </span>
            </div>
            <div className="p-6.5 overflow-y-auto max-h-[600px]">
              {fetchLoading ? (
                <div className="text-center py-10 text-body">Loading classes...</div>
              ) : classes.length === 0 ? (
                <div className="text-center py-10 text-body">No classes created yet.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="rounded border border-stroke bg-gray py-4 px-4.5 dark:border-strokedark dark:bg-meta-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-black dark:text-white truncate pr-2">
                          {cls.title}
                        </h4>
                        {cls.isLive && (
                           <span className="flex h-3 w-3 rounded-full bg-meta-1 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-sm text-body dark:text-bodydark mb-3 line-clamp-2">
                        {cls.description || 'No description provided.'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => copyLink(cls.id)}
                          className={`flex items-center gap-2 rounded py-1.5 px-3 text-sm font-medium ${
                            copiedId === cls.id ? 'bg-success text-white' : 'bg-primary text-white hover:bg-opacity-90'
                          }`}
                        >
                          {copiedId === cls.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Link</>}
                        </button>
                        <button
                          onClick={() => handleDelete(cls.id)}
                          className="flex items-center gap-2 rounded bg-danger py-1.5 px-3 text-sm font-medium text-white hover:bg-opacity-90"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClassesPage;
