import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import EmailGroups from './components/EmailGroups';
import ContactSearch from './components/ContactSearch';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Refresh from './components/Refresh';

function App() {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [adhocEmails, setAdhocEmails] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [lastRefresh, setLastRefresh] = useState('N/A');
  const [tab, setTab] = useState(() => localStorage.getItem('activeTab') || 'email');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const { emailData, contactData } = window.nocListAPI.loadExcelData();
    setEmailData(emailData);
    setContactData(contactData);
    setLastRefresh(new Date().toLocaleString());
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
    <div className="fade-in app-container">
      <Toaster position="top-right" toastOptions={toastOptions} />
      <Header />
      <Tabs tab={tab} setTab={setTab} />
      <Refresh lastRefresh={lastRefresh} refreshData={refreshData} />

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
  );
}

export default App;
