import React from 'react';

const Tabs = ({ tab, setTab }) => {
  return (
    <div className="tabs-container">
      <div
        onClick={() => setTab('email')}
        className={`tab ${tab === 'email' ? 'active' : ''}`}
      >
        Email Groups
      </div>
      <div
        onClick={() => setTab('contact')}
        className={`tab ${tab === 'contact' ? 'active' : ''}`}
      >
        Contact Search
      </div>
    </div>
  );
};

export default Tabs;
