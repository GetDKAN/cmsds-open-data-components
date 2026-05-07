# Accessibility

Recent commits show active 508-compliance work. The library leans on `@cmsgov/design-system` for ARIA primitives (Buttons, Tabs, Alerts, Dialogs, Pagination, Dropdowns, TextField). Bespoke a11y work: data-table announcements, column-resize keyboard, mobile menu focus trap, ManageColumns drag-drop sensors.

## Datatable announcements

[Datatable.jsx](../src/components/Datatable/Datatable.jsx):
- L293: `<Spinner aria-valuetext="Dataset loading" role="status">` — loading status.
- L298: `<div aria-live="polite" aria-atomic="true" data-testid="loading-announcement" className="ds-u-visibility--screen-reader">` — loading completion.
- L301: `<div aria-live="assertive" aria-atomic="true" data-testid="no-results-announcement" className="ds-u-visibility--screen-reader">` — zero rows.

`ds-u-visibility--screen-reader` = design-system visually-hidden helper.

`updateAriaLive` callback prop accepted by `Dataset` and `FilteredResource` for consumer-defined messaging — but `Datatable` doesn't currently call it. Plumbing exists; wire isn't connected.

## Column resize keyboard

[HeaderResizeElement.tsx:54-105](../src/components/Datatable/HeaderResizeElement.tsx):

| Key | Effect |
|---|---|
| Enter / Space | Toggle resizing mode |
| Arrow Right | +10px (while resizing) |
| Arrow Left | –10px (while resizing) |
| Escape | Cancel |
| Blur | Cancel |

`aria-label="Resize {col} column"` (L62). `<th>` has `aria-sort` (L23-29) tracking sort state. Sort button `aria-label="{col} sort order"` (L50).

[FixedSizeTHead.jsx](../src/components/Datatable/FixedSizeTHead.jsx) has same `aria-sort` semantics for the non-resizable variant.

## Header focus trap (mobile menu)

[MobileHeader.tsx](../src/components/MobileHeader/MobileHeader.tsx) and [Header/index.tsx](../src/templates/Header/index.tsx) both implement a focus trap by hand:
- Tab at last focusable wraps to first; Shift+Tab at first wraps to last.
- Escape closes menu, restores focus to toggle button.
- Click outside closes menu.

Bespoke (no third-party trap library). Preserve when refactoring the Header.

`MobileMenuButton` uses design-system `<Button>` for the toggle. No explicit `aria-expanded`/`aria-controls` in source — verify in rendered DOM if SR audit flags it.

## ManageColumns drag-drop

[ManageColumns.jsx:11-49](../src/components/ManageColumns/ManageColumns.jsx) uses `@dnd-kit/core` with two custom sensors:
- `ExcludeCheckboxPointerSensor` — prevents pointer drag activation on checkboxes.
- `ExcludeCheckboxKeyboardSensor` — prevents keyboard drag firing when focus is on a checkbox (Space toggles checkbox, not drag).

dnd-kit keyboard protocol when not on a checkbox: Space/Enter to lift, arrows to move, Space/Enter to drop, Escape to cancel. dnd-kit ships its own SR live-region announcer.

Instructional paragraph (L217) explains Space/arrow/Escape interactions. Don't remove without a replacement — keyboard users rely on the affordance.

## Modals and dialogs

All dialogs are design-system `<Dialog>`:
- [ManageColumns.jsx](../src/components/ManageColumns/ManageColumns.jsx)
- [FullScreenDataTable/index.tsx](../src/components/FullScreenDataTable/index.tsx)
- [FilterDataset/index.tsx](../src/components/FilterDataset/index.tsx)
- [SearchModal/index.jsx](../src/components/SearchModal/index.jsx)

Inherit focus trap, Escape-to-close, `aria-modal`. Pass `ariaCloseLabel`. No custom modal implementations — use `<Dialog>`.

## Tabs

[Dataset/index.tsx:207+](../src/templates/Dataset/index.tsx) uses design-system `<Tabs>` + `<TabPanel>`. Provides `role="tablist"`/`tab`/`tabpanel`, `aria-selected`. Don't roll a custom tab strip.

## Form labels

Search/filter/dropdown controls use design-system `TextField`/`Choice`/`Dropdown` (require `label` prop). Raw `<input>`/`<select>` outside design-system wrappers are rare — mostly in tests.

## Errors and empty states

- Datatable empty: `<Alert variation="warn" role="region">No results found for the current filters</Alert>` (L295-296). Announced via the L298/L301 live regions.
- Search/list errors: `<Alert variation="error" role="region">` in `DatasetSearch`, `DatasetList`.

No centralized validation announcement system. `FilterDataset` validates inline (blocks submit) without live-region announcement of why.

## Color and contrast

`dc-c-*` (data-catalog) classes are structural. Color comes from design-system tokens (`var(--color-primary)`, `var(--color-gray-*)`). Spot-check raw hex values: `grep -rn "#[0-9a-fA-F]\{3,6\}" src/**/*.scss` before approving PRs that add colors.

## Skip links + landmarks

**No skip-to-main link** — consumer-site responsibility (destination depends on consumer layout). Add near start of `<body>`.

Templates don't consistently wrap in `<main>`. New templates: prefer semantic landmarks at the top-level container.

## jest-axe (unused)

Installed; imported in [navlink.test.jsx](../src/components/NavLink/navlink.test.jsx) lines 4+8 but no `await axe(container)` calls anywhere.

Canonical pattern:
```ts
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no axe violations', async () => {
  const { container } = render(<MyComponent {...props} />);
  expect(await axe(container)).toHaveNoViolations();
});
```

High-value targets (priority order):
1. `Datatable` — resize/sort buttons, live regions.
2. `ManageColumns` — drag-drop semantics, modal focus, custom sensors.
3. `FilterDataset` — form, modal, validation.
4. `Header`/`MobileHeader` — bespoke focus trap.
5. `Dataset` template — composition smoke test.

axe catches structural bugs (missing labels, bad ARIA, contrast). Doesn't replace keyboard/SR testing for focus trap, column-resize keyboard, dnd-kit reorder.

## Recent commits

- [`67b9d6f`](https://github.com/GetDKAN/cmsds-open-data-components/commit/67b9d6f) — Resolve various 508 compliance issues.
- [`9592b9b`](https://github.com/GetDKAN/cmsds-open-data-components/commit/9592b9b) — WCMS-28004: month/year-only date format (affects SR announcements).

For precedent on similar fixes: `git log --oneline | grep -iE '508|a11y|accessib|keyboard|aria|focus'`.

## Status summary

| Area | Status |
|---|---|
| `aria-live` regions in Datatable | Polite (loading) + assertive (no-results) |
| `aria-sort` on column headers | Both header variants |
| Keyboard column resize | Enter/Space toggle, Arrow ±10, Escape, Blur |
| Header / mobile-menu focus trap | Bespoke, complete |
| ManageColumns drag-drop | dnd-kit defaults + custom checkbox-aware sensors |
| Modals / dialogs | Design-system `<Dialog>` |
| Tabs | Design-system `<Tabs>` |
| Skip link | Not provided (consumer responsibility) |
| Landmark wrappers (`<main>`) | Inconsistent |
| Validation announcements | Visual only, no live-region |
| jest-axe coverage | Imported once, no assertions |
