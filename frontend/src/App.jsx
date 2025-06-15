import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthSlider from './components/AuthSlider';
import Detail from './components/Detail';
import Card from './components/Card';
import AttendanceStatusPage from './components/AttendanceStatusPage';
import CursorDot from './components/CursorDot';
import Admin from './components/ui/Admin';

const App = () => {
  return (
    <Router>
      <div>
        {/* Global cursor dot */}
        <CursorDot />

        {/* Your full app with routes */}
        <Routes>
          <Route path="/" element={<AuthSlider />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/card" element={<Card />} />
          <Route path="/attendance" element={<AttendanceStatusPage />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
