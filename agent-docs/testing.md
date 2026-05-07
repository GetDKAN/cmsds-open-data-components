# Testing

Jest 30 + React Testing Library. Storybook + MSW is separate — see [storybook-and-mocking.md](storybook-and-mocking.md).

## Setup

[jest.config.cjs](../jest.config.cjs):
- `testEnvironment: jest-environment-jsdom`
- `setupFilesAfterEach: setupTests.js`
- `testPathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/node_modules/']`
- `moduleNameMapper`:
  - Asset imports (`.jpg`/`.png`/`.svg`/fonts/audio/video) → [__mocks__/fileMock.js](../__mocks__/fileMock.js)
  - Stylesheets (`.css`/`.less`/`.scss`) → [__mocks__/styleMock.js](../__mocks__/styleMock.js)
  - `swagger-ui-react` → [__mocks__/swaggerMock.js](../__mocks__/swaggerMock.js) (no-op; jsdom can't render it)
  - Eight `react-dnd*` packages remapped to CJS — **dead config**. Library uses `@dnd-kit`, not `react-dnd`. No `react-dnd` imports in src/.

[setupTests.js](../setupTests.js):
```js
import "@testing-library/jest-dom";
import 'jest-canvas-mock';
```

That's all global setup. **No polyfills** for `IntersectionObserver`, `ResizeObserver`, `matchMedia`, `crypto.randomUUID` — add per-file when needed.

**No coverage thresholds.** CI runs `npx jest --coverage`. `npm run test:coverage` available locally. Baseline ~32% across ~96 inventory items.

## Libraries (package.json)

- `jest@30.0.5`, `jest-environment-jsdom@^30.0.5`
- `@testing-library/react@^14.0.0` — **React 18 only**. Bumping React requires bumping this.
- `@testing-library/jest-dom@^6.6.4`, `@testing-library/user-event@^14.4.3`, `@testing-library/dom@^9.3.3`
- `jest-axe@^10.0.0` — installed but unused (see "jest-axe" below)
- `jest-canvas-mock@^2.5.2`

No MSW in tests. No `whatwg-fetch` polyfill. No `jest-fetch-mock`.

## Test files

31 in `src/`, plus 2 in `scripts/` (`generate-inventory.test.js`, `generate-usage-report.test.js`).

Naming is **inconsistent** (don't bulk-rename, fix as you touch):
- PascalCase: `Datatable.test.jsx`, `ManageColumns.test.js`, `MobileHeader.test.tsx`
- lowercase: `dataset.test.jsx`, `datasetsearch.test.jsx`, `navlink.test.jsx`
- snake_case: `dataset_search_facets.test.jsx`
- kebab-case: `dataset-description.test.jsx`

Extensions mixed (`.jsx`/`.tsx`/`.js`). Always `.test.*`, never `.spec.*`. New files: PascalCase + `.tsx` if source is `.tsx`, else `.jsx`.

## Canonical component test

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterChip from './index';

describe('<FilterChip />', () => {
  it('renders', () => {
    render(<FilterChip iconClass="fa fa-filter" text="Test" onClick={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveTextContent('Test');
  });
});
```

From [FilterChip/index.test.tsx](../src/components/FilterChip/index.test.tsx). Conventions:
- `render`, `screen`, `fireEvent` (or `userEvent` in newer tests).
- Semantic queries first: `getByRole`, `getByText`. `getByTestId` for invisible structural nodes.
- `import '@testing-library/jest-dom'` is global (in `setupTests.js`).
- `describe('<Foo />', …)` JSX-tagged form.

## Provider wrapping

No shared `renderWithProviders`. Each test wraps inline:
- `<MemoryRouter>` — for `useNavigate`/`useSearchParams`.
- `<DataTableContext.Provider>` + custom `MockDataTableActionsProvider` (defined per-file — see [DataTableControls.test.jsx](../src/components/DataTableControls/DataTableControls.test.jsx)).
- Design-system styles not loaded (CSS mocked). Tests assert on roles/text, not visual.

## Why no `QueryClientProvider` in tests

Zero test files import `QueryClientProvider`, despite templates using `useQuery`.

Six exports self-wrap at default export — four templates plus two components:
```tsx
// src/templates/Dataset/index.tsx:312
export default withQueryProvider(Dataset);
// src/templates/DatasetSearch/DatasetSearch.tsx:382
export default withQueryProvider(DatasetSearch);
// src/templates/DatasetList/DatasetList.tsx:286
export default withQueryProvider(DatasetList);
// src/templates/FilteredResource/index.jsx:87
export default withQueryProvider(FilteredResource);
// src/components/DatasetListSubmenu/DatasetListSubmenu.tsx:124
export default withQueryProvider(DatasetListSubmenu);
// src/components/DatasetDataDictionaryTab/index.tsx:37
export default withQueryProvider(DataDictionary);
```

`withQueryProvider` ([src/utilities/QueryProvider/QueryProvider.jsx](../src/utilities/QueryProvider/QueryProvider.jsx)) uses a module-scoped `QueryClient`. Tests that import any wrapped default export get the provider for free.

**Sharp edge**: the `QueryClient` is shared across tests — cached data leaks. Tests depending on a clean cache must `queryClient.clear()` or render with `staleTime: 0` + `cacheTime: 0`. Current tests don't trip on this — they assert on rendered DOM, not cached state.

Components using `useQuery` outside a wrapped template need their own `QueryClientProvider`. No examples in the suite.

## Template tests — axios mocking

Three template tests: [dataset.test.jsx](../src/templates/Dataset/dataset.test.jsx), [datasetsearch.test.jsx](../src/templates/DatasetSearch/datasetsearch.test.jsx), [specs.test.js](../src/templates/SpecsAndLimits/specs.test.js).

Pattern (dataset.test.jsx):
```js
import axios from 'axios';
import * as dataset from '../../tests/fixtures/dataset';
jest.mock('axios');

beforeEach(() => {
  axios.get.mockImplementation((url) => {
    switch (url) {
      case '...metastore/schemas/dataset/items/4eaa5ebe-...':
        return Promise.resolve({ data: dataset });
      default: return;
    }
  });
});

test('renders', async () => {
  await act(async () => {
    jest.useFakeTimers();
    await render(
      <MemoryRouter>
        <Dataset rootUrl={rootUrl} id="4eaa5ebe-…" />
      </MemoryRouter>
    );
  });
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: '…' })).toBeInTheDocument();
  });
});
```

Two things to know:
1. **`jest.mock('axios')` does NOT intercept `fetch`.** `useDatastore` uses `fetch`; these tests assert only on metadata (`useMetastoreDataset`, axios). For row-level assertions, also mock `global.fetch`.
2. **`act` + `useFakeTimers` + `waitFor`** — silences React 18 act warnings, lets React Query settle. Skip `act` → warnings; skip `waitFor` → asserts before data arrives.

URL keys must match the **exact** request URL including `?show-reference-ids` from `useMetastoreDataset`. Mismatch → undefined response → React Query `isError`. Cross-ref [data-flow.md](data-flow.md) and [dkan-api.md](dkan-api.md).

## Hooks

**No dedicated hook tests.** `useDatastore`/`useMetastoreDataset`/`useSearchAPI` exercised indirectly through template tests.

For new hook tests: `renderHook` from `@testing-library/react`, mock `axios`/`fetch` per template pattern, wrap with fresh `QueryClientProvider` per test.

## Mocking patterns

| Target | Pattern | Example |
|---|---|---|
| `axios` | `jest.mock('axios')` + `axios.get.mockImplementation(...)` | dataset.test.jsx |
| Child component | `jest.mock('../Foo', () => function MockFoo(p) { return <div ...>...</div> })` | DataTableToolbar/index.test.tsx |
| `window.history.pushState` | `jest.spyOn(window.history, 'pushState').mockImplementation(...)` | DataTableToolbar/index.test.tsx |
| `window.matchMedia` | `Object.defineProperty(window, 'matchMedia', {writable: true, value: jest.fn(...)})` | datasetsearch.test.jsx |
| `localStorage` | `Object.defineProperty(window, 'localStorage', {value: {getItem, setItem, clear}})` | DataTableToolbar/index.test.tsx |
| `window.scrollTo` | `window.scrollTo = jest.fn()` (module level) | ManageColumns.test.js |

Cleanup: `jest.clearAllMocks()` in `beforeEach`. No global `afterEach` — `localStorage` and timers can leak between tests.

## Fixtures — two locations

| Location | Format | Purpose | Used by |
|---|---|---|---|
| [src/tests/fixtures/](../src/tests/fixtures/) | `.json` | Test data | Jest tests via `import * as foo from '...'` |
| [__mocks__/](../__mocks__/) | `.js`/`.ts` | Jest module mocks (`*Mock.js`) + Storybook MSW data (`mock*.js`) | Jest config (`*Mock.js`); Storybook (`mock*.js`) |

**Don't share data between them.** `__mocks__/mockDatasetItem.js` is for Storybook — its shape doesn't match Jest needs. Use `src/tests/fixtures/*.json` in tests.

JSON fixtures sometimes mutated in place (`fixture.setSort = jest.fn()` — [DataTableControls.test.jsx](../src/components/DataTableControls/DataTableControls.test.jsx)). Brittle if Jest freezes module namespaces. Prefer `import foo from '...'` + spread.

## dnd-kit / ManageColumns

[ManageColumns.test.js](../src/components/ManageColumns/ManageColumns.test.js) does not test drag mechanics — only handler calls and state. Simulating dnd-kit in jsdom isn't worth it. Call handlers directly to test reorder logic.

## jest-axe (installed, not used)

[navlink.test.jsx](../src/components/NavLink/navlink.test.jsx) lines 4+8:
```js
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

No `await axe(container)` calls anywhere. See [accessibility.md](accessibility.md) for canonical pattern and high-value targets.

## Patterns by component type

| Component type | Pattern | Example |
|---|---|---|
| Pure leaf (no hooks, no router, no API) | `render` + `screen.getByRole` | [FilterChip/index.test.tsx](../src/components/FilterChip/index.test.tsx) |
| Uses `react-router` hooks | wrap in `<MemoryRouter>` | [dataset.test.jsx](../src/templates/Dataset/dataset.test.jsx) |
| Uses `useDatastore` (fetch) | `global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(...) }))` — branch on URL/query in the implementation. **Don't reach for MSW** (not configured for tests). | (no current example) |
| Uses `useMetastoreDataset` (axios) | `jest.mock('axios')`, mock `axios.get`, wrap router; use wrapped default export | [dataset.test.jsx](../src/templates/Dataset/dataset.test.jsx) |
| Deep child tree | `jest.mock('./Child', () => function Mock() { return <div data-testid="child" /> })` | [DataTableToolbar/index.test.tsx](../src/components/DataTableToolbar/index.test.tsx) |
| Reads `localStorage` | `Object.defineProperty(window, 'localStorage', ...)` per file, reset in `beforeEach` | DataTableToolbar/index.test.tsx |

## Gotchas

- **`@testing-library/react@^14.x` = React 18.** Bumping React requires bumping this.
- **Shared `QueryClient` persists across tests.** Clear manually if cache state matters.
- **`fetch` is unmocked.** Tests exercising `useDatastore` paths hit jsdom's real fetch (throws) unless mocked. Current suite avoids by asserting only on metadata.
- **No polyfills** for `IntersectionObserver`/`ResizeObserver`/`matchMedia`/`crypto.randomUUID`. Add per-file (see datasetsearch.test.jsx for `matchMedia`).
- **`jest.useFakeTimers()` is per-test.** Forgetting `jest.useRealTimers()` in cleanup leaks across tests.
- **No `__mocks__/axios.js`.** Creating one auto-mocks axios everywhere — can break tests expecting real axios.
- **`react-dnd*` moduleNameMapper is dead.** Library uses `@dnd-kit`. Ignore the mappings.
- **`swagger-ui-react` mock is required.** Removing it from jest.config breaks any test that mounts `APIPage` or transitively imports Swagger UI.
- **Script tests are CommonJS** ([scripts/generate-inventory.test.js](../scripts/generate-inventory.test.js)). Different conventions; leave alone unless modifying the scripts.
