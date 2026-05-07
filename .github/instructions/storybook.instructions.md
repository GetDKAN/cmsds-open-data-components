---
applyTo: "**/*.stories.{ts,tsx,jsx}"
---

# Storybook conventions

## Mocking

- **MSW handlers** live in [`.storybook/mswHandlers.ts`](../../.storybook/mswHandlers.ts). Reuse before authoring new ones.
- The in-memory query engine `filterResultsByConditions` powers MSW responses for datastore queries. Use it for filter/search stories rather than hand-rolling response shapes.
- MSW is Storybook-only — Jest tests do **not** see these handlers.

## Decorators

- `FontAwesomeProToFree` rewrites Pro FA classes to Free equivalents at story render time. It runs in Storybook only — consumer sites don't get this decorator and may render some icons incorrectly if they ship Free FA.
- Stories that render data templates often need a `MemoryRouter` decorator (templates use `Link`/`useNavigate`/etc.).

## QueryClient

Templates that self-wrap with `withQueryProvider` (`Dataset`, `DatasetSearch`, `DatasetList`, `FilteredResource`, `DatasetListSubmenu`, `DatasetDataDictionaryTab`) bring their own client. Don't add a global `QueryClientProvider` decorator that wraps these — you'll end up with two clients.

For non-wrapping components/hooks, add a per-story `QueryClientProvider` decorator with a fresh client per story to prevent cache bleed.

## Common pitfalls

- **Perpetual loading after a mock change**: cached query result from a previous mock. Add a fresh `QueryClient` per story or call `queryClient.clear()` in a decorator.
- **Story imports a Pro FA icon directly**: works in Storybook (decorator rewrites), breaks for consumers. Use Free icons in source where possible.
- **MSW handler missing for a new endpoint**: returns the unhandled-request fallthrough; story shows error or empty state. Add the handler in `mswHandlers.ts`.

## Running

- `npm run storybook` — start dev on :6006
- `npm run build-storybook` — static build for deploys

## See also

- [`agent-docs/storybook-and-mocking.md`](../../agent-docs/storybook-and-mocking.md) — full reference
