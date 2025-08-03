import React, { useState, useEffect } from 'react';
import './App.css';

// const API_BASE = 'http://localhost:5000';
const API_BASE = 'https://job-schedular-2fdk.onrender.com/'; // Replace with your actual API base URL
// Auth Context
const AuthContext = React.createContext();

// Login Component
const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user, data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Job Scheduler</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? 
          <button onClick={onSwitchToRegister} className="link-button">Register here</button>
        </p>
      </div>
    </div>
  );
};

// Register Component
const RegisterForm = ({ onLogin, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user, data.token);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for Job Scheduler</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              minLength="3"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? 
          <button onClick={onSwitchToLogin} className="link-button">Login here</button>
        </p>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [schedule, setSchedule] = useState({ scheduled: [], totalProfit: 0 });
  const [completedScheduledJobs, setCompletedScheduledJobs] = useState(new Set());
  const [newJob, setNewJob] = useState({ id: '', deadline: '', profit: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch jobs when user logs in
  useEffect(() => {
    if (user && token) {
      fetchJobs();
    }
  }, [user, token]);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setJobs([]);
    setSchedule({ scheduled: [], totalProfit: 0 });
    setCompletedScheduledJobs(new Set());
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/get-jobs`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      showMessage('Failed to fetch jobs', 'error');
    }
  };

  const addJob = async (e) => {
    e.preventDefault();
    
    if (!newJob.id || !newJob.deadline || !newJob.profit) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (parseInt(newJob.deadline) <= 0 || parseInt(newJob.profit) <= 0) {
      showMessage('Deadline and profit must be positive numbers', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/add-job`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: newJob.id,
          deadline: parseInt(newJob.deadline),
          profit: parseInt(newJob.profit)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
        setNewJob({ id: '', deadline: '', profit: '' });
        showMessage('Job added successfully', 'success');
      } else {
        const error = await response.json();
        showMessage(error.error || 'Failed to add job', 'error');
      }
    } catch (error) {
      showMessage('Failed to add job', 'error');
    } finally {
      setLoading(false);
    }
  };

  const scheduleJobs = async () => {
    const availableJobs = jobs.filter(job => !job.done);
    if (availableJobs.length === 0) {
      showMessage('No available jobs to schedule', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/schedule`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
        setCompletedScheduledJobs(new Set());
        showMessage('Jobs scheduled successfully', 'success');
      } else {
        showMessage('Failed to schedule jobs', 'error');
      }
    } catch (error) {
      showMessage('Failed to schedule jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleJobDone = async (jobId) => {
    try {
      const response = await fetch(`${API_BASE}/toggle-done`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: jobId })
      });

      if (response.ok) {
        const updatedJobs = await response.json();
        setJobs(updatedJobs);
        showMessage('Job status updated', 'success');
      } else {
        showMessage('Failed to update job status', 'error');
      }
    } catch (error) {
      showMessage('Failed to update job status', 'error');
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm(`Are you sure you want to delete job "${jobId}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/delete-job/${encodeURIComponent(jobId)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
        showMessage('Job deleted successfully', 'success');
        
        if (schedule.scheduled.includes(jobId)) {
          setSchedule({ scheduled: [], totalProfit: 0 });
        }
      } else {
        const error = await response.json();
        showMessage(error.error || 'Failed to delete job', 'error');
      }
    } catch (error) {
      showMessage('Failed to delete job', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markScheduledJobComplete = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    try {
      // Update user earnings in database
      const response = await fetch(`${API_BASE}/update-earnings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount: job.profit })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        const newCompletedJobs = new Set(completedScheduledJobs);
        newCompletedJobs.add(jobId);
        setCompletedScheduledJobs(newCompletedJobs);
        
        // Update user's total earnings
        setUser(prev => ({ ...prev, totalEarnings: data.totalEarnings }));
        
        showMessage(`Job ${jobId} completed! Earned $${job.profit}`, 'success');
      } else {
        showMessage('Failed to update earnings', 'error');
      }
    } catch (error) {
      showMessage('Failed to update earnings', 'error');
    }
  };

  const getCompletedEarnings = () => {
    return Array.from(completedScheduledJobs).reduce((total, jobId) => {
      const job = jobs.find(j => j.id === jobId);
      return total + (job ? job.profit : 0);
    }, 0);
  };

  const getRemainingPotential = () => {
    return schedule.scheduled
      .filter(jobId => !completedScheduledJobs.has(jobId))
      .reduce((total, jobId) => {
        const job = jobs.find(j => j.id === jobId);
        return total + (job ? job.profit : 0);
      }, 0);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  // Show auth forms if not logged in
  if (!user) {
    return showRegister ? (
      <RegisterForm 
        onLogin={handleLogin} 
        onSwitchToLogin={() => setShowRegister(false)} 
      />
    ) : (
      <LoginForm 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setShowRegister(true)} 
      />
    );
  }

  // Main app for authenticated users
  return (
    <div className="app">
      <div className="header">
        <h1>Job Scheduling System</h1>
        <p>Optimize your job scheduling with maximum profit algorithm</p>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <span>Total Earnings: ${user.totalEarnings}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>

      {message.text && (
        <div className={`${message.type === 'error' ? 'error-message' : 'success-message'}`}>
          {message.text}
        </div>
      )}

      <div className="main-content">
        <div className="section">
          <h2>Add New Job</h2>
          <form onSubmit={addJob}>
            <div className="form-group">
              <label htmlFor="jobId">Job ID</label>
              <input
                type="text"
                id="jobId"
                name="id"
                value={newJob.id}
                onChange={handleInputChange}
                placeholder="Enter unique job ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="deadline">Deadline (days)</label>
              <input
                type="number"
                id="deadline"
                name="deadline"
                value={newJob.deadline}
                onChange={handleInputChange}
                placeholder="Enter deadline in days"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="profit">Profit ($)</label>
              <input
                type="number"
                id="profit"
                name="profit"
                value={newJob.profit}
                onChange={handleInputChange}
                placeholder="Enter profit amount"
                min="1"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : 'Add Job'}
            </button>
          </form>
        </div>

        <div className="section">
          <h2>Your Jobs ({jobs.length})</h2>
          <div className="jobs-list">
            {jobs.length === 0 ? (
              <div className="empty-state">
                No jobs added yet. Add your first job to get started!
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className={`job-item ${job.done ? 'done' : ''}`}>
                  <div className="job-info">
                    <h4>Job {job.id}</h4>
                    <div className="job-details">
                      <span>Deadline: {job.deadline} days</span>
                      <span>Profit: ${job.profit}</span>
                      <span>Status: {job.done ? 'Completed' : 'Pending'}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button
                      onClick={() => toggleJobDone(job.id)}
                      className="btn btn-secondary"
                    >
                      {job.done ? 'Mark Pending' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="section schedule-section">
        <h2>Job Scheduling</h2>
        <div className="schedule-controls">
          <button
            onClick={scheduleJobs}
            className="btn btn-success"
            disabled={loading || jobs.filter(j => !j.done).length === 0}
          >
            {loading ? <span className="loading-spinner"></span> : 'Generate Optimal Schedule'}
          </button>
          {schedule.totalProfit > 0 && (
            <div className="profit-display">
              Total Profit: ${schedule.totalProfit}
            </div>
          )}
        </div>

        {schedule.scheduled.length > 0 && (
          <div className="schedule-result">
            <h3>Optimal Schedule</h3>
            <p>
              <strong>{schedule.scheduled.length}</strong> jobs scheduled for maximum profit of{' '}
              <strong>${schedule.totalProfit}</strong>
            </p>
            <div className="scheduled-jobs">
              {schedule.scheduled.map((jobId, index) => {
                const isCompleted = completedScheduledJobs.has(jobId);
                const job = jobs.find(j => j.id === jobId);
                return (
                  <div 
                    key={jobId} 
                    className={`scheduled-job ${isCompleted ? 'completed' : ''}`}
                  >
                    <span>Day {index + 1}: Job {jobId} (${job?.profit || 0})</span>
                    {!isCompleted && (
                      <button 
                        onClick={() => markScheduledJobComplete(jobId)}
                        title={`Mark job ${jobId} as complete and earn ${job?.profit || 0}`}
                      >
                        ✓ Complete
                      </button>
                    )}
                    {isCompleted && <span>✓ Done</span>}
                  </div>
                );
              })}
            </div>
            
            {schedule.scheduled.length > 0 && (
              <div className="earnings-summary">
                <div className="earnings-item">
                  <h4>Total Potential</h4>
                  <div className="amount">${schedule.totalProfit}</div>
                </div>
                <div className="earnings-item">
                  <h4>Completed Earnings</h4>
                  <div className="amount">${getCompletedEarnings()}</div>
                </div>
                <div className="earnings-item">
                  <h4>Remaining Potential</h4>
                  <div className="amount">${getRemainingPotential()}</div>
                </div>
                <div className="earnings-item">
                  <h4>Progress</h4>
                  <div className="amount">
                    {completedScheduledJobs.size}/{schedule.scheduled.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {jobs.filter(j => !j.done).length === 0 && jobs.length > 0 && (
          <div className="empty-state">
            All jobs are marked as completed. Add new jobs or mark some as pending to schedule.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;