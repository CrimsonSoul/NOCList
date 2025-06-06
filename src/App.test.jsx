import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import App from './App'

describe('App', () => {
  it('renders heading', () => {
    window.nocListAPI = {
      loadExcelData: () => ({ emailData: [], contactData: [] }),
      onExcelDataUpdate: () => {},
    }
    render(<App />)
    expect(screen.getByText(/NOC List/i)).toBeInTheDocument()
  })
})
