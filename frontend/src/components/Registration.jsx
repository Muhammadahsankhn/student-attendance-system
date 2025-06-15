import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';



const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.user_id) {
        localStorage.setItem('user_id', data.user_id);
        alert('Registration successful! Please fill in your details.');
        navigate('/detail', { state: { role: formData.role } });
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="bg-transparent  rounded w-1/2 max-w-[20rem] flex flex-col justify-center items-center"
        autoComplete="off"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Registration</h1>

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="mb-4 p-2 border rounded w-[80%]"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="mb-4 p-2 border rounded w-[80%] "
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-4 p-2 border rounded w-[80%]"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mb-4 p-2 border rounded w-[80%]"
        />

        <select
          name="role"
          id="role"
          required
          value={formData.role || ""}
          onChange={handleChange}
          className="w-[80%] p-3 rounded text-black outline-none  mb-4"
        >
          <option disabled value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

       
        <Button type="submit" disabled={loading} className='w-[80%]'>{loading ? 'Registering...' : 'Register'}</Button>

      </form>
    </div>

  );
};

export default Registration;
