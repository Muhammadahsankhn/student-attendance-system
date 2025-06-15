
import React from 'react';

import PropTypes from 'prop-types';

const AttendanceResult = ({ status }) => {
  let title = '';
  let message = '';
  let color = '';

  switch (status) {
    case 'success':
      title = '✅ Attendance Marked';
      message = 'Your attendance has been recorded successfully.';
      color = 'text-green-600';
      break;
    case 'already':
      title = '⚠️ Already Marked';
      message = 'You have already marked attendance today.';
      color = 'text-yellow-500';
      break;
    default:
      title = '❌ Error';
      message = 'Something went wrong. Please try again.';
      color = 'text-red-600';
      break;
  }

  return (
    <div
      className="bg-gradient-to-br from-green-100 to-blue-100 h-screen flex items-center justify-center px-4"
      aria-live="polite"
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <h1 className={`text-3xl font-bold mb-4 ${color}`}>{title}</h1>
        <p className="text-lg text-gray-800">{message}</p>
      </div>
    </div>
  );
};

AttendanceResult.propTypes = {
  status: PropTypes.oneOf(['success', 'already', 'error']),
};

AttendanceResult.defaultProps = {
  status: 'error',
};

export default AttendanceResult;
