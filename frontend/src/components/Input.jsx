import React from 'react'

const Input = ({ label, name, type = 'text', value, onChange, placeholder }) => {
    return (
        <div className="mb-4">
            {label && <label htmlFor={name} className="block mb-1 font-semibold">{label}</label>}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-2 rounded border bg-white text-black outline-none transition-transform duration-300 ease-in-out focus:scale-105"
                required
            />
        </div>
    )
}

export default Input