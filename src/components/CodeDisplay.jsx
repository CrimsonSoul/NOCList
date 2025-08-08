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
  <div
    style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      padding: '0.5rem 1rem',
      textAlign: 'center',
      fontSize: '0.9rem'
    }}
  >
    <div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
      Code: {currentCode}
    </div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
      Prev: {previousCode || 'N/A'}
    </div>
    <div className="progress-container">
      <div key={progressKey} className="progress-bar" />
    </div>
  </div>
)

export default CodeDisplay
