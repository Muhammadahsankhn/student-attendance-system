import React, { useState } from 'react';
import InputField from './Input';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('role', data.role); // Save role to localStorage if needed later
                alert('Login successful');

                if (data.role === 'admin') {
                    navigate('/admin');
                } else if (data.role === 'student') {
                    navigate('/card');
                } else if (data.role === 'teacher') {
                    navigate('/card'); // Customize this path if needed
                } else {
                    alert("Unknown role, can't redirect.");
                }
            }
            else {
                alert(data.error || 'Login failed');
            }

        } catch (err) {
            console.error('Login error:', err);
            alert('Server error during login');
        }
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmit}
                className="  rounded w-full max-w-[-18rem] flex flex-col justify-center items-center place-self-center"
                autoComplete="off"
            >
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                <InputField
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputField
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <Button type="submit" className='w-[80%]'>Login</Button>


            </form>
        </div>
    );
};

export default Login;
