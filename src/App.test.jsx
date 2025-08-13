import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import App from './App'

describe('App', () => {
  it('renders heading', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
    )
    window.nocListAPI = {
      loadExcelData: () => ({ emailData: [], contactData: [] }),
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
      loadExcelData: () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate: () => () => {},
      onExcelWatchError: () => () => {},
    }
    render(<App />)
    expect(await screen.findByAltText('NOC List Logo')).toBeInTheDocument()
  })
})

describe('Excel listener cleanup', () => {
  it('unregisters update listener on unmount', () => {
    const cleanup = vi.fn()
    const onExcelDataUpdate = vi.fn(() => cleanup)
    window.nocListAPI = {
      loadExcelData: () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate,
      onExcelWatchError: () => () => {},
    }
    const { unmount } = render(<App />)
    unmount()
    expect(cleanup).toHaveBeenCalled()
  })
})
