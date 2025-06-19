import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import App from './App'

describe('App', () => {
  it('renders heading', () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }))
    window.nocListAPI = {
      loadExcelData: () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate: () => {},
    }
    render(<App />)
    expect(
      screen.getByText(/_\s+______\s+______\s+__\s+_/)
    ).toBeInTheDocument()
  })

  it('shows image when logo file is available', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }))
    window.nocListAPI = {
      loadExcelData: () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate: () => {},
    }
    render(<App />)
    expect(await screen.findByAltText('NOC List Logo')).toBeInTheDocument()
  })
})
