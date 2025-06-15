import React, { useEffect, useState } from 'react';
import AttendanceResult from "./ui/AttendanceResult";

const AttendanceStatusPage = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const markAttendance = async () => {
      try {
        const url = new URL(window.location.href);
        const userId = url.searchParams.get('id');

        if (!userId) {
          setStatus('error'); // Missing ID
          return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000); // optional timeout

        const res = await fetch(`http://192.168.23.144:5000/mark_attendance/${userId}`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) throw new Error('Network response was not ok');

        const data = await res.json();
        if (['success', 'already', 'error'].includes(data.status)) {
          setStatus(data.status);
        } else {
          setStatus('error'); // unexpected status
        }
      } catch (err) {
        console.error('Attendance error:', err);
        setStatus('error');
      }
    };

    markAttendance();
  }, []);

  return status ? (
    <AttendanceResult status={status} />
  ) : (
    <div className="h-screen flex items-center justify-center text-lg text-gray-600">
      Marking your attendance...
    </div>
  );
};

export default AttendanceStatusPage;
