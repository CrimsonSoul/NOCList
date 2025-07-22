import React, { useState, useEffect, useCallback, useRef } from 'react';

const generateCode = () => Math.floor(10000 + Math.random() * 90000).toString();

const Header = () => {
  const [logoAvailable, setLogoAvailable] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [previousCode, setPreviousCode] = useState('');
  const [progressKey, setProgressKey] = useState(Date.now());
  const codeRef = useRef('');

  useEffect(() => {
    window.nocListAPI.checkFileExists('logo.png').then(setLogoAvailable);

    const newCode = generateCode();
    codeRef.current = newCode;
    setCurrentCode(newCode);
    setProgressKey(Date.now());

    const interval = setInterval(() => {
      setPreviousCode(codeRef.current);
      const newCode = generateCode();
      codeRef.current = newCode;
      setCurrentCode(newCode);
      setProgressKey(Date.now());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="code-display">
        <div className="code-display-current">Code: {currentCode}</div>
        <div className="code-display-previous">Prev: {previousCode || 'N/A'}</div>
        <div className="progress-container">
          <div key={progressKey} className="progress-bar" />
        </div>
      </div>
      {logoAvailable ? (
        <img src="logo.png" alt="NOC List Logo" className="logo" />
      ) : (
        <pre className="logo-text">
          {`    _   ______  ______   __    _      __
   / | / / __ \\/ ____/  / /   (_)____/ /_
  /  |/ / / / / /      / /   / / ___/ __/
 / /|  / /_/ / /___   / /___/ (__  ) /_
/_/ |_|\\____/\\____/  /_____/_/____/\\__/`}
        </pre>
      )}
    </>
  );
};

export default Header;
