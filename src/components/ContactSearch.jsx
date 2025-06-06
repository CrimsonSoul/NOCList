import React, { useState, useEffect } from 'react'

const ContactSearch = ({ contactData, addAdhocEmail }) => {
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState(contactData || [])

  useEffect(() => {
    setFiltered(
      contactData.filter(c =>
        Object.values(c).some(val =>
          String(val).toLowerCase().includes(query.toLowerCase())
        )
      )
    )
  }, [query, contactData])

  return (
    <div>
      <div className="stack-on-small" style={{ alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search contacts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input"
          style={{ width: '100%', maxWidth: '300px', borderRadius: '6px' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
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
        <button
          onClick={() => window.nocListAPI?.openFile?.('contacts.xlsx')}
          className="btn btn-secondary"
          style={{ borderRadius: '6px' }}
        >
          Open Contact List Excel
        </button>
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {filtered.map((contact, i) => (
            <div key={i} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', color: 'var(--text-light)' }}>
              <strong>{contact.Name}</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>{contact.Title}</p>
              <p style={{ margin: 0 }}>{contact.Email}</p>
              <p style={{ margin: 0 }}>{contact.Phone}</p>
              <button
                onClick={() => addAdhocEmail(contact.Email)}
                className="btn"
                style={{ marginTop: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}
              >
                Add to Email List
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>No matching contacts.</p>
      )}
    </div>
  )
}

export default ContactSearch
