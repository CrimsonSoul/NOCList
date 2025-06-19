import React, { useMemo, useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'

const EmailGroups = ({ emailData, adhocEmails, selectedGroups, setSelectedGroups, setAdhocEmails }) => {
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
    const term = search.toLowerCase()
    return groups.filter((group) => group.name.toLowerCase().includes(term))
  }, [groups, search])

  const groupMap = useMemo(
    () => new Map(groups.map((g) => [g.name, g.emails])),
    [groups]
  )

  const mergedEmails = useMemo(() => {
    const all = selectedGroups.flatMap((name) => groupMap.get(name) || [])
    return [...new Set([...all, ...adhocEmails])]
  }, [selectedGroups, groupMap, adhocEmails])

  const toggleSelect = useCallback(
    (name) => {
      setSelectedGroups((prev) =>
        prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
      )
    },
    [setSelectedGroups]
  )

  const clearAll = useCallback(() => {
    setSelectedGroups([])
    setAdhocEmails([])
  }, [setSelectedGroups, setAdhocEmails])

  const copyToClipboard = useCallback(async () => {
    if (mergedEmails.length === 0) return
    try {
      await navigator.clipboard.writeText(mergedEmails.join(', '))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Email list copied to clipboard')
    } catch {
      toast.error('Failed to copy')
    }
  }, [mergedEmails])

  const launchTeams = useCallback(() => {
    if (mergedEmails.length === 0) return
    const now = new Date()
    const title = `${now.getMonth() + 1}/${now.getDate()}`
    const url =
      `https://teams.microsoft.com/l/meeting/new?subject=${encodeURIComponent(
        title
      )}&attendees=${encodeURIComponent(mergedEmails.join(','))}`
    window.nocListAPI?.openExternal?.(url)
    toast.success('Opening Teams meeting')
  }, [mergedEmails])

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
        <div style={{ position: 'relative', flex: '1 1 250px', maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input"
            style={{ width: '100%', paddingRight: '1.75rem' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="clear-btn"
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
            className="btn fade-in"
            style={{
              background: selectedGroups.includes(group.name)
                ? 'var(--button-active)'
                : 'var(--button-bg)',
              color: 'var(--text-light)'
            }}
          >
            {group.name}
            <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              ({group.emails.length})
            </span>
          </button>
        ))}
        {(selectedGroups.length > 0 || adhocEmails.length > 0) && (
          <button onClick={clearAll} className="btn btn-secondary fade-in">
            Clear All
          </button>
        )}
      </div>

      {mergedEmails.length > 0 && (
        <>
          <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={copyToClipboard} className="btn fade-in">
              Copy Email List
            </button>
            <button onClick={launchTeams} className="btn btn-secondary fade-in">
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
