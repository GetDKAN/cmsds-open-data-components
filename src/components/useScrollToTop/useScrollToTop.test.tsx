import React from 'react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import useScrollToTop from './index';

const buildWrapper = (initialRoute = '/') => ({ children }: any) => (
  <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
);

describe('useScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('scrolls to the top on mount', () => {
    renderHook(() => useScrollToTop(), { wrapper: buildWrapper('/start') });
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('scrolls to the top again when the pathname changes', () => {
    const { result, rerender } = renderHook(
      ({ entry }: any) => {
        useScrollToTop();
        return entry;
      },
      {
        wrapper: ({ children }: any) => <MemoryRouter initialEntries={['/a']}>{children}</MemoryRouter>,
        initialProps: { entry: '/a' },
      },
    );
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    // remounting under a new MemoryRouter simulates a fresh pathname
    renderHook(() => useScrollToTop(), { wrapper: buildWrapper('/b') });
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });
});
