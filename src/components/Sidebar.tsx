import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import SettingsModal from './SettingsModal';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
    ${isActive(path)
      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
    }
    ${isCollapsed ? 'justify-center' : ''}
  `;

  return (
    <div className={`
      flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
      transition-all duration-300 relative
      ${isCollapsed ? 'w-20 px-3 py-6' : 'w-[270px] px-5 py-5'}
    `}>
      {/* Logo */}
      <div className="flex items-center mb-10 overflow-hidden">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <rect width="40" height="40" rx="8" fill="#4F46E5" />
          <path d="M20 10L28 24H12L20 10Z" fill="white" />
        </svg>
        {!isCollapsed && (
          <div className="ml-3 transition-opacity duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AttendTrack</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">HR Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link to="/admin" className={linkClass('/admin')}>
              <LayoutDashboard size={20} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to="/admin/employees" className={linkClass('/admin/employees')}>
              <Users size={20} />
              {!isCollapsed && <span>Employees</span>}
            </Link>
          </li>
          <li>
            <Link to="/admin/reports" className={linkClass('/admin/reports')}>
              <FileText size={20} />
              {!isCollapsed && <span>Reports</span>}
            </Link>
          </li>
          <li>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Settings size={20} />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </li>
        </ul>
      </nav>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Footer */}
      <div className="mt-auto">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <LifeBuoy size={20} />
              {!isCollapsed && <span>Support</span>}
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={handleLogout}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </a>
          </li>
        </ul>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="
          absolute -right-3 top-7 w-6 h-6 
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-full flex items-center justify-center
          text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400
          shadow-sm transition-all z-10
        "
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
};

export default Sidebar;
