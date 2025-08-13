import React from 'react'

/**
 * Renders the Email/Contact tab selector.
 * @param {Object} props
 * @param {'email'|'contact'} props.tab - Currently active tab.
 * @param {(tab: string) => void} props.setTab - Update active tab.
 */
const TabSelector = ({ tab, setTab }) => (
  <div
    className="stack-on-small"
    style={{
      gap: '2rem',
      borderBottom: '1px solid var(--border-color)',
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem',
      fontSize: '1.05rem'
    }}
  >
    {['email', 'contact'].map((t) => (
      <button
        key={t}
        type="button"
        onClick={() => setTab(t)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setTab(t)
          }
        }}
        style={{
          cursor: 'pointer',
          paddingBottom: '0.25rem',
          border: 'none',
          background: 'transparent',
          borderBottom:
            tab === t ? '3px solid var(--accent)' : '3px solid transparent',
          color: tab === t ? 'var(--text-light)' : 'var(--text-muted)',
          fontWeight: tab === t ? 'bold' : 'normal'
        }}
      >
        {t === 'email' ? 'Email Groups' : 'Contact Search'}
      </button>
    ))}
  </div>
)

export default TabSelector
