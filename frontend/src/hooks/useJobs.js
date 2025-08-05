import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useJobs = (user, token, showMessage) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchJobs();
    }
  }, [user, token]);

  const fetchJobs = async () => {
    try {
      const response = await apiService.getJobs(token);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      showMessage('Failed to fetch jobs', 'error');
    }
  };

  const addJob = async (jobData) => {
    if (!jobData.id || !jobData.deadline || !jobData.profit) {
      showMessage('Please fill in all fields', 'error');
      return false;
    }

    if (parseInt(jobData.deadline) <= 0 || parseInt(jobData.profit) <= 0) {
      showMessage('Deadline and profit must be positive numbers', 'error');
      return false;
    }

    setLoading(true);
    try {
      const response = await apiService.addJob({
        id: jobData.id,
        deadline: parseInt(jobData.deadline),
        profit: parseInt(jobData.profit)
      }, token);

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
        showMessage('Job added successfully', 'success');
        return true;
      } else {
        const error = await response.json();
        showMessage(error.error || 'Failed to add job', 'error');
        return false;
      }
    } catch (error) {
      showMessage('Failed to add job', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm(`Are you sure you want to delete job "${jobId}"?`)) {
      return false;
    }

    setLoading(true);
    try {
      const response = await apiService.deleteJob(jobId, token);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
        showMessage('Job deleted successfully', 'success');
        return true;
      } else {
        const error = await response.json();
        showMessage(error.error || 'Failed to delete job', 'error');
        return false;
      }
    } catch (error) {
      showMessage('Failed to delete job', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleJobDone = async (jobId) => {
    try {
      const response = await apiService.toggleJobDone(jobId, token);
      if (response.ok) {
        const updatedJobs = await response.json();
        setJobs(updatedJobs);
        showMessage('Job status updated', 'success');
        return true;
      } else {
        showMessage('Failed to update job status', 'error');
        return false;
      }
    } catch (error) {
      showMessage('Failed to update job status', 'error');
      return false;
    }
  };

  return {
    jobs,
    loading,
    addJob,
    deleteJob,
    toggleJobDone,
    fetchJobs
  };
};