import React from 'react';

const Refresh = ({ lastRefresh, refreshData }) => {
  return (
    <div className="refresh-container">
      <button onClick={refreshData} className="btn">
        Refresh Data
      </button>
      <span className="last-refreshed">Last Refreshed: {lastRefresh}</span>
    </div>
  );
};

export default Refresh;
