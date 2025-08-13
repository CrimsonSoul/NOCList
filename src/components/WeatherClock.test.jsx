import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import WeatherClock from './WeatherClock'

describe('WeatherClock', () => {
  it('shows fallback message on fetch failure', async () => {
    vi.useFakeTimers()
    const originalFetch = global.fetch
    global.fetch = vi.fn(() => Promise.reject(new Error('fail')))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<WeatherClock />)
    await vi.advanceTimersByTimeAsync(0)
    await vi.advanceTimersByTimeAsync(5000)
    await vi.advanceTimersByTimeAsync(0)
    await Promise.resolve()
    expect(screen.getByText(/weather unavailable/i)).toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
    vi.useRealTimers()
    global.fetch = originalFetch
  })
})
