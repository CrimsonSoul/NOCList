import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import App from './App'

let originalFetch
let originalNocListAPI

beforeEach(() => {
  originalFetch = global.fetch
  originalNocListAPI = window.nocListAPI
})

afterEach(() => {
  global.fetch = originalFetch
  window.nocListAPI = originalNocListAPI
  cleanup()
})

describe('App', () => {
  it('renders heading', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
    )
    window.nocListAPI = {
      loadExcelData: async () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate: () => () => {},
      onExcelWatchError: () => () => {},
    }
    render(<App />)
    expect(
      screen.getByText(/_\s+______\s+______\s+__\s+_/)
    ).toBeInTheDocument()
  })

  it('shows image when logo file is available', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
    )
    window.nocListAPI = {
      loadExcelData: async () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate: () => () => {},
      onExcelWatchError: () => () => {},
    }
    render(<App />)
    expect(await screen.findByAltText('NOC List Logo')).toBeInTheDocument()
  })

  it('preserves Dispatcher Radar iframe across tab switches', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
    )
    window.nocListAPI = {
      loadExcelData: async () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate: () => () => {},
      onExcelWatchError: () => () => {},
    }
    render(<App />)

    const radarButton = screen.getByRole('button', { name: 'Dispatcher Radar' })
    fireEvent.click(radarButton)
    const iframe = screen.getByTitle('Dispatcher Radar')

    const emailButton = screen.getByRole('button', { name: 'Email Groups' })
    fireEvent.click(emailButton)
    fireEvent.click(radarButton)

    expect(screen.getByTitle('Dispatcher Radar')).toBe(iframe)
  })
})

describe('Excel listener cleanup', () => {
  it('unregisters update listener on unmount', () => {
    const cleanup = vi.fn()
    const onExcelDataUpdate = vi.fn(() => cleanup)
    window.nocListAPI = {
      loadExcelData: async () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate,
      onExcelWatchError: () => () => {},
    }
    const { unmount } = render(<App />)
    unmount()
    expect(cleanup).toHaveBeenCalled()
  })
})
