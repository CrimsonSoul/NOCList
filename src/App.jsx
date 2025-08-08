import React, { useEffect, useState, useCallback, useMemo } from 'react'
import EmailGroups from './components/EmailGroups'
import ContactSearch from './components/ContactSearch'
import CodeDisplay from './components/CodeDisplay'
import TabSelector from './components/TabSelector'
import { Toaster, toast } from 'react-hot-toast'
import useRotatingCode from './hooks/useRotatingCode'

function App() {
  const [selectedGroups, setSelectedGroups] = useState([])
  const [adhocEmails, setAdhocEmails] = useState([])
  const [emailData, setEmailData] = useState([])
  const [contactData, setContactData] = useState([])
  const [lastRefresh, setLastRefresh] = useState('N/A')
  const [tab, setTab] = useState(() => localStorage.getItem('activeTab') || 'email')
  const [logoAvailable, setLogoAvailable] = useState(false)
  const { currentCode, previousCode, progressKey } = useRotatingCode()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  /** Load group and contact data from the preloaded Excel files. */
  const loadData = useCallback(() => {
    const { emailData, contactData } = window.nocListAPI.loadExcelData()
    setEmailData(emailData)
    setContactData(contactData)
    setLastRefresh(new Date().toLocaleString())
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    fetch('logo.png', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setLogoAvailable(true)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (window.nocListAPI?.onExcelDataUpdate) {
      window.nocListAPI.onExcelDataUpdate((data) => {
        toast.success('Excel files updated automatically!')
        setEmailData(data.emailData || [])
        setContactData(data.contactData || [])
        setLastRefresh(new Date().toLocaleString())
      })
    }
  }, [])

  /** Manually refresh Excel data and clear any ad-hoc emails. */
  const refreshData = useCallback(() => {
    loadData()
    setAdhocEmails([])
    toast.success('Data refreshed')
  }, [loadData])

  const isValidEmail = useCallback((email) => emailRegex.test(email), [])

  /** Add a user-provided email to the current ad-hoc list if valid. */
  const addAdhocEmail = useCallback(
    (email) => {
      if (isValidEmail(email)) {
        setAdhocEmails((prev) => [...new Set([...prev, email])])
        toast.success(`Added ${email}`)
      } else {
        toast.error('Invalid email address')
      }
    },
    [isValidEmail],
  )

  useEffect(() => {
    localStorage.setItem('activeTab', tab)
  }, [tab])

  const toastOptions = useMemo(
    () => ({
      style: {
        background: 'var(--bg-secondary)',
        color: 'var(--text-light)',
        border: '1px solid var(--border-color)',
        fontSize: '0.9rem',
        borderRadius: '6px',
        fontFamily: 'DM Sans, sans-serif',
      },
      success: {
        icon: '✓',
        style: {
          background: 'var(--toast-success-bg)',
          color: 'var(--text-light)',
        },
      },
      error: {
        icon: '✕',
        style: {
          background: 'var(--toast-error-bg)',
          color: 'var(--text-light)',
        },
      },
    }),
    [],
  )

  return (
    <div
      className="fade-in"
      style={{
        fontFamily: 'DM Sans, sans-serif',
        background: 'var(--bg-primary)',
        color: 'var(--text-light)',
        padding: '2rem',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Toaster position="top-right" toastOptions={toastOptions} />

      {/* Header section remains fixed */}
      <div style={{ flex: '0 0 auto' }}>
        <CodeDisplay currentCode={currentCode} previousCode={previousCode} progressKey={progressKey} />
        {logoAvailable ? (
          <img src="logo.png" alt="NOC List Logo" style={{ width: '200px', marginBottom: '1rem' }} />
        ) : (
          <pre
            style={{
              fontFamily: 'monospace',
              fontSize: '1rem',
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}
          >{`    _   ______  ______   __    _      __
   / | / / __ \\/ ____/  / /   (_)____/ /_
  /  |/ / / / / /      / /   / / ___/ __/
 / /|  / /_/ / /___   / /___/ (__  ) /_
/_/ |_|\\____/\\____/  /_____/_/____/\\__/`}</pre>
        )}
        <TabSelector tab={tab} setTab={setTab} />

        <div
          className="stack-on-small"
          style={{ fontFamily: 'DM Sans, sans-serif', gap: '1rem', marginBottom: '1rem' }}
        >
          <button onClick={refreshData} className="btn">
            Refresh Data
          </button>
          <span style={{ alignSelf: 'center', fontSize: '0.9rem' }}>
            Last Refreshed: {lastRefresh}
          </span>
        </div>
      </div>

      {/* Scrollable content area */}
      <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
        {tab === 'email' ? (
          <EmailGroups
            emailData={emailData}
            adhocEmails={adhocEmails}
            selectedGroups={selectedGroups}
            setSelectedGroups={setSelectedGroups}
            setAdhocEmails={setAdhocEmails}
          />
        ) : (
          <ContactSearch contactData={contactData} addAdhocEmail={addAdhocEmail} />
        )}
      </div>
    </div>
  )
}

export default App
