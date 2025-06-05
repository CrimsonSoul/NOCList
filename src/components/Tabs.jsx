import React, { useState } from 'react'
import EmailGroups from './EmailGroups'
import ContactSearch from './ContactSearch'

const Tabs = ({ sharedData, adhocEmails, addAdhocEmail, selectedGroups, setSelectedGroups, setAdhocEmails }) => {
  const [activeTab, setActiveTab] = useState('groups')

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('groups')} style={{ padding: '0.5rem 1.2rem' }}>
          Groups
        </button>
        <button onClick={() => setActiveTab('contacts')} style={{ padding: '0.5rem 1.2rem' }}>
          Contacts
        </button>
      </div>
      {activeTab === 'groups' && (
        <EmailGroups
          emailData={sharedData.emailData}
          adhocEmails={adhocEmails}
          setAdhocEmails={setAdhocEmails}
          selectedGroups={selectedGroups}
          setSelectedGroups={setSelectedGroups}
        />
      )}
      {activeTab === 'contacts' && (
        <ContactSearch
          contactData={sharedData.contactData}
          addAdhocEmail={addAdhocEmail}
        />
      )}
    </div>
  )
}

export default Tabs
