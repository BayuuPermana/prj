import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface Employee {
    _id: string;
    name: string;
    email: string;
    position: string;
    department: string;
}

const EmployeeManagement: React.FC = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, [user]);

    const fetchEmployees = async () => {
        if (!user?.token) return;
        try {
            const response = await fetch('http://localhost:3001/api/employees', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`http://localhost:3001/api/employees/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormData({
            name: employee.name,
            email: employee.email,
            position: employee.position,
            department: employee.department,
            username: '', // Keep empty for security or optional update
            password: ''  // Keep empty for security
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEmployee(null);
        setFormData({ name: '', email: '', position: '', department: '', username: '', password: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingEmployee
                ? `http://localhost:3001/api/employees/${editingEmployee._id}`
                : 'http://localhost:3001/api/employees';

            const method = editingEmployee ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                handleCloseModal();
                fetchEmployees();
            }
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    };

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-auto">
                <Header />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold dark:text-white">Employee Management</h2>
                        <button
                            onClick={() => {
                                setEditingEmployee(null);
                                setFormData({ name: '', email: '', position: '', department: '', username: '', password: '' });
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            <Plus size={20} /> Add Employee
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-4 dark:text-gray-200">Name</th>
                                    <th className="p-4 dark:text-gray-200">Email</th>
                                    <th className="p-4 dark:text-gray-200">Position</th>
                                    <th className="p-4 dark:text-gray-200">Department</th>
                                    <th className="p-4 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="p-4 font-medium dark:text-white">{emp.name}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{emp.email}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{emp.position}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{emp.department}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(emp)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(emp._id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 size={18} /></button>
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
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold dark:text-white">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
                            <button onClick={handleCloseModal} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Full Name"
                                className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Email"
                                type="email"
                                className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Position"
                                className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Department"
                                className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                required
                            />
                            {!editingEmployee && (
                                <>
                                    <hr className="my-4 dark:border-gray-700" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Login Credentials</p>
                                    <input
                                        placeholder="Username"
                                        className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                    <input
                                        placeholder="Password"
                                        type="password"
                                        className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </>
                            )}
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">
                                {editingEmployee ? 'Update Employee' : 'Create Employee'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
