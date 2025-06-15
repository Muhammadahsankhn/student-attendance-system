// Button.js
import React from 'react';

const Button = ({ type = 'button', onClick, children, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition cursor-pointer  ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
