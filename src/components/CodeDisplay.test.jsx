import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
})
