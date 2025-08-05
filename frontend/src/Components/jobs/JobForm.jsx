import React, { useState } from 'react';

const JobForm = ({ onAddJob, loading }) => {
  const [formData, setFormData] = useState({ id: '', deadline: '', profit: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAddJob(formData);
    if (success) {
      setFormData({ id: '', deadline: '', profit: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="section">
      <h2>Add New Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jobId">Job ID</label>
          <input
            type="text"
            id="jobId"
            name="id"
            value={formData.id}
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
            value={formData.deadline}
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
            value={formData.profit}
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
  );
};

export default JobForm;