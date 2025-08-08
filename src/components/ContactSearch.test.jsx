import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import ContactSearch from './ContactSearch';

const contacts = [
  { Name: 'Alice', Title: 'Agent', Email: 'alice@example.com', Phone: 12345 },
];

describe('ContactSearch', () => {
  it('filters contacts without crashing on non-string values', () => {
    render(<ContactSearch contactData={contacts} addAdhocEmail={() => {}} />);
    const input = screen.getByPlaceholderText(/search contacts/i);
    fireEvent.change(input, { target: { value: 'alice' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
