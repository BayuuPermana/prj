import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [status, setStatus] = useState<'idle' | 'clocked-in' | 'clocked-out'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleClockIn = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/attendance/clock-in', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setStatus('clocked-in');
                setMessage('Successfully clocked in at ' + data.clockIn);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error clocking in');
        }
    };

    const handleClockOut = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/attendance/clock-out', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setStatus('clocked-out');
                setMessage('Successfully clocked out at ' + data.clockOut);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error clocking out');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors">
            <div className="absolute top-4 right-4">
                <button onClick={logout} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <LogOut size={20} /> Logout
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center transition-colors">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome, {user?.username}</h1>
                    <p className="text-gray-500 dark:text-gray-400">Employee Dashboard</p>
                </div>

                <div className="mb-8">
                    <div className="text-5xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                        {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-3 rounded ${message.includes('Error') || message.includes('Already') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleClockIn}
                        className="py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-lg transition-colors shadow-md flex flex-col items-center justify-center gap-2"
                    >
                        <span>⏰</span> Clock In
                    </button>
                    <button
                        onClick={handleClockOut}
                        className="py-4 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-lg transition-colors shadow-md flex flex-col items-center justify-center gap-2"
                    >
                        <span>🛑</span> Clock Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
