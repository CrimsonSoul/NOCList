import React, { useEffect, useMemo, useState } from 'react'

const EmailGroups = ({ emailData, adhocEmails, selectedGroups, setSelectedGroups, setAdhocEmails }) => {
  const [mergedEmails, setMergedEmails] = useState([])
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')

  const groups = useMemo(() => {
    if (emailData.length === 0) return []
    const [headers, ...rows] = emailData
    return headers.map((name, i) => ({
      name,
      emails: rows.map(row => row[i]).filter(Boolean)
    }))
  }, [emailData])

  const filteredGroups = useMemo(() => {
    return groups.filter(group =>
      group.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [groups, search])

  useEffect(() => {
    const all = selectedGroups.flatMap(name => {
      const group = groups.find(g => g.name === name)
      return group ? group.emails : []
    })
    const combined = [...new Set([...all, ...adhocEmails])]
    setMergedEmails(combined)
  }, [selectedGroups, groups, adhocEmails])

  const toggleSelect = name => {
    setSelectedGroups(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const clearAll = () => {
    setSelectedGroups([])
    setAdhocEmails([])
  }

  const copyToClipboard = () => {
    if (mergedEmails.length > 0) {
      navigator.clipboard.writeText(mergedEmails.join(', '))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const launchTeams = () => {
    if (mergedEmails.length > 0) {
      const url = `https://teams.microsoft.com/l/meeting/new?attendees=${encodeURIComponent(mergedEmails.join(','))}`
      window.nocListAPI?.openExternal?.(url)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => window.nocListAPI?.openFile?.('groups.xlsx')}
          className="btn btn-secondary"
        >
          Open Email Groups Excel
        </button>
      </div>

      <div className="stack-on-small" style={{ alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input"
            style={{ width: '100%', paddingRight: '1.5rem' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'transparent',
                color: '#aaa',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                position: 'absolute',
                right: '0.25rem',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {filteredGroups.map(group => (
          <button
            key={group.name}
            onClick={() => toggleSelect(group.name)}
            className="btn"
            style={{
              background: selectedGroups.includes(group.name) ? 'var(--accent)' : '#444'
            }}
          >
            {group.name}
            <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#c8bfb7' }}>
              ({group.emails.length})
            </span>
          </button>
        ))}
        {(selectedGroups.length > 0 || adhocEmails.length > 0) && (
          <button onClick={clearAll} className="btn btn-secondary">
            Clear All
          </button>
        )}
      </div>

      {mergedEmails.length > 0 && (
        <>
          <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={copyToClipboard} className="btn">
              Copy Email List
            </button>
            <button onClick={launchTeams} className="btn btn-secondary">
              Start Teams Meeting
            </button>
            {copied && <span style={{ color: 'lightgreen', alignSelf: 'center' }}>Copied</span>}
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '4px', color: 'var(--text-light)' }}>
            <strong>Merged Emails:</strong>
            <div style={{ wordBreak: 'break-word', marginTop: '0.5rem' }}>
              {mergedEmails.join(', ')}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default EmailGroups
