import { useEffect, useRef, useState, useCallback } from 'react'
import crypto from 'crypto'

/**
 * Generate a rotating five digit code that updates on an interval.
 * Uses Node's crypto.randomInt for stronger randomness.
 * @param {number} intervalMs - Duration in milliseconds before the code rotates.
 * @returns {{currentCode: string, previousCode: string, progressKey: number}}
 */
const useRotatingCode = (intervalMs = 5 * 60 * 1000) => {
  const [currentCode, setCurrentCode] = useState('')
  const [previousCode, setPreviousCode] = useState('')
  const [progressKey, setProgressKey] = useState(Date.now())
  const codeRef = useRef('')

  const generateCode = useCallback(
    () => crypto.randomInt(10000, 100000).toString(),
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

  return { currentCode, previousCode, progressKey, intervalMs }
}

export default useRotatingCode
