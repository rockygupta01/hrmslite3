import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trash2, Plus, User, Search } from 'lucide-react';
import clsx from 'clsx';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        department: '',
        designation: '',
        phone_number: '',
        date_of_joining: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees/');
            setEmployees(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch employees');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await api.delete(`/employees/${id}`);
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (err) {
            alert('Failed to delete employee');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/employees/', formData);
            setEmployees([...employees, response.data]);
            setShowAddForm(false);
            setFormData({
                full_name: '',
                email: '',
                department: '',
                designation: '',
                phone_number: '',
                date_of_joining: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to add employee');
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    // if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="text-indigo-600" />
                    Employees
                </h1>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    {showAddForm ? 'Cancel' : 'Add Employee'}
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-100 animate-fade-in-down">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">New Employee Details</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="full_name" placeholder="Full Name" required value={formData.full_name} onChange={handleInputChange} className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input name="department" placeholder="Department" required value={formData.department} onChange={handleInputChange} className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input name="designation" placeholder="Designation" value={formData.designation} onChange={handleInputChange} className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleInputChange} className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input name="date_of_joining" type="date" required value={formData.date_of_joining} onChange={handleInputChange} className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">Save Employee</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {employees.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No employees found. Add one to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                        {emp.full_name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{emp.full_name}</div>
                                                    <div className="text-sm text-gray-500">{emp.designation}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.date_of_joining}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employees;
