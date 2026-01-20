/**
 * Workaround for CMS Design System nested dialog issue.
 * When a nested dialog closes, the design system removes scroll lock
 * even if a parent dialog is still open. This restores it.
 */
export function restoreFullscreenDialogScrollLock(): void {
  setTimeout(() => {
    if (document.querySelector('.dkan-fullscreen-data-table-wrapper .ds-c-dialog-wrap.open')) {
      document.body.classList.add('ds--dialog-open');
      document.body.style.setProperty('--body_top--dialog-open', '-0px');
    }
  }, 0);
}
