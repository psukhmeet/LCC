import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Search, Bell, MessageSquare, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { userProfile } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <Menu size={20} />
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

        <div className="hidden sm:block">
          <form action="#" method="POST">
            <div className="relative">
              <button className="absolute top-1/2 left-0 -translate-y-1/2">
                <Search size={20} className="fill-body hover:fill-primary" />
              </button>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Notification Menu Area --> */}
            <li className="relative">
                <button className="flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white">
                  <Bell size={18} />
                </button>
            </li>
            {/* <!-- Message Menu Area --> */}
            <li className="relative">
                <button className="flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white">
                  <MessageSquare size={18} />
                </button>
            </li>
          </ul>

          {/* <!-- User Area --> */}
          <div className="relative group flex items-center gap-4">
             <div className="hidden text-right lg:block">
               <span className="block text-sm font-medium text-black dark:text-white">
                 {userProfile?.name || 'Admin'}
               </span>
               <span className="block text-xs font-medium">Administrator</span>
             </div>

             <div className="h-12 w-12 rounded-full overflow-hidden border border-stroke">
               <img src={"https://i.pravatar.cc/150?u=admin"} alt="User" className="w-full h-full object-cover" />
             </div>

             <div className="absolute right-0 top-full mt-2 hidden w-44 flex-col rounded-sm border border-stroke bg-white shadow-default group-hover:flex dark:border-strokedark dark:bg-boxdark">
                <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                  <li>
                    <NavLink to="/profile" className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                      <User size={22} /> My Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/settings" className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                      <Settings size={22} /> Account Settings
                    </NavLink>
                  </li>
                </ul>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <LogOut size={22} /> Log Out
                </button>
             </div>
          </div>
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
