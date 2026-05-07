---
applyTo: "src/index.ts"
---

# Public surface

This file IS the public API of `@civicactions/cmsds-open-data-components`. Anything re-exported here is consumed by downstream sites.

## Rules

- **Adding, removing, or renaming an export is a breaking change.** Update [`agent-docs/consumer-integration.md`](../../agent-docs/consumer-integration.md) (the templates table, components list, hooks/utilities sections) in the same PR.
- **Renames** require keeping the old export as an alias for at least one minor version, OR a major version bump. Prior renames (`DataTable` ← `Datatable`, `DatasetTable` ← `DatasetTableTab`) kept aliases — follow that pattern.
- **New default-exported templates** that call query hooks must self-wrap with `withQueryProvider` at the default export, matching the existing six (`Dataset`, `DatasetSearch`, `DatasetList`, `FilteredResource`, `DatasetListSubmenu`, `DatasetDataDictionaryTab`).
- **Don't re-export internal utilities** unless a consumer explicitly needs them. Once exported, they're contractually stable.

## Verification before shipping

1. `npm run build` — confirm `dist/` regenerates cleanly.
2. `npx generate-usage-report` (in a consumer site) — confirm the change shows up.
3. Update the templates / components / utilities tables in [`agent-docs/consumer-integration.md`](../../agent-docs/consumer-integration.md).
4. Bump version per [`agent-docs/release-process.md`](../../agent-docs/release-process.md). Breaking changes = major bump.

## See also

- [`agent-docs/consumer-integration.md`](../../agent-docs/consumer-integration.md) — full export reference
- [`agent-docs/architecture.md`](../../agent-docs/architecture.md) — public-surface boundary rationale
