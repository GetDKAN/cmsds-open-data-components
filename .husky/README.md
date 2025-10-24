# Git Hooks Configuration

This directory contains Git hooks managed by [Husky](https://typicode.github.io/husky/).

## Installed Hooks

### pre-commit

Automatically runs before each commit to:

1. **Generate Component Inventory** - Runs `npm run generate:inventory` to update the `COMPONENTS_INVENTORY.md` file
2. **Auto-stage Changes** - If the inventory file is modified, it automatically adds it to the commit

This ensures the component inventory is always up-to-date with the current state of the codebase.

## How It Works

When you run `git commit`:

```bash
🔍 Generating component inventory...
# Runs the inventory generation script
# Scans all components, templates, services, etc.
# Updates COMPONENTS_INVENTORY.md

✅ Component inventory updated. Adding to commit...
# Or: ℹ️  Component inventory unchanged.
```

If the inventory changes, it's automatically added to your commit. You don't need to manually run the inventory script or remember to add the file.

## Setup for New Contributors

Husky is automatically installed when you run:

```bash
npm install
```

The `prepare` script in `package.json` ensures Husky is set up correctly after installation.

## Disabling Hooks (Not Recommended)

If you need to skip the pre-commit hook in an emergency:

```bash
git commit --no-verify -m "your message"
```

**Note:** This is not recommended as it will result in an outdated inventory file.

## Modifying Hooks

To modify the pre-commit behavior, edit `.husky/pre-commit` directly. The file is a simple shell script.

## Troubleshooting

### Hook doesn't run
- Ensure Husky is installed: `npm install`
- Check that the hook is executable: `chmod +x .husky/pre-commit`
- Verify the `prepare` script exists in `package.json`

### Inventory generation fails
- Check that Node.js is installed and accessible
- Verify the script exists: `scripts/generate-inventory.cjs`
- Try running manually: `npm run generate:inventory`

## Version

Current Husky version: See `package.json` devDependencies
