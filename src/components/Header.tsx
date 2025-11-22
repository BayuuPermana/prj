import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-6 py-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Attendance Dashboard</h1>

      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" className="text-gray-500 dark:text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" className="text-gray-500 dark:text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 py-1 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold text-sm">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">John Doe</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">HR Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
