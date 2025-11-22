import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface StatsData {
  totalEmployees: number;
  presentToday: number;
  late: number;
  onLeave: number;
}

const Stats: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetch('http://localhost:3001/api/attendance/stats', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then(response => response.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 px-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center transition-colors">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Employees</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalEmployees || 0}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center transition-colors">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Present Today</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.presentToday || 0}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center transition-colors">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Late</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.late || 0}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center transition-colors">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">On Leave</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.onLeave || 0}</p>
      </div>
    </div>
  );
};

export default Stats;
