import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  MessageSquare, 
  UserCheck, 
  Radio, 
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/admin/dashboard" className="flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-8 h-8" />
          <span className="text-white text-xl font-bold">Admin Panel</span>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/admin/dashboard"
                  end
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-meta-4 ${
                    pathname === '/admin/dashboard' && 'bg-meta-4'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard (Stats)
                </NavLink>
              </li>

              {/* <!-- Menu Item Settings --> */}
              <li>
                <NavLink
                  to="/admin/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-meta-4 ${
                    pathname.includes('settings') && 'bg-meta-4'
                  }`}
                >
                  <Settings size={18} />
                  General Settings
                </NavLink>
              </li>

              {/* <!-- Menu Item Tutors --> */}
              <li>
                <NavLink
                  to="/admin/tutors"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-meta-4 ${
                    pathname.includes('tutors') && 'bg-meta-4'
                  }`}
                >
                  <Users size={18} />
                  Manage Tutors
                </NavLink>
              </li>

              {/* <!-- Menu Item Inquiries --> */}
              <li>
                <NavLink
                  to="/admin/inquiries"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-meta-4 ${
                    pathname.includes('inquiries') && 'bg-meta-4'
                  }`}
                >
                  <MessageSquare size={18} />
                  Inquiries
                </NavLink>
              </li>

               {/* <!-- Menu Item Teachers --> */}
               <li>
                <NavLink
                  to="/admin/teachers"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-meta-4 ${
                    pathname.includes('teachers') && 'bg-meta-4'
                  }`}
                >
                  <UserCheck size={18} />
                  Authorized Teachers
                </NavLink>
              </li>

               {/* <!-- Menu Item Classes --> */}
               <li>
                <NavLink
                  to="/admin/classes"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-meta-4 ${
                    pathname.includes('classes') && 'bg-meta-4'
                  }`}
                >
                  <Radio size={18} />
                  Live Classes
                </NavLink>
              </li>
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-meta-4`}
                >
                  <ArrowLeft size={18} />
                  Back to Website
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
