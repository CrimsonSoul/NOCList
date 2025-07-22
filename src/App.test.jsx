import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from './App';

// Mock the API
const mockNocListAPI = {
  loadExcelData: () => ({
    emailData: [],
    contactData: [],
  }),
  openFile: () => {},
  onExcelDataUpdate: () => {},
  openExternal: () => {},
  checkFileExists: vi.fn(() => Promise.resolve(false)),
};

Object.defineProperty(window, 'nocListAPI', {
  value: mockNocListAPI,
  writable: true,
});

describe('App', () => {
  it('renders tabs', () => {
    render(<App />);
    const emailGroupsTab = screen.getByText('Email Groups', { selector: '.tab' });
    expect(emailGroupsTab).toBeInTheDocument();
  });

  it('shows image when logo file is available', async () => {
    mockNocListAPI.checkFileExists.mockResolvedValue(true);
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findByAltText('NOC List Logo')).toBeInTheDocument();
  });
});
