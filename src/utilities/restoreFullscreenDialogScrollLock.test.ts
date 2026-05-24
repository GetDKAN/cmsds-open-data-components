import { restoreFullscreenDialogScrollLock } from './restoreFullscreenDialogScrollLock';

describe('restoreFullscreenDialogScrollLock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.className = '';
    document.body.removeAttribute('style');
    document.body.innerHTML = '';
  });

  it('does nothing when the fullscreen dialog wrapper is not present', () => {
    restoreFullscreenDialogScrollLock();
    jest.runAllTimers();
    expect(document.body.classList.contains('ds--dialog-open')).toBe(false);
    expect(document.body.style.getPropertyValue('--body_top--dialog-open')).toBe('');
  });

  it('restores scroll-lock class and CSS var when an open fullscreen dialog exists', () => {
    document.body.innerHTML =
      '<div class="dkan-fullscreen-data-table-wrapper">' +
      '<div class="ds-c-dialog-wrap open"></div>' +
      '</div>';
    restoreFullscreenDialogScrollLock();
    jest.runAllTimers();
    expect(document.body.classList.contains('ds--dialog-open')).toBe(true);
    expect(document.body.style.getPropertyValue('--body_top--dialog-open')).toBe('-0px');
  });

  it('defers work until the next tick (no synchronous body mutation)', () => {
    document.body.innerHTML =
      '<div class="dkan-fullscreen-data-table-wrapper">' +
      '<div class="ds-c-dialog-wrap open"></div>' +
      '</div>';
    restoreFullscreenDialogScrollLock();
    // Before timers run, the class must not yet be applied.
    expect(document.body.classList.contains('ds--dialog-open')).toBe(false);
    jest.runAllTimers();
    expect(document.body.classList.contains('ds--dialog-open')).toBe(true);
  });
});
