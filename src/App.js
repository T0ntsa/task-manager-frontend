import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Tasks from './components/Tasks';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        {localStorage.getItem('token') && (
          <nav className="navbar">
            <div className="nav-brand">
              <h2>🐾 Dog Training Task Manager</h2>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </nav>
        )}
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;