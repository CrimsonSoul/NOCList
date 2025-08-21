import React, { useState } from 'react'

/**
 * Embeds the Dispatcher Radar page and provides a fallback if it fails to load.
 */
const DispatcherRadar = () => {
  const [error, setError] = useState(false)

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    background: 'var(--bg-secondary)',
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {error ? (
        <div className="text-center" style={{ padding: '1rem' }}>
          <p className="mb-1">Unable to load Dispatcher Radar.</p>
          <a
            href="https://cw-intra-web/CWDashboard/Home/Radar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Open Dispatcher Radar
          </a>
        </div>
      ) : (
        <iframe
          src="https://cw-intra-web/CWDashboard/Home/Radar"
          title="Dispatcher Radar"
          style={iframeStyle}
          className="minimal-scrollbar"
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}

export default DispatcherRadar
