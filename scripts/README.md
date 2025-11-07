# Scripts Documentation

This directory contains utility scripts for managing and analyzing the cmsds-open-data-components library.

## Component Inventory Generator

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
  generate-inventory.cjs       # Component inventory script
  generate-inventory.test.js   # Tests for inventory script
  generate-usage-report.cjs    # Component usage report script
  generate-usage-report.test.js # Tests for usage report script
  README.md                    # This file

COMPONENTS_INVENTORY.md        # Generated inventory (root directory)
COMPONENT_USAGE_REPORT.md      # Generated usage report (root directory, when run in dependent projects)
SAMPLE_COMPONENT_USAGE_REPORT.md # Sample usage report (root directory, when run locally)
```

---

# Component Usage Report Generator

This script analyzes projects that use cmsds-open-data-components as a dependency and generates a comprehensive report showing which components are being used and where.

## Usage

### In Projects Using cmsds-open-data-components

From a project that has `@civicactions/cmsds-open-data-components` as a dependency:

```bash
npx generate-usage-report
```

Or add to your project's scripts in `package.json`:
```json
{
  "scripts": {
    "usage-report": "generate-usage-report"
  }
}
```

Then run:
```bash
npm run usage-report
```

### In the Library Repository

Run the script directly in this repository to generate a sample report:

```bash
npm run generate:usage-report
```

Or run it directly:

```bash
node scripts/generate-usage-report.cjs
```

When run in the library repository, it generates a sample report (`SAMPLE_COMPONENT_USAGE_REPORT.md`) by analyzing Storybook files.

## Output

The script generates a markdown report containing:

- **Library Version**: Version of cmsds-open-data-components being analyzed
- **Summary Statistics**: Total unique components, import statements, and files analyzed
- **Category Breakdown**: Components grouped by type (Component, Template, Hook, Context, Service, Utility)
- **Component Usage Details**: Table showing each component with:
  - Component name (linked to GitHub repository)
  - Category/type
  - Number of times imported
  - List of files where it's used

## What It Scans

The script scans the following directories in your project:

- `src/` - Main source directory
- `app/` - Next.js app directory
- `pages/` - Next.js pages directory
- `components/` - Components directory
- `templates/` - Templates directory

It searches for these file types:
- `.js`, `.jsx` - JavaScript/React files
- `.ts`, `.tsx` - TypeScript/React files

The script automatically excludes:
- `node_modules/` - Dependencies
- `dist/`, `build/` - Build output directories
- `.next/`, `.cache/` - Framework cache directories

## How It Works

1. **Detects execution context**: Determines if running in the library repo or a dependent project
2. **Scans project files**: Recursively searches for JavaScript/TypeScript files
3. **Parses imports**: Uses regex to find imports from `@civicactions/cmsds-open-data-components`
4. **Tracks usage**: Records each component, where it's imported, and at what line number
5. **Categorizes components**: Automatically categorizes by naming patterns:
   - Hooks: Names starting with `use`
   - Contexts: Names ending with `Context`
   - Templates: From `templates/` directory
   - Services: From `services/` directory
   - Utilities: From `utilities/` directory
   - Components: Everything else
6. **Generates report**: Creates formatted markdown with statistics and detailed usage tables
7. **Adds GitHub links**: Links each component name to its source in the GitHub repository

## Component Categories

Components are automatically categorized based on naming conventions and source location:

- **Hook**: Components starting with `use` (e.g., `useScrollToTop`, `useDatastore`)
- **Context**: Components ending with `Context` (e.g., `ACAContext`)
- **Template**: Components from the `templates/` directory
- **Service**: Components from the `services/` directory
- **Utility**: Components from the `utilities/` directory
- **Component**: All other React components

## Sample vs Real Reports

**In the library repository**: Generates `SAMPLE_COMPONENT_USAGE_REPORT.md` by analyzing how components are used in Storybook files. This serves as an example of the report format.

**In dependent projects**: Generates `COMPONENT_USAGE_REPORT.md` by analyzing actual component usage throughout the project's codebase.

## Requirements

- Node.js v14 or higher
- No additional dependencies required (uses Node.js built-in `fs` and `path` modules)

## Troubleshooting

**Error: "require is not defined"**
- The script uses `.cjs` extension to work with the ES module package type
- Make sure the file is named `generate-usage-report.cjs` (not `.js`)

**No components found in scan**
- Verify that `@civicactions/cmsds-open-data-components` is installed as a dependency
- Check that your import statements use the full package name
- Ensure source files are in scanned directories (`src/`, `app/`, `pages/`, `components/`, `templates/`)

**Missing some component usages**
- The script only detects standard ES6 import syntax
- Dynamic imports (e.g., `import()`) are not currently detected
- Ensure imports use the package name: `from '@civicactions/cmsds-open-data-components'`

---

## File Structure

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
