# Component Inventory Generator

This script automatically generates a comprehensive markdown inventory report for the cmsds-open-data-components library.

## Usage

Run the script using npm:

```bash
npm run generate:inventory
```

Or run it directly:

```bash
node scripts/generate-inventory.cjs
```

## Output

The script generates `COMPONENTS_INVENTORY.md` in the root directory containing:

- **Inventory Table**: Complete list of all components, services, templates, hooks, contexts, utilities, types, and assets
- **Public Export Status**: Indicates which items are publicly exported vs internal-only
- **Storybook Status**: Shows which items have Storybook stories for visual documentation
- **Unit Test Status**: Shows which items have unit test coverage
- **Quality Metrics**: Summary statistics for documentation and testing coverage
- **Export Summary**: Count of public vs internal items by category

## What It Scans

The script automatically scans the following directories:

- `src/components/` - React components
- `src/templates/` - Page-level templates
- `src/services/` - API service hooks
- `src/utilities/` - Utility functions
- `src/types/` - TypeScript type definitions
- `src/assets/` - Static assets and data files

It also automatically detects:
- **Hooks**: Directories or files starting with `use` (e.g., `useScrollToTop`)
- **Contexts**: Files ending with `Context` that contain `createContext()` calls

## How It Works

1. **Reads `src/index.ts`** to determine which items are publicly exported
2. **Scans each directory** for subdirectories and files
3. **Dynamically discovers hooks and contexts** by naming patterns and file content
4. **Checks for `.stories.*` files** to determine Storybook coverage
5. **Checks for `.test.*` and `.spec.*` files** to determine unit test coverage
6. **Calculates statistics** for overall project quality metrics
7. **Generates markdown** with formatted tables and summaries

## Maintenance

The script is designed to automatically adapt to changes in the codebase:

- New components/templates/services/hooks/contexts are automatically discovered
- Public export status updates when `src/index.ts` changes
- Story and test status updates as files are added/removed
- Statistics recalculate automatically

No manual updates needed when adding or removing hooks and contexts!

### Hook and Context Detection

**Hooks** are detected by:
- Directory names starting with `use` (e.g., `src/components/useScrollToTop/`)
- File names starting with `use` (e.g., `useAddLoginLink.ts`)

**Contexts** are detected by:
- File names ending with `Context` (e.g., `HeaderContext.tsx`)
- File must contain a `createContext()` call
- Export name is extracted from `export default` or `export const` statements

The scanner automatically excludes test and story files to prevent false positives.

### Known Special Cases

The script handles several special cases:

- **DatasetAdditionalInformation**: Exports `buildRows` function
- **DatasetTableTab**: Exported as `DatasetTable`
- **Datatable**: Exported as `DataTable` (case difference)
- **frequencyMap**: Commented out in exports
- **aca.ts**: Exports `acaToParams` function

To add new special cases, update the scanning functions in `generate-inventory.cjs`.

## File Structure

```
scripts/
  generate-inventory.cjs    # Main script file
  README.md                 # This file

COMPONENTS_INVENTORY.md     # Generated output file (root directory)
```

## Requirements

- Node.js v14 or higher
- No additional dependencies required (uses Node.js built-in `fs` and `path` modules)

## Troubleshooting

**Error: "require is not defined"**
- The script uses `.cjs` extension to work with the ES module package type
- Make sure the file is named `generate-inventory.cjs` (not `.js`)

**Missing components in output**
- Ensure new components follow the standard directory structure
- Component directories should be in `src/components/`
- Each component should have an `index.tsx` or similar entry file

**Incorrect public export status**
- Check if the component is exported in `src/index.ts`
- For special export names, add them to the scanning logic in the script
