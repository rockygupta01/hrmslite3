import React, { useState, useEffect } from 'react';
import api from '../api';
import { CalendarCheck, CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [status, setStatus] = useState('Present');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const empRes = await api.get('/employees/');
                setEmployees(empRes.data);

                // Fetch all attendance records initially
                const attRes = await api.get('/attendance/');
                setAttendanceRecords(attRes.data);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) return alert("Please select an employee");

        try {
            await api.post('/attendance/', {
                employee_id: parseInt(selectedEmployee),
                date: date,
                status: status
            });

            // Refresh records
            const attRes = await api.get('/attendance/');
            setAttendanceRecords(attRes.data);
            alert("Attendance marked successfully!");
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to mark attendance');
        }
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(e => e.id === id);
        return emp ? emp.full_name : 'Unknown';
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarCheck className="text-indigo-600" />
                    Attendance Management
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-100 h-fit">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Mark Attendance</h2>
                    <form onSubmit={handleMarkAttendance} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                            <select
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.department})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Leave">Leave</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors font-medium">
                            Mark Attendance
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                    <div className="p-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-700">Recent Records</h2>
                    </div>
                    {attendanceRecords.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No attendance records found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendanceRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {getEmployeeName(record.employee_id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                        record.status === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
