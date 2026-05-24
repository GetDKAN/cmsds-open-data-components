import React from 'react';
import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import withQueryProvider from './QueryProvider';

// Smoke test: confirm the HOC supplies a QueryClient to wrapped children.
const Probe = () => {
  const client = useQueryClient();
  return <div data-testid="probe">{client ? 'has-client' : 'no-client'}</div>;
};

describe('withQueryProvider', () => {
  it('provides a QueryClient to the wrapped component', () => {
    const Wrapped = withQueryProvider(Probe);
    render(<Wrapped />);
    expect(screen.getByTestId('probe')).toHaveTextContent('has-client');
  });
});
