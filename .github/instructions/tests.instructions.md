---
applyTo: "**/*.test.{ts,tsx,js,jsx}"
---

# Test conventions

## Mocking HTTP

Match the mock to the transport:

| Service | Transport | Mock |
|---|---|---|
| `useDatastore` | `fetch` | `global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(...) }))` — branch on URL/query in the implementation |
| `useMetastoreDataset` | `axios` | `jest.mock('axios')` |
| `useSearchAPI` | `axios` | `jest.mock('axios')` |

**Do NOT reach for MSW** — it is not configured for Jest. MSW is Storybook-only ([`.storybook/mswHandlers.ts`](../../.storybook/mswHandlers.ts)).

`jest.mock('axios')` does not intercept `fetch`. If you mock axios and the component uses `useDatastore`, your mock does nothing.

## QueryClientProvider

Templates that self-wrap with `withQueryProvider` (`Dataset`, `DatasetSearch`, `DatasetList`, `FilteredResource`, `DatasetListSubmenu`, `DatasetDataDictionaryTab`) do **not** need a `QueryClientProvider` in tests — they bring their own. Wrapping them again creates two clients in one tree.

Direct calls to `useDatastore`/`useMetastoreDataset`/`useSearchAPI` outside a wrapped export DO need a `QueryClientProvider` (or `withQueryProvider`).

## Routing

Tests that render anything using `Link`/`useNavigate`/`useSearchParams` need a router. Use `MemoryRouter` from `react-router-dom`.

## Fixtures

Live in [`src/tests/fixtures/`](../../src/tests/fixtures/). Reuse before authoring new ones.

## Running

- `npm test` — full suite
- `npm test -- path/to/file` — single file
- `npm test -- --watch` — watch mode

## Footguns

- Mocking axios when the code uses fetch (and vice versa). Check the service before writing the mock.
- Asserting on resolved data without `await waitFor(...)` — React Query is async even when fetches resolve synchronously.
- Using `jest.mock('axios')` at module scope but importing the real axios elsewhere — mock factory hoisting can drop calls.
