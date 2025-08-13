import React, { useEffect, useState } from 'react'

function Header({ currentCode, previousCode, progressKey, logoAvailable }) {
  const [time, setTime] = useState(new Date())
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof fetch === 'undefined') return
    fetch('https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true')
      .then((res) => res.json())
      .then((data) => {
        if (data?.current_weather) setWeather(data.current_weather)
      })
      .catch(() => {})
  }, [])

  return (
    <header className="header">
      {logoAvailable ? (
        <img src="logo.png" alt="NOC List Logo" className="header-logo" />
      ) : (
        <pre className="header-logo-ascii">{`    _   ______  ______   __    _      __\n / | / / __ \\/ ____/  / /   (_)____/ /_\n/  |/ / / / / /      / /   / / ___/ __/\n/ /|  / /_/ / /___   / /___/ (__  ) /_\n/_/ |_|\\____/\\____/  /_____/_/____/\\__/`}</pre>
      )}
      <div className="header-info">
        <div className="code-box">
          <div className="code">Code: {currentCode}</div>
          <div className="prev-code">Prev: {previousCode || 'N/A'}</div>
          <div className="progress-container">
            <div key={progressKey} className="progress-bar" />
          </div>
        </div>
        <div className="clock-weather">
          <div>{time.toLocaleTimeString()}</div>
          {weather && <div className="weather">{Math.round(weather.temperature)}°C</div>}
        </div>
      </div>
    </header>
  )
}

export default Header
