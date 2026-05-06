import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const isAdmin = () => userRole === 'admin';

  const getAuthToken = () => localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setError('Failed to load tasks');
      }
      setLoading(false);
    }
  };

  const getUserInfo = () => {
    const token = getAuthToken();
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setUserRole(payload.role);
        setUserName(payload.name || payload.email);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    fetchTasks();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div>
          <h1>Training Tasks</h1>
          {userName && <p className="welcome-text">Welcome, {userName}!</p>}
        </div>
        {isAdmin() && (
          <div className="admin-badge">
            <span className="badge">Admin Access</span>
            <button className="create-task-btn">+ Create New Task</button>
          </div>
        )}
      </div>

      {!isAdmin() && (
        <div className="info-banner">
          ℹ️ You are viewing all tasks. You can only edit tasks assigned to you.
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks found.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              {/* Card Header - Title and Priority */}
              <div className="card-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                  {task.priority || 'Medium'}
                </span>
              </div>

              {/* Description */}
              {task.description && (
                <div className="task-description">
                  <p>{task.description}</p>
                </div>
              )}

              {/* Additional Info Grid */}
              <div className="task-details">
                <div className="detail-item">
                  <span className="detail-label">🐕 Dog:</span>
                  <span className="detail-value">{task.dog?.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👤 Trainer:</span>
                  <span className="detail-value">{task.trainer?.name || 'Unassigned'}</span>
                </div>
              </div>

              {/* Card Footer - Status and Due Date */}
              <div className="card-footer">
                <span className={`status-badge ${getStatusClass(task.status)}`}>
                  {task.status || 'Pending'}
                </span>
                <div className="due-date">
                  <span className="date-icon">📅</span>
                  <span className="date-text">{formatDate(task.dueDate)}</span>
                </div>
              </div>

              {/* Admin Actions */}
              {isAdmin() && (
                <div className="card-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isAdmin() && (
        <div className="admin-stats">
          <h3>Admin Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{tasks.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {tasks.filter(t => t.status === 'completed').length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {tasks.filter(t => t.priority === 'high').length}
              </span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;