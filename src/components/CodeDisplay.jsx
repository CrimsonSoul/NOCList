import React from 'react'

/**
 * Displays the current one-time code and a progress bar indicating
 * remaining validity time.
 * @param {Object} props
 * @param {string} props.currentCode
 * @param {string} props.previousCode
 * @param {number} props.progressKey - Forces animation restart when code updates.
 */
const CodeDisplay = ({ currentCode, previousCode, progressKey }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
      Code: {currentCode}
    </div>
    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
      Prev: {previousCode || 'N/A'}
    </div>
    <div className="progress-container">
      <div key={progressKey} className="progress-bar" />
    </div>
  </div>
)

export default CodeDisplay
