import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <div className="header">
      <h1>Job Scheduling System</h1>
      <p>Optimize your job scheduling with maximum profit algorithm</p>
      <div className="user-info">
        <span>Welcome, {user.username}!</span>
        <span>Total Earnings: ${user.totalEarnings}</span>
        <button onClick={onLogout} className="btn btn-secondary">Logout</button>
      </div>
    </div>
  );
};

export default Header;