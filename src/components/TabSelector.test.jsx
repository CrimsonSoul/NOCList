import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import TabSelector from './TabSelector'

describe('TabSelector accessibility', () => {
  it('allows keyboard selection of tabs', () => {
    const setTab = vi.fn()
    render(<TabSelector tab="email" setTab={setTab} />)
    const contactBtn = screen.getByRole('button', { name: /contact search/i })
    contactBtn.focus()
    fireEvent.keyDown(contactBtn, { key: 'Enter', code: 'Enter' })
    expect(setTab).toHaveBeenCalledWith('contact')
  })
})
