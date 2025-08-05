import React, { useState } from 'react';
import apiService from '../../services/api';
import ScheduledJob from './ScheduledJob';
import EarningsSummary from './EarningsSummary';

const ScheduleSection = ({ jobs, user, setUser, token, showMessage, loading }) => {
  const [schedule, setSchedule] = useState({ scheduled: [], totalProfit: 0 });
  const [completedScheduledJobs, setCompletedScheduledJobs] = useState(new Set());
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const scheduleJobs = async () => {
    const availableJobs = jobs.filter(job => !job.done);
    if (availableJobs.length === 0) {
      showMessage('No available jobs to schedule', 'error');
      return;
    }

    setScheduleLoading(true);
    try {
      const response = await apiService.scheduleJobs(token);
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
      setScheduleLoading(false);
    }
  };

  const markScheduledJobComplete = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    try {
      const response = await apiService.updateEarnings(job.profit, token);
      if (response.ok) {
        const data = await response.json();
        
        const newCompletedJobs = new Set(completedScheduledJobs);
        newCompletedJobs.add(jobId);
        setCompletedScheduledJobs(newCompletedJobs);
        
        setUser(prev => ({ ...prev, totalEarnings: data.totalEarnings }));
        showMessage(`Job ${jobId} completed! Earned ${job.profit}`, 'success');
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

  return (
    <div className="section schedule-section">
      <h2>Job Scheduling</h2>
      <div className="schedule-controls">
        <button
          onClick={scheduleJobs}
          className="btn btn-success"
          disabled={scheduleLoading || jobs.filter(j => !j.done).length === 0}
        >
          {scheduleLoading ? <span className="loading-spinner"></span> : 'Generate Optimal Schedule'}
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
            {schedule.scheduled.map((jobId, index) => (
              <ScheduledJob
                key={jobId}
                jobId={jobId}
                dayNumber={index + 1}
                job={jobs.find(j => j.id === jobId)}
                isCompleted={completedScheduledJobs.has(jobId)}
                onComplete={() => markScheduledJobComplete(jobId)}
              />
            ))}
          </div>
          
          {schedule.scheduled.length > 0 && (
            <EarningsSummary
              totalPotential={schedule.totalProfit}
              completedEarnings={getCompletedEarnings()}
              remainingPotential={getRemainingPotential()}
              progress={`${completedScheduledJobs.size}/${schedule.scheduled.length}`}
            />
          )}
        </div>
      )}

      {jobs.filter(j => !j.done).length === 0 && jobs.length > 0 && (
        <div className="empty-state">
          All jobs are marked as completed. Add new jobs or mark some as pending to schedule.
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;