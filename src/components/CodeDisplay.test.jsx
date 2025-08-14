import { render, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import CodeDisplay from './CodeDisplay'

describe('CodeDisplay progress', () => {
  it('applies interval to animation duration', () => {
    const { container } = render(
      <CodeDisplay
        currentCode="12345"
        previousCode="54321"
        progressKey={1}
        intervalMs={1000}
      />
    )
    const bar = container.querySelector('.progress-bar')
    expect(bar.style.getPropertyValue('--duration')).toBe('1000ms')
  })

  it('sets ARIA progress attributes and updates value', () => {
    vi.useFakeTimers()
    const { container } = render(
      <CodeDisplay
        currentCode="12345"
        previousCode="54321"
        progressKey={1}
        intervalMs={1000}
      />
    )
    const progress = container.querySelector('.progress-container')
    expect(progress).toHaveAttribute('role', 'progressbar')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
    expect(progress).toHaveAttribute('aria-valuenow', '0')
    act(() => {
      vi.advanceTimersByTime(500)
    })
    const value = Number(progress.getAttribute('aria-valuenow'))
    expect(value).toBeGreaterThan(0)
    vi.useRealTimers()
  })
})
