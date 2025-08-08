import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Generate a rotating five digit code that updates on an interval.
 * @param {number} intervalMs - Duration in milliseconds before the code rotates.
 * @returns {{currentCode: string, previousCode: string, progressKey: number}}
 */
const useRotatingCode = (intervalMs = 5 * 60 * 1000) => {
  const [currentCode, setCurrentCode] = useState('')
  const [previousCode, setPreviousCode] = useState('')
  const [progressKey, setProgressKey] = useState(Date.now())
  const codeRef = useRef('')

  const generateCode = useCallback(
    () => Math.floor(10000 + Math.random() * 90000).toString(),
    []
  )

  useEffect(() => {
    const newCode = generateCode()
    codeRef.current = newCode
    setCurrentCode(newCode)
    setProgressKey(Date.now())
  }, [generateCode])

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousCode(codeRef.current)
      const newCode = generateCode()
      codeRef.current = newCode
      setCurrentCode(newCode)
      setProgressKey(Date.now())
    }, intervalMs)
    return () => clearInterval(interval)
  }, [generateCode, intervalMs])

  return { currentCode, previousCode, progressKey }
}

export default useRotatingCode
