import React, { useEffect, useState, useMemo } from 'react'

const weatherCodeMap = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy rain showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
}

/**
 * Displays current time and weather for Bowling Green, KY.
 */
const WeatherClock = () => {
  const [now, setNow] = useState(new Date())
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=36.99&longitude=-86.44&current_weather=true&temperature_unit=fahrenheit&timezone=auto',
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.current_weather) {
          setWeather({
            temp: data.current_weather.temperature,
            code: data.current_weather.weathercode,
          })
        }
      })
      .catch(() => {})
  }, [])

  const description = useMemo(() => weatherCodeMap[weather?.code] || '', [weather])

  return (
    <div style={{ textAlign: 'center', lineHeight: '1.2' }}>
      <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{now.toLocaleTimeString()}</div>
      {weather && (
        <div style={{ fontSize: '0.9rem' }}>
          Bowling Green: {Math.round(weather.temp)}°F {description}
        </div>
      )}
    </div>
  )
}

export default WeatherClock

