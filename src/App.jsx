import React, { useEffect, useState } from 'react'
import EmailGroups from './components/EmailGroups'
import ContactSearch from './components/ContactSearch'
import { Toaster, toast } from 'react-hot-toast'

function App() {
  const [selectedGroups, setSelectedGroups] = useState([])
  const [adhocEmails, setAdhocEmails] = useState([])
  const [emailData, setEmailData] = useState([])
  const [contactData, setContactData] = useState([])
  const [lastRefresh, setLastRefresh] = useState('N/A')
  const [tab, setTab] = useState(() => localStorage.getItem('activeTab') || 'email')

  useEffect(() => {
    const { emailData, contactData } = window.fortnocAPI.loadExcelData()
    setEmailData(emailData)
    setContactData(contactData)
    setLastRefresh(new Date().toLocaleString())
  }, [])

  useEffect(() => {
    if (window.fortnocAPI?.onExcelDataUpdate) {
      window.fortnocAPI.onExcelDataUpdate((data) => {
        toast.success('Excel files updated automatically!')
        setEmailData(data.emailData || [])
        setContactData(data.contactData || [])
        setLastRefresh(new Date().toLocaleString())
      })
    }
  }, [])

  const refreshData = () => {
    const { emailData, contactData } = window.fortnocAPI.loadExcelData()
    setEmailData(emailData)
    setContactData(contactData)
    setLastRefresh(new Date().toLocaleString())
    setAdhocEmails([])
    toast.success('Data refreshed')
  }

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const addAdhocEmail = (email) => {
    if (isValidEmail(email)) {
      setAdhocEmails(prev => [...new Set([...prev, email])])
      toast.success(`Added ${email}`)
    } else {
      toast.error('Invalid email address')
    }
  }

  useEffect(() => {
    localStorage.setItem('activeTab', tab)
  }, [tab])

  const toastOptions = {
  style: {
    background: '#2e261f',
    color: '#f4f1ee',
    border: '1px solid #59493f',
    fontSize: '0.9rem',
  },
  success: {
    icon: '',
    style: {
      background: '#334033',
      color: '#d0f0d0',
    },
  },
  error: {
    icon: '',
    style: {
      background: '#402e2e',
      color: '#f4d0d0',
    },
  },
};

return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#1e1b18', color: '#f4f1ee', minHeight: '100vh', padding: '2rem' }}><Toaster position="top-right" toastOptions={toastOptions} />
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Fort NOC</h1>
      <div style={{ fontFamily: 'DM Sans, sans-serif', display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        
<button
          onClick={refreshData}
          style={{ background: '#4e7267', color: '#f4f1ee', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}
        >
          Refresh Data
        </button>
        <span style={{ alignSelf: 'center', fontSize: '0.9rem' }}>Last Refreshed: {lastRefresh}</span>
      </div>

      <div style={{ fontFamily: 'DM Sans, sans-serif', display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{
      display: 'flex',
      gap: '2rem',
      borderBottom: '1px solid #59493f',
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem',
      fontSize: '1.05rem'
    }}>
      <div
        onClick={() => setTab('email')}
        style={{
          cursor: 'pointer',
          paddingBottom: '0.25rem',
          borderBottom: tab === 'email' ? '3px solid #82614f' : '3px solid transparent',
          color: tab === 'email' ? '#f4f1ee' : '#aaa',
          fontWeight: tab === 'email' ? 'bold' : 'normal'
        }}
      >
        Email Groups
      </div>
      <div
        onClick={() => setTab('contact')}
        style={{
          cursor: 'pointer',
          paddingBottom: '0.25rem',
          borderBottom: tab === 'contact' ? '3px solid #82614f' : '3px solid transparent',
          color: tab === 'contact' ? '#f4f1ee' : '#aaa',
          fontWeight: tab === 'contact' ? 'bold' : 'normal'
        }}
      >
        Contact Search
      </div>
    </div>
      </div>

      {tab === 'email' ? (
        <EmailGroups
          emailData={emailData}
          adhocEmails={adhocEmails}
          selectedGroups={selectedGroups}
          setSelectedGroups={setSelectedGroups}
          setAdhocEmails={setAdhocEmails}
        />
      ) : (
        <ContactSearch
          contactData={contactData}
          addAdhocEmail={addAdhocEmail}
        />
      )}
    </div>
  )
}

export default App
