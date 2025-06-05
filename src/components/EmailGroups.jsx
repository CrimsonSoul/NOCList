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
      const url = `https://teams.microsoft.com/l/meeting/new?attendees=${encodeURIComponent(mergedEmails.join(';'))}`
      window.open(url, '_blank')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => window.fortnocAPI?.openFile?.('groups.xlsx')}
          style={{
            background: '#5e3b2c',
            color: '#f4f1ee',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Open Email Groups Excel
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search groups..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#222',
            color: '#f4f1ee'
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              background: 'transparent',
              color: '#aaa',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {filteredGroups.map(group => (
          <button
            key={group.name}
            onClick={() => toggleSelect(group.name)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedGroups.includes(group.name) ? '#82614f' : '#444',
              color: '#f4f1ee',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {group.name}
            <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#c8bfb7' }}>
              ({group.emails.length})
            </span>
          </button>
        ))}
        {(selectedGroups.length > 0 || adhocEmails.length > 0) && (
          <button onClick={clearAll} style={{ padding: '0.5rem 1rem', background: '#59493f', color: '#f4f1ee', border: 'none', borderRadius: '4px' }}>
            Clear All
          </button>
        )}
      </div>

      {mergedEmails.length > 0 && (
        <>
          <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={copyToClipboard} style={{ background: '#4e7267', color: '#f4f1ee', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
              Copy Email List
            </button>
            <button onClick={launchTeams} style={{ background: '#5e3b2c', color: '#f4f1ee', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
              Start Teams Meeting
            </button>
            {copied && <span style={{ color: 'lightgreen', alignSelf: 'center' }}>Copied</span>}
          </div>
          <div style={{ background: '#2e261f', padding: '1rem', borderRadius: '4px', color: '#f4f1ee' }}>
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
