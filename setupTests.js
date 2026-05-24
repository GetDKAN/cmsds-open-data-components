import "@testing-library/jest-dom";
import 'jest-canvas-mock';
import 'jest-axe/extend-expect';

// jsdom does not implement window.scrollTo. Stub it globally so component
// effects that scroll (e.g. useScrollToTop) don't spam the suite with
// "Not implemented: window.scrollTo" errors. Individual tests can still
// jest.spyOn(window, 'scrollTo') to assert on calls.
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
