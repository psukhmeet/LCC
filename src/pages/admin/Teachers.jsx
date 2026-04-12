import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';
import DefaultLayout from '../../layouts/admin/DefaultLayout';
import { UserPlus, Trash2, Mail, ShieldCheck } from 'lucide-react';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchTeachers = async () => {
    setFetchLoading(true);
    try {
      const snap = await getDocs(collection(db, 'authorizedTeachers'));
      setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const teacherEmail = email.trim().toLowerCase();
      await setDoc(doc(db, 'authorizedTeachers', teacherEmail), {
        email: teacherEmail,
        authorizedAt: new Date(),
      });
      setEmail('');
      await fetchTeachers();
    } catch (err) {
      alert('Failed to authorize teacher: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (teacherEmail) => {
    if (!window.confirm(`Remove authorization for ${teacherEmail}?`)) return;
    try {
      await deleteDoc(doc(db, 'authorizedTeachers', teacherEmail));
      await fetchTeachers();
    } catch (err) {
      alert('Failed to remove teacher: ' + err.message);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 sm:p-7.5">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Authorize New Teacher
          </h4>
          <form onSubmit={handleAdd} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-4">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="Enter teacher email address"
                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
            >
              <UserPlus size={18} /> {loading ? 'Adding...' : 'Authorize Teacher'}
            </button>
          </form>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Authorized Teachers List
          </h4>

          <div className="flex flex-col">
            <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase">Teacher Email</h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase">Role</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase">Action</h5>
              </div>
            </div>

            {fetchLoading ? (
               <div className="p-5 text-center">Loading teachers...</div>
            ) : teachers.length === 0 ? (
               <div className="p-5 text-center">No authorized teachers yet.</div>
            ) : (
              teachers.map((teacher, key) => (
                <div
                  className={`grid grid-cols-2 sm:grid-cols-3 ${
                    key === teachers.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                  }`}
                  key={key}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                       {teacher.email[0].toUpperCase()}
                    </div>
                    <p className="text-black dark:text-white text-sm sm:text-base truncate">
                      {teacher.email}
                    </p>
                  </div>

                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 py-1 px-3 text-sm font-medium text-success">
                      <ShieldCheck size={14} /> Teacher
                    </span>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <button 
                      onClick={() => handleRemove(teacher.email)}
                      className="text-meta-1 hover:text-primary transition-colors"
                    >
                      <Trash2 size={20} />
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

export default TeachersPage;
