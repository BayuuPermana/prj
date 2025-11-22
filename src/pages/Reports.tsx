import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface AttendanceRecord {
    _id: string;
    employeeId: {
        name: string;
        email: string;
    };
    date: string;
    clockIn: string;
    clockOut: string;
    status: string;
}

const Reports: React.FC = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState<AttendanceRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchReports();
    }, [user]);

    const fetchReports = () => {
        if (user?.token) {
            fetch('http://localhost:3001/api/attendance', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
                .then(res => res.json())
                .then(data => setReports(data))
                .catch(err => console.error(err));
        }
    };

    const handleEdit = (record: AttendanceRecord) => {
        setEditingRecord(record);
        setStatus(record.status);
        setIsModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecord || !user?.token) return;

        try {
            const response = await fetch(`http://localhost:3001/api/attendance/${editingRecord._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                setIsModalOpen(false);
                setEditingRecord(null);
                fetchReports();
            }
        } catch (error) {
            console.error('Error updating report:', error);
        }
    };

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-auto">
                <Header />
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Attendance Reports</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-4 dark:text-gray-200">Date</th>
                                    <th className="p-4 dark:text-gray-200">Employee</th>
                                    <th className="p-4 dark:text-gray-200">Clock In</th>
                                    <th className="p-4 dark:text-gray-200">Clock Out</th>
                                    <th className="p-4 dark:text-gray-200">Status</th>
                                    <th className="p-4 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((record) => (
                                    <tr key={record._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{record.date}</td>
                                        <td className="p-4 font-medium">
                                            <div className="dark:text-white">{record.employeeId?.name || 'Unknown'}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{record.employeeId?.email}</div>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{record.clockIn || '-'}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{record.clockOut || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-sm ${record.status === 'On Time' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    record.status === 'Late' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        record.status === 'Absent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleEdit(record)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold dark:text-white">Edit Attendance Status</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">✕</button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="On Time">On Time</option>
                                    <option value="Late">Late</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Permit">Permit</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                                Update Status
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
