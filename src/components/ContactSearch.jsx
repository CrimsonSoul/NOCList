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

  const indexedContacts = useMemo(
    () =>
      contactData.map((c) => ({
        ...c,
        _search: Object.values(c).join(' ').toLowerCase(),
      })),
    [contactData]
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return indexedContacts.filter((c) => c._search.includes(q))
  }, [query, indexedContacts])

  return (
    <div>
      <div className="sticky-header">
        <div className="mb-1">
          <button
            onClick={() => window.nocListAPI?.openFile?.('contacts.xlsx')}
            className="btn btn-secondary open-contact-btn rounded-6"
          >
            Open Contact List Excel
          </button>
        </div>
        <div className="stack-on-small align-center gap-0-5 mb-1">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search contacts..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input rounded-6 search-input"
              style={{ '--clear-btn-space': '2.25rem' }}
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
            <p className="m-0 mt-0-5">
              <span className="label">Title:</span> {contact.Title}
            </p>
            <p className="m-0">
              <span className="label">Email:</span>{' '}
              <a
                href={`mailto:${contact.Email}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {contact.Email}
              </a>
            </p>
            <p className="m-0">
              <span className="label">Phone:</span> {formatPhones(contact.Phone)}
            </p>
            <button
              onClick={() => addAdhocEmail(contact.Email)}
              className="btn btn-small rounded-6 mt-0-5"
            >
              Add to Email List
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted">No matching contacts.</p>
    )}
  </div>
  )
}

export default ContactSearch
