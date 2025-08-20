import React, { useEffect, useState, useCallback, useMemo } from 'react'
import EmailGroups from './components/EmailGroups'
import ContactSearch from './components/ContactSearch'
import CodeDisplay from './components/CodeDisplay'
import TabSelector from './components/TabSelector'
import WeatherClock from './components/WeatherClock'
import DispatcherRadar from './components/DispatcherRadar'
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
  const [radarMounted, setRadarMounted] = useState(tab === 'radar')
  const { currentCode, previousCode, progressKey, intervalMs } = useRotatingCode()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  /** Load group and contact data from the preloaded Excel files. */
  const loadData = useCallback(async () => {
    const { emailData, contactData } = await window.nocListAPI.loadExcelData()
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
    let cleanup
    if (window.nocListAPI?.onExcelDataUpdate) {
      cleanup = window.nocListAPI.onExcelDataUpdate((data) => {
        toast.success('Excel files updated automatically!')
        setEmailData(data.emailData || [])
        setContactData(data.contactData || [])
        setLastRefresh(new Date().toLocaleString())
      })
    }
    return () => cleanup && cleanup()
  }, [])

  useEffect(() => {
    let cleanup
    if (window.nocListAPI?.onExcelWatchError) {
      cleanup = window.nocListAPI.onExcelWatchError((msg) => {
        toast.error(`Watcher error: ${msg}`)
      })
    }
    return () => cleanup && cleanup()
  }, [])

  /** Manually refresh Excel data and clear any ad-hoc emails. */
  const refreshData = useCallback(async () => {
    await loadData()
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

  useEffect(() => {
    if (tab === 'radar') setRadarMounted(true)
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
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Toaster position="top-right" toastOptions={toastOptions} />

      {/* Header section stays fixed at the top */}
      <header
        style={{
          flex: '0 0 auto',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg-primary)',
        }}
      >
          <div className="stack-on-small align-center gap-1 mb-1">
            {logoAvailable ? (
              <img
                src="logo.png"
                alt="NOC List Logo"
                style={{ width: '200px' }}
            />
          ) : (
            <pre
              style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                lineHeight: '1.2',
                margin: 0,
              }}
            >{`    _   ______  ______   __    _      __
   / | / / __ \\/ ____/  / /   (_)____/ /_
  /  |/ / / / / /      / /   / / ___/ __/
 / /|  / /_/ / /___   / /___/ (__  ) /_
/_/ |_|\\____/\\____/  /_____/_/____/\\__/`}</pre>
          )}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}
          >
            <CodeDisplay
              currentCode={currentCode}
              previousCode={previousCode}
              progressKey={progressKey}
              intervalMs={intervalMs}
            />
            <WeatherClock />
          </div>
        </div>
        <TabSelector tab={tab} setTab={setTab} />

        {tab !== 'radar' && (
          <div className="stack-on-small gap-1 mb-1">
            <button onClick={refreshData} className="btn">
              Refresh Data
            </button>
            <span className="small-text self-center">
              Last Refreshed: {lastRefresh}
            </span>
          </div>
        )}
      </header>

      {/* Scrollable content area */}
      <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
        {tab === 'email' && (
          <EmailGroups
            emailData={emailData}
            adhocEmails={adhocEmails}
            selectedGroups={selectedGroups}
            setSelectedGroups={setSelectedGroups}
            setAdhocEmails={setAdhocEmails}
          />
        )}
        {tab === 'contact' && (
          <ContactSearch contactData={contactData} addAdhocEmail={addAdhocEmail} />
        )}
        {radarMounted && (
          <div style={{ display: tab === 'radar' ? 'block' : 'none', height: '100%' }}>
            <DispatcherRadar />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
