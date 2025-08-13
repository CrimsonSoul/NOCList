import React from 'react'

/**
 * Displays the current one-time code and a progress bar indicating
 * remaining validity time.
 * @param {Object} props
 * @param {string} props.currentCode
 * @param {string} props.previousCode
 * @param {number} props.progressKey - Forces animation restart when code updates.
 * @param {number} props.intervalMs - Duration of code validity in ms.
 */
const CodeDisplay = ({ currentCode, previousCode, progressKey, intervalMs }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
      Code: {currentCode}
    </div>
    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
      Prev: {previousCode || 'N/A'}
    </div>
    <div className="progress-container">
      <div
        key={progressKey}
        className="progress-bar"
        style={{ '--duration': `${intervalMs}ms` }}
      />
    </div>
  </div>
)

export default CodeDisplay
