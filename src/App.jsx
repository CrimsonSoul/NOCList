import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import EmailGroups from './components/EmailGroups';
import ContactSearch from './components/ContactSearch';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [adhocEmails, setAdhocEmails] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [lastRefresh, setLastRefresh] = useState('N/A');
  const [tab, setTab] = useState(
    () => localStorage.getItem('activeTab') || 'email'
  );
  const [logoAvailable, setLogoAvailable] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [previousCode, setPreviousCode] = useState('');
  const [progressKey, setProgressKey] = useState(Date.now());

  const generateCode = useCallback(
    () => Math.floor(10000 + Math.random() * 90000).toString(),
    []
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const codeRef = useRef('');

  useEffect(() => {
    const { emailData, contactData } = window.nocListAPI.loadExcelData();
    setEmailData(emailData);
    setContactData(contactData);
    setLastRefresh(new Date().toLocaleString());
    const newCode = generateCode();
    codeRef.current = newCode;
    setCurrentCode(newCode);
    setProgressKey(Date.now());
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setPreviousCode(codeRef.current);
        const newCode = generateCode();
        codeRef.current = newCode;
        setCurrentCode(newCode);
        setProgressKey(Date.now());
      },
      5 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('logo.png', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setLogoAvailable(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (window.nocListAPI?.onExcelDataUpdate) {
      window.nocListAPI.onExcelDataUpdate((data) => {
        toast.success('Excel files updated automatically!');
        setEmailData(data.emailData || []);
        setContactData(data.contactData || []);
        setLastRefresh(new Date().toLocaleString());
      });
    }
  }, []);

  const refreshData = useCallback(() => {
    const { emailData, contactData } = window.nocListAPI.loadExcelData();
    setEmailData(emailData);
    setContactData(contactData);
    setLastRefresh(new Date().toLocaleString());
    setAdhocEmails([]);
    toast.success('Data refreshed');
  }, []);

  const isValidEmail = useCallback((email) => emailRegex.test(email), []);

  const addAdhocEmail = useCallback(
    (email) => {
      if (isValidEmail(email)) {
        setAdhocEmails((prev) => [...new Set([...prev, email])]);
        toast.success(`Added ${email}`);
      } else {
        toast.error('Invalid email address');
      }
    },
    [isValidEmail]
  );

  useEffect(() => {
    localStorage.setItem('activeTab', tab);
  }, [tab]);

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
    []
  );

  return (
    <div
      className="fade-in"
      style={{
        fontFamily: 'DM Sans, sans-serif',
        background: 'var(--bg-primary)',
        color: 'var(--text-light)',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <Toaster position="top-right" toastOptions={toastOptions} />
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
        }}
      >
        <div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
          Code: {currentCode}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Prev: {previousCode || 'N/A'}
        </div>
        <div className="progress-container">
          <div key={progressKey} className="progress-bar" />
        </div>
      </div>
      {logoAvailable ? (
        <img
          src="logo.png"
          alt="NOC List Logo"
          style={{ width: '200px', marginBottom: '1rem' }}
        />
      ) : (
        <pre
          style={{
            fontFamily: 'monospace',
            fontSize: '1rem',
            marginBottom: '1rem',
            lineHeight: '1.2',
          }}
        >
          {`    _   ______  ______   __    _      __
   / | / / __ \/ ____/  / /   (_)____/ /_
  /  |/ / / / / /      / /   / / ___/ __/
 / /|  / /_/ / /___   / /___/ (__  ) /_
/_/ |_|\____/\____/  /_____/_/____/\__/`}
        </pre>
      )}
      <div
        style={{
          fontFamily: 'DM Sans, sans-serif',
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <div
          className="stack-on-small"
          style={{
            gap: '2rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '1.05rem',
          }}
        >
          <div
            onClick={() => setTab('email')}
            style={{
              cursor: 'pointer',
              paddingBottom: '0.25rem',
              borderBottom:
                tab === 'email'
                  ? '3px solid var(--accent)'
                  : '3px solid transparent',
              color:
                tab === 'email' ? 'var(--text-light)' : 'var(--text-muted)',
              fontWeight: tab === 'email' ? 'bold' : 'normal',
            }}
          >
            Email Groups
          </div>
          <div
            onClick={() => setTab('contact')}
            style={{
              cursor: 'pointer',
              paddingBottom: '0.25rem',
              borderBottom:
                tab === 'contact'
                  ? '3px solid var(--accent)'
                  : '3px solid transparent',
              color:
                tab === 'contact' ? 'var(--text-light)' : 'var(--text-muted)',
              fontWeight: tab === 'contact' ? 'bold' : 'normal',
            }}
          >
            Contact Search
          </div>
        </div>
      </div>

      <div
        className="stack-on-small"
        style={{
          fontFamily: 'DM Sans, sans-serif',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <button onClick={refreshData} className="btn">
          Refresh Data
        </button>
        <span style={{ alignSelf: 'center', fontSize: '0.9rem' }}>
          Last Refreshed: {lastRefresh}
        </span>
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
  );
}

export default App;
