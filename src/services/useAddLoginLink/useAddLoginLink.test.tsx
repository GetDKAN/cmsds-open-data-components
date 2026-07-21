import { renderHook } from '@testing-library/react';
import useAddLoginLink from './index.jsx';

// jest+jsdom defaults window.location.host to 'localhost' — we use that as
// the "matching host" instead of mocking, which is fragile under modern jsdom.
const MATCHING_HOST = 'localhost';
const loginLink = { id: 'login', label: 'Sign In', url: '/login', target: '_self' };

describe('useAddLoginLink', () => {
  it('prepends the login link when the current host matches', () => {
    const menuItems = { main: [{ id: 'home', label: 'Home', url: '/' }] };
    const { result } = renderHook(() =>
      useAddLoginLink([MATCHING_HOST], menuItems, 'main', loginLink),
    );
    expect(result.current.main[0]).toEqual(loginLink);
  });

  it('returns links unchanged when the host does not match', () => {
    const menuItems = { main: [{ id: 'home', label: 'Home', url: '/' }] };
    const original = [...menuItems.main];
    const { result } = renderHook(() =>
      useAddLoginLink(['no.match.example'], menuItems, 'main', loginLink),
    );
    expect(result.current.main).toEqual(original);
  });

  it('does not double-insert the login link across rerenders with a matching host', () => {
    const menuItems = { main: [{ id: 'home', label: 'Home', url: '/' }] };
    const { result, rerender } = renderHook(() =>
      useAddLoginLink([MATCHING_HOST], menuItems, 'main', loginLink),
    );
    rerender();
    rerender();
    const loginCount = result.current.main.filter((l: any) => l.id === 'login').length;
    expect(loginCount).toBe(1);
  });
});
