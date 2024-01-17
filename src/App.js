import './App.css';
import React, { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/login';  // Correct the import case
import Dashboard from './pages/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  useEffect(() => {
    // Redirect to '/login' on component mount
    if (window.location.pathname == '/') {
      window.location.href = '/login';
      window.location.reload();
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          {/* Redirect to '/login' if the path doesn't match any of the above */}
          <Route path='/*' element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
