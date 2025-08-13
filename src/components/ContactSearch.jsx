import React, { useState, useMemo } from 'react'
import { formatPhones } from '../utils/formatPhones'

/**
 * Provide a searchable list of contacts with quick email adding.
 * @param {Object} props
 * @param {Array} props.contactData - Parsed contact rows.
 * @param {(email: string) => void} props.addAdhocEmail - Callback to add emails.
 */
const ContactSearch = ({ contactData, addAdhocEmail }) => {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return contactData.filter((c) =>
      Object.values(c).some((val) =>
        String(val).toLowerCase().includes(q)
      )
    )
  }, [query, contactData])

  return (
    <div>
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: 'var(--bg-primary)',
          zIndex: 1,
          paddingBottom: '1rem',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => window.nocListAPI?.openFile?.('contacts.xlsx')}
            className="btn btn-secondary open-contact-btn"
            style={{ borderRadius: '6px' }}
          >
            Open Contact List Excel
          </button>
        </div>
        <div
          className="stack-on-small"
          style={{ alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}
        >
          <div
            style={{ position: 'relative', flex: '1 1 250px', minWidth: 0, maxWidth: '300px' }}
          >
            <input
              type="text"
              placeholder="Search contacts..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input"
              style={{ width: '100%', paddingRight: '2.25rem', borderRadius: '6px' }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="clear-btn"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 420px))',
            justifyContent: 'start',
            gap: '1rem'
          }}
        >
          {filtered.map((contact) => (
            <div key={contact.Email} className="contact-card">
              <strong>{contact.Name}</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                <span className="label">Title:</span> {contact.Title}
              </p>
              <p style={{ margin: 0 }}>
                <span className="label">Email:</span>{' '}
                <a
                  href={`mailto:${contact.Email}`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {contact.Email}
                </a>
              </p>
              <p style={{ margin: 0 }}>
                <span className="label">Phone:</span> {formatPhones(contact.Phone)}
              </p>
              <button
                onClick={() => addAdhocEmail(contact.Email)}
                className="btn"
                style={{
                  marginTop: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
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
