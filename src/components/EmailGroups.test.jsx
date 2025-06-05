import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import EmailGroups from './EmailGroups'

const sampleData = [
  ['Group A', 'Group B'],
  ['a1@example.com', 'b1@example.com'],
  ['a2@example.com', '']
]

describe('EmailGroups', () => {
  it('shows count next to group name', () => {
    render(
      <EmailGroups
        emailData={sampleData}
        adhocEmails={[]}
        selectedGroups={[]}
        setSelectedGroups={() => {}}
        setAdhocEmails={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: /Group A \(2\)/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Group B \(1\)/ })).toBeInTheDocument()
  })
})
