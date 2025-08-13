import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import WeatherClock from './WeatherClock'

describe('WeatherClock', () => {
  it('shows fallback message on fetch failure', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('fail')))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<WeatherClock />)
    expect(await screen.findByText(/weather unavailable/i)).toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
