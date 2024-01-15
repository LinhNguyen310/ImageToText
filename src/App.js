import './App.css';
import React  from 'react';
import Home from './pages/Home';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import { Routes } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/' element={<Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
