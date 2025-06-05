import React, { useState, useEffect } from 'react'

const ContactSearch = ({ contactData, addAdhocEmail }) => {
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState(contactData || [])

  useEffect(() => {
    setFiltered(
      contactData.filter(c =>
        Object.values(c).some(val =>
          val.toLowerCase().includes(query.toLowerCase())
        )
      )
    )
  }, [query, contactData])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search contacts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '100%',
            maxWidth: '300px',
            borderRadius: '6px',
            border: '1px solid #444',
            backgroundColor: '#222',
            color: '#f4f1ee'
          }}
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
          onClick={() => window.fortnocAPI?.openFile?.('contacts.xlsx')}
          style={{
            padding: '0.5rem 1rem',
            background: '#5e3b2c',
            color: '#f4f1ee',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Open Contact List Excel
        </button>
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {filtered.map((contact, i) => (
            <div key={i} style={{ background: '#3a312d', padding: '1rem', borderRadius: '6px', color: '#f4f1ee' }}>
              <strong>{contact.Name}</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>{contact.Title}</p>
              <p style={{ margin: 0 }}>{contact.Email}</p>
              <p style={{ margin: 0 }}>{contact.Phone}</p>
              <button
                onClick={() => addAdhocEmail(contact.Email)}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  background: '#4e7267',
                  color: '#f4f1ee',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                Add to Email List
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#aaa' }}>No matching contacts.</p>
      )}
    </div>
  )
}

export default ContactSearch
