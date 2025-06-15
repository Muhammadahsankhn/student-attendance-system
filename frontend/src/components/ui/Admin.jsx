import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Admin = () => {
    const [userStats, setUserStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [showAttendance, setShowAttendance] = useState(false);


    const navigate = useNavigate(); // for logout redirect

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleToggleAttendance = () => {
        if (!showAttendance) {
            axios.get('http://localhost:5000/api/admin/attendance')
                .then(res => {
                    setAttendance(res.data);
                    setShowAttendance(true);
                })
                .catch(err => {
                    console.error('Failed to load attendance', err);
                });
        } else {
            setShowAttendance(false);
        }
    };

    const COLORS = ['#60a5fa', '#34d399']; // Students - Blue, Teachers - Green

    const handleToggleUsers = () => {
        if (!showUsers) {
            // Fetch users only if not already showing
            axios.get('http://localhost:5000/api/admin/users')
                .then(res => {
                    setUsers(res.data);
                    setShowUsers(true);
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            // Hide the user list
            setShowUsers(false);
        }
    };
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axios.delete(`http://localhost:5000/api/admin/users/${id}`)
                .then(() => {
                    // Remove user from state
                    setUsers(users.filter(user => user.id !== id));
                })
                .catch(err => {
                    console.error("Error deleting user:", err);
                    alert("Failed to delete user.");
                });
        }
    };




    const downloadReport = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/attendance-report");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "attendance_report.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error downloading report:", error);
        }
    };






    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/user-stats')
            .then(res => {
                const formattedData = [
                    { name: 'Students', value: res.data.students },
                    { name: 'Teachers', value: res.data.teachers }
                ];
                setUserStats(formattedData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load user statistics.');
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card: Manage Users */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
                        <p className="text-gray-600">View, edit, or remove users.</p>
                        <button
                            onClick={handleToggleUsers}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                        >
                            {showUsers ? 'Hide Users' : 'View Users'}
                        </button>
                    </div>

                    {/* Card: Attendance */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-xl font-semibold mb-2">Attendance Records</h2>
                        <p className="text-gray-600">View student attendance by date or course.</p>
                        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer" onClick={handleToggleAttendance}>
                            {showAttendance ? 'Hide Attendence' : 'View Attendence'}
                        </button>

                    </div>

                    {/* Card: Reports */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-xl font-semibold mb-2">Generate Reports</h2>
                        <p className="text-gray-600">Download attendance reports as PDF or CSV.</p>
                        <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer" onClick={downloadReport}>
                            Generate
                        </button>
                    </div>
                </div>

                {/* Pie Chart for Users */}
                <div className="mt-12 bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={userStats}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {userStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Toggle User Table */}
                {showUsers && (
                    <div className="mt-12 bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-xl font-semibold mb-4">All Users</h2>
                        <table className="w-full table-auto border border-gray-300 rounded">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="py-2 px-4 border">Name</th>
                                    <th className="py-2 px-4 border">Email</th>
                                    <th className="py-2 px-4 border">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="py-2 px-4 border">{user.name}</td>
                                        <td className="py-2 px-4 border">{user.email}</td>
                                        <td className="py-2 px-4 border capitalize">{user.role}</td>
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}



                {showAttendance && (
                    <div className="mt-12 bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
                        <table className="w-full table-auto border border-gray-300 rounded">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="py-2 px-4 border">Name</th>
                                    <th className="py-2 px-4 border">Email</th>
                                    <th className="py-2 px-4 border">Date</th>
                                    <th className="py-2 px-4 border">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record) => (
                                    <tr key={record.id}>
                                        <td className="py-2 px-4 border">{record.first_name} {record.last_name}</td>
                                        <td className="py-2 px-4 border">{record.email}</td>
                                        <td className="py-2 px-4 border">{record.date}</td>
                                        <td className="py-2 px-4 border">Present</td>
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

export default Admin;
