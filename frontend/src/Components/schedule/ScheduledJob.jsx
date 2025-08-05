import React from 'react';

const ScheduledJob = ({ jobId, dayNumber, job, isCompleted, onComplete }) => {
  return (
    <div className={`scheduled-job ${isCompleted ? 'completed' : ''}`}>
      <span>Day {dayNumber}: Job {jobId} (${job?.profit || 0})</span>
      {!isCompleted && (
        <button 
          onClick={onComplete}
          title={`Mark job ${jobId} as complete and earn ${job?.profit || 0}`}
        >
          ✓ Complete
        </button>
      )}
      {isCompleted && <span>✓ Done</span>}
    </div>
  );
};

export default ScheduledJob;