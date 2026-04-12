import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import DefaultLayout from '../../layouts/admin/DefaultLayout';
import { Trash2, UserPlus, Image as ImageIcon, Briefcase, GraduationCap } from 'lucide-react';

const TutorsPage = () => {
  const { data, addTutor, removeTutor, updateTutor } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [newTutor, setNewTutor] = useState({ name: '', subject: '', experience: '', image: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    addTutor(newTutor);
    setShowModal(false);
    setNewTutor({ name: '', subject: '', experience: '', image: '' });
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Manage Tutors
            </h4>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-90"
            >
              <UserPlus size={18} /> Add Tutor
            </button>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Tutor</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Subject</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Experience</h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
              </div>
            </div>

            {data.tutors.map((tutor, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-4 ${
                  key === data.tutors.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                }`}
                key={key}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                    <img src={tutor.image} alt="Tutor" className="w-full h-full object-cover" />
                  </div>
                  <p className="hidden text-black dark:text-white sm:block">
                    {tutor.name}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{tutor.subject}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{tutor.experience}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <button 
                    onClick={() => removeTutor(tutor.id)}
                    className="hover:text-primary p-2 text-meta-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Add New Tutor
            </h3>
            <form onSubmit={handleAdd} className="mt-8 text-left">
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Name</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={newTutor.name}
                  onChange={e => setNewTutor({...newTutor, name: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={newTutor.subject}
                  onChange={e => setNewTutor({...newTutor, subject: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Experience</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={newTutor.experience}
                  onChange={e => setNewTutor({...newTutor, experience: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Image URL</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={newTutor.image}
                  onChange={e => setNewTutor({...newTutor, image: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Add Tutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default TutorsPage;
