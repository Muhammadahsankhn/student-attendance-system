import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';



const Detail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const roleFromRegistration = location.state?.role || '';

    const [formData, setFormData] = useState({
        role: roleFromRegistration,
        department: '',
        roll_number: '',
        batch: '',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        image: null,
        salary: '',
        designation: '',
        course: '',
        qualification: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user_id = localStorage.getItem('user_id');

        if (!user_id) {
            alert('User not logged in!');
            return;
        }

        const data = new FormData();
        data.append('user_id', user_id);
        data.append('role', formData.role);

        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const res = await fetch('http://localhost:5000/details', {
                method: 'POST',
                body: data,
            });
            const result = await res.json();
            console.log('Submitted:', result);
            alert('Details submitted successfully!');
            navigate('/card')
        } catch (err) {
            console.error('Submission error:', err);
            alert('Error submitting details.');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600
">
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-amber-100 text-gray-800 p-8 rounded shadow-md w-full max-w-svh"
            >

                <h1 className="text-3xl font-bold mb-6 text-center bg-amber-600">Enter Your Details</h1>



                {/* Conditional Fields */}
                {formData.role && (
                    <>
                        <div className='flex gap-4 mb-4'>
                            <div className="flex-1">
                                <label htmlFor='department' className='block font-semibold mb-1 '>Department</label>
                                <Input name="department" placeholder="e.g. Computer Science" onChange={handleChange} />
                            </div>

                            {formData.role === 'student' && (
                                <>
                                    <div className="flex-1">
                                        <label htmlFor='roll_number' className='block font-semibold mb-1'>Roll Number</label>
                                        <Input name="roll_number" placeholder="e.g. 297" onChange={handleChange} />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor='batch' className='block font-semibold mb-1'>Batch</label>
                                        <Input name="batch" placeholder="e.g. 2023" onChange={handleChange} />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor='course' className='block font-semibold mb-1'>Course</label>
                                        <select
                                            name='course'
                                            required
                                            value={formData.course}
                                            onChange={handleChange}
                                            className='w-full p-3 rounded text-black outline-none bg-white transition-transform duration-300 ease-in-out focus:scale-105'
                                        >
                                            <option value="" disabled>Select Course</option>
                                            <option value="Calculus">Calculus</option>
                                            <option value="Data Structures">Data Structures</option>
                                            <option value="Operating Systems">Operating Systems</option>
                                            <option value="Database Systems">Database Systems</option>
                                            <option value="OOP">Object Oriented Programming</option>
                                        </select>
                                    </div>

                                </>
                            )}

                            {formData.role === 'teacher' && (
                                <>
                                    <div className="flex-1">
                                        <label htmlFor='salary' className='block font-semibold mb-1'>Salary</label>
                                        <Input name="salary" placeholder="e.g. 80000" onChange={handleChange} type="number" />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor='designation' className='block font-semibold mb-1'>Designation</label>
                                        <Input name="designation" placeholder="e.g. Assistant Professor" onChange={handleChange} />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor='qualification' className='block font-semibold mb-1'>Qualification</label>
                                        <select
                                            name='qualification'
                                            required
                                            value={formData.qualification}
                                            className='w-full p-3 rounded text-black outline-none bg-white transition-transform duration-300 ease-in-out focus:scale-105'
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select Qualification</option>
                                            <option value="BS">BS</option>
                                            <option value="MS">MS</option>
                                            <option value="MPhil">MPhil</option>
                                            <option value="PhD">PhD</option>
                                        </select>
                                    </div>

                                </>
                            )}
                        </div>

                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label htmlFor='phone' className='block font-semibold mb-1'>Phone Number</label>
                                <Input name="phone" placeholder="e.g. +92 3333333333" type="tel" onChange={handleChange} />
                            </div>

                            <div className="flex-1">
                                <label htmlFor='dob' className='block font-semibold mb-1'>Date of Birth</label>
                                <Input name="dob" type="date" onChange={handleChange} />
                            </div>

                            <div className="flex-1">
                                <label htmlFor='gender' className='block font-semibold mb-1'>Gender</label>
                                <select
                                    name='gender'
                                    required
                                    value={formData.gender || ""}
                                    className='w-full p-3 rounded text-black outline-none bg-white transition-transform duration-300 ease-in-out focus:scale-105'
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>

                        <label htmlFor='address' className='block font-semibold mt-3'>Address</label>
                        <textarea
                            name="address"
                            placeholder="Your full address"
                            className="w-full p-3 rounded text-black outline-none bg-white transition-transform duration-300 ease-in-out focus:scale-105"
                            onChange={handleChange}
                        ></textarea>

                        <label htmlFor='image' className='block font-semibold mt-3'>Upload Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full p-3 rounded text-black outline-none bg-white mb-3"
                        />

                        <Button type="submit" className='flex place-self-center'>Submit</Button>
                    </>
                )}
            </motion.form>
        </div>
    );
};

export default Detail;
