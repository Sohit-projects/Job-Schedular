import React from 'react';

const EarningsSummary = ({ totalPotential, completedEarnings, remainingPotential, progress }) => {
  return (
    <div className="earnings-summary">
      <div className="earnings-item">
        <h4>Total Potential</h4>
        <div className="amount">${totalPotential}</div>
      </div>
      <div className="earnings-item">
        <h4>Completed Earnings</h4>
        <div className="amount">${completedEarnings}</div>
      </div>
      <div className="earnings-item">
        <h4>Remaining Potential</h4>
        <div className="amount">${remainingPotential}</div>
      </div>
      <div className="earnings-item">
        <h4>Progress</h4>
        <div className="amount">{progress}</div>
      </div>
    </div>
  );
};

export default EarningsSummary;