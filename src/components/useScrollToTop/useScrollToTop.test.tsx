import React from 'react';
import { renderHook } from '@testing-library/react';
// NOTE: this test deliberately uses `renderHook` + MemoryRouter directly rather than
// `renderWithProviders` (which is render-based, not hook-based). Don't try to
// "consolidate" — the hook wrapper pattern doesn't fit through that helper.
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import useScrollToTop from './index';

const buildWrapper = (initialRoute = '/') => ({ children }: any) => (
  <MemoryRouter initialEntries={[initialRoute]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>
);

describe('useScrollToTop', () => {
  let scrollToSpy: jest.SpyInstance;
  beforeEach(() => {
    scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });
  afterEach(() => {
    scrollToSpy.mockRestore();
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
        wrapper: ({ children }: any) => <MemoryRouter initialEntries={['/a']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>,
        initialProps: { entry: '/a' },
      },
    );
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    // remounting under a new MemoryRouter simulates a fresh pathname
    renderHook(() => useScrollToTop(), { wrapper: buildWrapper('/b') });
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });
});
