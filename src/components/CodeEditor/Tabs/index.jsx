import React from 'react';
import './index.css';

const Tabs = ({ activeTab, onTabChange, onRun }) => {
  const tabs = ['html', 'css', 'js'];

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <button className="run-button" onClick={onRun}>
        Run
      </button>
    </div>
  );
};

export default Tabs;