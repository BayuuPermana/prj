import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stats from './components/Stats';
import EmployeeList from './components/EmployeeList';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-auto">
        <Header />
        <Stats />
        <EmployeeList />
      </div>
    </div>
  );
};

export default Dashboard;
