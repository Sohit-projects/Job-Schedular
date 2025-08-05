import React from 'react';
import JobItem from '../../Components/jobs/JobItem';

const JobList = ({ jobs, onToggleDone, onDelete, loading }) => {
  return (
    <div className="section">
      <h2>Your Jobs ({jobs.length})</h2>
      <div className="jobs-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            No jobs added yet. Add your first job to get started!
          </div>
        ) : (
          jobs.map((job) => (
            <JobItem
              key={job.id}
              job={job}
              onToggleDone={onToggleDone}
              onDelete={onDelete}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JobList;