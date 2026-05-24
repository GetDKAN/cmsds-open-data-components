import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './index';

const Boom = () => {
  throw new Error('test failure');
};

describe('ErrorBoundary', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children when no error is thrown (component mode)', () => {
    render(
      <ErrorBoundary component>
        <p>healthy child</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('healthy child')).toBeInTheDocument();
  });

  it('catches errors and shows fallback in component mode', () => {
    render(
      <ErrorBoundary component>
        <Boom />
      </ErrorBoundary>,
    );
    expect(
      screen.getByText("We're sorry, the site has encountered an unexpected error."),
    ).toBeInTheDocument();
  });

  it('renders the layout-style error banner in default (non-component) mode', () => {
    render(
      <ErrorBoundary>
        <p>this is ignored</p>
      </ErrorBoundary>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Error' })).toBeInTheDocument();
    expect(screen.queryByText('this is ignored')).not.toBeInTheDocument();
  });
});
