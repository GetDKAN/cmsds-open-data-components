import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransformedDate from './index';

describe('TransformedDate', () => {
  it('formats a valid ISO date string in UTC', () => {
    const { container } = render(<TransformedDate date="2025-01-15T00:00:00Z" />);
    // default options: long month, UTC tz — assert on locale-stable substring
    expect(container.textContent).toMatch(/January.*15.*2025/);
  });

  it('respects custom options', () => {
    const { container } = render(
      <TransformedDate
        date="2025-01-15T00:00:00Z"
        options={{ year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }}
      />,
    );
    expect(container.textContent).toMatch(/01\/15\/2025/);
  });

  it('renders "Invalid Date" for unparseable input', () => {
    const { container } = render(<TransformedDate date="not-a-date" />);
    expect(container.textContent).toBe('Invalid Date');
  });
});
