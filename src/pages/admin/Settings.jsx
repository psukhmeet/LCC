import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import DefaultLayout from '../../layouts/admin/DefaultLayout';
import { User, Mail, Globe, Settings as SettingsIcon, Save, RefreshCcw } from 'lucide-react';
import { db } from '../../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SettingsPage = () => {
  const { data, updateCategory, resetToDefault } = useContext(DataContext);
  const [localData, setLocalData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (category, key, value) => {
    setLocalData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateCategory('general', localData.general);
      updateCategory('stats', localData.stats);
      
      await setDoc(doc(db, 'settings', 'website'), {
        general: localData.general,
        stats: localData.stats,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert('Settings updated successfully across all platforms!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-12 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  General Website Information
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="name">
                      Website Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <Globe size={18} />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="name"
                        id="name"
                        value={localData.general.name}
                        onChange={(e) => handleChange('general', 'name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="heroTitle">
                      Hero Section Title
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="heroTitle"
                      id="heroTitle"
                      value={localData.general.heroTitle}
                      onChange={(e) => handleChange('general', 'heroTitle', e.target.value)}
                    />
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="heroSubtitle">
                      Hero Section Subtitle
                    </label>
                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      name="heroSubtitle"
                      id="heroSubtitle"
                      rows="4"
                      value={localData.general.heroSubtitle}
                      onChange={(e) => handleChange('general', 'heroSubtitle', e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={resetToDefault}
                    >
                      Reset All
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Achievement Stats
                </h3>
              </div>
              <div className="p-7">
                {Object.keys(localData.stats).map((key) => (
                  <div key={key} className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      value={localData.stats[key]}
                      onChange={(e) => handleChange('stats', key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;
