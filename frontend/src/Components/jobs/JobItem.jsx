import React from 'react';

const JobItem = ({ job, onToggleDone, onDelete, loading }) => {
  return (
    <div className={`job-item ${job.done ? 'done' : ''}`}>
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
          onClick={() => onToggleDone(job.id)}
          className="btn btn-secondary"
        >
          {job.done ? 'Mark Pending' : 'Mark Done'}
        </button>
        <button
          onClick={() => onDelete(job.id)}
          className="btn btn-danger"
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobItem;