#!/usr/bin/env node

/**
 * Component Inventory Generator
 * 
 * Scans the cmsds-open-data-components repository and generates a comprehensive
 * markdown inventory report including:
 * - Components, templates, services, hooks, utilities, types, and assets
 * - Public export status
 * - Storybook story availability
 * - Unit test coverage
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const OUTPUT_FILE = path.join(ROOT_DIR, 'COMPONENTS_INVENTORY.md');

// Read the main index.ts to determine what's publicly exported
function getPublicExports() {
  const indexPath = path.join(SRC_DIR, 'index.ts');
  const content = fs.readFileSync(indexPath, 'utf8');
  
  const exports = new Set();
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Match default exports: export { default as Name } from '...'
    const defaultMatch = line.match(/export\s+\{\s*default\s+as\s+(\w+)\s*\}/);
    if (defaultMatch) {
      exports.add(defaultMatch[1]);
    }
    
    // Match named exports: export { name1, name2 } from '...'
    const namedMatch = line.match(/export\s+\{\s*([^}]+)\s*\}\s+from/);
    if (namedMatch) {
      const names = namedMatch[1].split(',').map(n => n.trim());
      names.forEach(name => exports.add(name));
    }
    
    // Match direct exports: export function name
    const directMatch = line.match(/export\s+(?:function|const|class)\s+(\w+)/);
    if (directMatch) {
      exports.add(directMatch[1]);
    }
  });
  
  return exports;
}

// Check if a component/template has a Storybook story
function hasStory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.some(file => 
      file.endsWith('.stories.js') || 
      file.endsWith('.stories.jsx') || 
      file.endsWith('.stories.ts') || 
      file.endsWith('.stories.tsx')
    );
  } catch (e) {
    return false;
  }
}

// Check if a component/template has unit tests
function hasTests(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.some(file => 
      file.includes('.test.') || 
      file.includes('.spec.')
    );
  } catch (e) {
    return false;
  }
}

// Get all directories in a path
function getDirectories(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
  } catch (e) {
    return [];
  }
}

// Scan components directory
function scanComponents(publicExports) {
  const componentsDir = path.join(SRC_DIR, 'components');
  const componentDirs = getDirectories(componentsDir);
  
  return componentDirs.map(name => {
    const dirPath = path.join(componentsDir, name);
    
    // Check if public by various name matches
    const isPublic = publicExports.has(name) || 
                     publicExports.has(name + 's') || // plural form
                     name === 'DatasetAdditionalInformation' && publicExports.has('buildRows') ||
                     name === 'DatasetTableTab' && publicExports.has('DatasetTable') ||
                     name === 'Datatable' && publicExports.has('DataTable'); // Handle case difference
    
    let exportNote = '';
    if (name === 'DatasetAdditionalInformation') exportNote = ' (buildRows)';
    if (name === 'DatasetTableTab') exportNote = ' (as DatasetTable)';
    
    return {
      type: 'Component',
      name,
      path: `src/components/${name}`,
      isPublic,
      exportNote,
      hasStory: hasStory(dirPath),
      hasTests: hasTests(dirPath)
    };
  });
}

// Scan templates directory
function scanTemplates(publicExports) {
  const templatesDir = path.join(SRC_DIR, 'templates');
  const templateDirs = getDirectories(templatesDir);
  
  return templateDirs.map(name => {
    const dirPath = path.join(templatesDir, name);
    const isPublic = publicExports.has(name);
    
    return {
      type: 'Template',
      name,
      path: `src/templates/${name}`,
      isPublic,
      exportNote: '',
      hasStory: hasStory(dirPath),
      hasTests: hasTests(dirPath)
    };
  });
}

// Scan services directory
function scanServices(publicExports) {
  const servicesDir = path.join(SRC_DIR, 'services');
  const serviceDirs = getDirectories(servicesDir);
  
  return serviceDirs.map(name => {
    const dirPath = path.join(servicesDir, name);
    const isPublic = publicExports.has(name);
    
    return {
      type: 'Service',
      name,
      path: `src/services/${name}`,
      isPublic,
      exportNote: '',
      hasStory: false, // Services don't have stories
      hasTests: hasTests(dirPath)
    };
  });
}

// Scan utilities directory
function scanUtilities(publicExports) {
  const utilitiesDir = path.join(SRC_DIR, 'utilities');
  const files = fs.readdirSync(utilitiesDir, { withFileTypes: true });
  
  const items = [];
  
  files.forEach(file => {
    if (file.isDirectory()) {
      const dirPath = path.join(utilitiesDir, file.name);
      items.push({
        type: 'Utility',
        name: file.name,
        path: `src/utilities/${file.name}`,
        isPublic: publicExports.has(file.name),
        exportNote: '',
        hasStory: false,
        hasTests: hasTests(dirPath)
      });
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      const name = file.name.replace(/\.(ts|tsx)$/, '');
      if (name !== 'index') {
        items.push({
          type: 'Utility',
          name,
          path: `src/utilities/${file.name}`,
          isPublic: publicExports.has(name) || publicExports.has('acaToParams') && name === 'aca',
          exportNote: name === 'aca' ? ' (acaToParams)' : '',
          hasStory: false,
          hasTests: false
        });
      }
    }
  });
  
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

// Scan types directory
function scanTypes() {
  const typesDir = path.join(SRC_DIR, 'types');
  const files = fs.readdirSync(typesDir).filter(f => f.endsWith('.ts'));
  
  return files.map(file => ({
    type: 'Type Definition',
    name: file,
    path: `src/types/${file}`,
    isPublic: false, // Type definitions are generally internal
    exportNote: '',
    hasStory: false,
    hasTests: false
  }));
}

// Scan assets directory
function scanAssets(publicExports) {
  const assetsDir = path.join(SRC_DIR, 'assets');
  const files = fs.readdirSync(assetsDir).filter(f => 
    f.endsWith('.js') || f.endsWith('.jsx')
  );
  
  return files.map(file => {
    const name = file.replace(/\.(js|jsx)$/, '');
    const isPublic = publicExports.has(name) || publicExports.has('defaultMetadataMapping');
    const isCommented = name === 'frequencyMap'; // Based on index.ts
    
    return {
      type: 'Asset',
      name,
      path: `src/assets/${file}`,
      isPublic,
      exportNote: isCommented ? ' (commented out)' : '',
      hasStory: false,
      hasTests: false
    };
  });
}

// Add hooks and contexts manually based on known exports
function getHooksAndContexts(publicExports) {
  return [
    {
      type: 'Hook',
      name: 'useAddLoginLink',
      path: 'src/components/useAddLoginLink',
      isPublic: true,
      exportNote: '',
      hasStory: false,
      hasTests: false
    },
    {
      type: 'Hook',
      name: 'useScrollToTop',
      path: 'src/components/useScrollToTop',
      isPublic: true,
      exportNote: '',
      hasStory: false,
      hasTests: false
    },
    {
      type: 'Context',
      name: 'HeaderContext',
      path: 'src/templates/Header/HeaderContext.tsx',
      isPublic: true,
      exportNote: '',
      hasStory: false,
      hasTests: false
    },
    {
      type: 'Context',
      name: 'DataTableContext',
      path: 'src/templates/Dataset/DataTableContext.tsx',
      isPublic: true,
      exportNote: '',
      hasStory: false,
      hasTests: false
    },
    {
      type: 'Context',
      name: 'DataTableActionsProvider',
      path: 'src/components/DatasetTableTab/DataTableActionsContext.tsx',
      isPublic: true,
      exportNote: '',
      hasStory: false,
      hasTests: false
    },
    {
      type: 'Context',
      name: 'ACAContext',
      path: 'src/utilities/ACAContext.ts',
      isPublic: true,
      exportNote: '',
      hasStory: false,
      hasTests: false
    }
  ];
}

// Generate markdown table row
function generateTableRow(item) {
  const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${item.path}`;
  const publicStatus = item.isPublic 
    ? `✅ Public${item.exportNote}` 
    : '❌ Internal';
  const storyStatus = item.hasStory ? '✅ Has Story' : '❌ No Story';
  const testStatus = item.hasTests ? '✅ Has Tests' : '❌ No Tests';
  
  return `| ${item.type} | [${item.name}](${githubUrl}) | ${publicStatus} | ${storyStatus} | ${testStatus} |`;
}

// Calculate statistics
function calculateStats(items) {
  const components = items.filter(i => i.type === 'Component');
  const templates = items.filter(i => i.type === 'Template');
  const servicesHooksContexts = items.filter(i => 
    i.type === 'Service' || i.type === 'Hook' || i.type === 'Context'
  );
  const utilitiesTypesAssets = items.filter(i => 
    i.type === 'Utility' || i.type === 'Type Definition' || i.type === 'Asset'
  );
  
  const calcCategory = (categoryItems) => {
    const total = categoryItems.length;
    const withStories = categoryItems.filter(i => i.hasStory).length;
    const withTests = categoryItems.filter(i => i.hasTests).length;
    const withBoth = categoryItems.filter(i => i.hasStory && i.hasTests).length;
    const withNeither = categoryItems.filter(i => !i.hasStory && !i.hasTests).length;
    
    return {
      total,
      withStories,
      withTests,
      withBoth,
      withNeither,
      storiesPercent: total > 0 ? Math.round((withStories / total) * 100) : 0,
      testsPercent: total > 0 ? Math.round((withTests / total) * 100) : 0,
      bothPercent: total > 0 ? Math.round((withBoth / total) * 100) : 0,
      neitherPercent: total > 0 ? Math.round((withNeither / total) * 100) : 0
    };
  };
  
  return {
    components: calcCategory(components),
    templates: calcCategory(templates),
    servicesHooksContexts: calcCategory(servicesHooksContexts),
    utilitiesTypesAssets: calcCategory(utilitiesTypesAssets),
    total: calcCategory(items)
  };
}

// Calculate export summary
function calculateExportSummary(items) {
  const publicItems = items.filter(i => i.isPublic);
  const internalItems = items.filter(i => !i.isPublic);
  
  const countByType = (itemList, type) => itemList.filter(i => i.type === type).length;
  
  return {
    public: {
      components: countByType(publicItems, 'Component'),
      templates: countByType(publicItems, 'Template'),
      services: countByType(publicItems, 'Service'),
      hooks: countByType(publicItems, 'Hook'),
      contexts: countByType(publicItems, 'Context'),
      utilities: countByType(publicItems, 'Utility'),
      assets: countByType(publicItems, 'Asset'),
      total: publicItems.length
    },
    internal: {
      components: countByType(internalItems, 'Component'),
      templates: countByType(internalItems, 'Template'),
      services: countByType(internalItems, 'Service'),
      utilities: countByType(internalItems, 'Utility'),
      types: countByType(internalItems, 'Type Definition'),
      assets: countByType(internalItems, 'Asset'),
      total: internalItems.length
    }
  };
}

// Generate the markdown report
function generateReport() {
  console.log('🔍 Scanning repository...');
  
  const publicExports = getPublicExports();
  console.log(`   Found ${publicExports.size} public exports`);
  
  const components = scanComponents(publicExports);
  console.log(`   Found ${components.length} components`);
  
  const templates = scanTemplates(publicExports);
  console.log(`   Found ${templates.length} templates`);
  
  const services = scanServices(publicExports);
  console.log(`   Found ${services.length} services`);
  
  const hooksAndContexts = getHooksAndContexts(publicExports);
  console.log(`   Found ${hooksAndContexts.length} hooks and contexts`);
  
  const utilities = scanUtilities(publicExports);
  console.log(`   Found ${utilities.length} utilities`);
  
  const types = scanTypes();
  console.log(`   Found ${types.length} type definitions`);
  
  const assets = scanAssets(publicExports);
  console.log(`   Found ${assets.length} assets`);
  
  // Combine all items
  const allItems = [
    ...components,
    ...hooksAndContexts,
    ...services,
    ...templates,
    ...types,
    ...utilities,
    ...assets
  ];
  
  const stats = calculateStats(allItems);
  const exportSummary = calculateExportSummary(allItems);
  
  // Generate markdown
  const lines = [];
  
  // Header
  lines.push('# CMSDS Open Data Components Inventory');
  lines.push('');
  lines.push('This document provides a comprehensive inventory of all components, services, templates, types, and utilities available in the cmsds-open-data-components project. Each item is categorized by type and includes information about whether it is publicly exported or internal-only, has Storybook stories, and has unit tests.');
  lines.push('');
  lines.push('## Inventory Table');
  lines.push('');
  lines.push('| Type | Name | Public Export | Storybook Status | Unit Tests |');
  lines.push('|------|------|---------------|------------------|------------|');
  
  // Components section
  lines.push('| **COMPONENTS** | | | | |');
  components.forEach(item => lines.push(generateTableRow(item)));
  lines.push('| | | | | |');
  
  // Hooks & Contexts section
  lines.push('| **HOOKS & CONTEXTS** | | | | |');
  hooksAndContexts.forEach(item => lines.push(generateTableRow(item)));
  lines.push('| | | | | |');
  
  // Services section
  lines.push('| **SERVICES** | | | | |');
  services.forEach(item => lines.push(generateTableRow(item)));
  lines.push('| | | | | |');
  
  // Templates section
  lines.push('| **TEMPLATES** | | | | |');
  templates.forEach(item => lines.push(generateTableRow(item)));
  lines.push('| | | | | |');
  
  // Types section
  lines.push('| **TYPES** | | | | |');
  types.forEach(item => lines.push(generateTableRow(item)));
  lines.push('| | | | | |');
  
  // Utilities section
  lines.push('| **UTILITIES** | | | | |');
  utilities.forEach(item => lines.push(generateTableRow(item)));
  lines.push('| | | | | |');
  
  // Assets section
  lines.push('| **ASSETS** | | | | |');
  assets.forEach(item => lines.push(generateTableRow(item)));
  lines.push('');
  
  // Quality Metrics Summary
  lines.push('## Quality Metrics Summary');
  lines.push('');
  lines.push('### Documentation & Testing Coverage');
  lines.push('');
  lines.push('| Category | Total | With Stories | With Tests | With Both | With Neither |');
  lines.push('|----------|-------|--------------|------------|-----------|--------------|');
  lines.push(`| **Components** | ${stats.components.total} | ${stats.components.withStories} (${stats.components.storiesPercent}%) | ${stats.components.withTests} (${stats.components.testsPercent}%) | ${stats.components.withBoth} (${stats.components.bothPercent}%) | ${stats.components.withNeither} (${stats.components.neitherPercent}%) |`);
  lines.push(`| **Templates** | ${stats.templates.total} | ${stats.templates.withStories} (${stats.templates.storiesPercent}%) | ${stats.templates.withTests} (${stats.templates.testsPercent}%) | ${stats.templates.withBoth} (${stats.templates.bothPercent}%) | ${stats.templates.withNeither} (${stats.templates.neitherPercent}%) |`);
  lines.push(`| **Services/Hooks/Contexts** | ${stats.servicesHooksContexts.total} | ${stats.servicesHooksContexts.withStories} (${stats.servicesHooksContexts.storiesPercent}%) | ${stats.servicesHooksContexts.withTests} (${stats.servicesHooksContexts.testsPercent}%) | ${stats.servicesHooksContexts.withBoth} (${stats.servicesHooksContexts.bothPercent}%) | ${stats.servicesHooksContexts.withNeither} (${stats.servicesHooksContexts.neitherPercent}%) |`);
  lines.push(`| **Utilities/Types/Assets** | ${stats.utilitiesTypesAssets.total} | ${stats.utilitiesTypesAssets.withStories} (${stats.utilitiesTypesAssets.storiesPercent}%) | ${stats.utilitiesTypesAssets.withTests} (${stats.utilitiesTypesAssets.testsPercent}%) | ${stats.utilitiesTypesAssets.withBoth} (${stats.utilitiesTypesAssets.bothPercent}%) | ${stats.utilitiesTypesAssets.withNeither} (${stats.utilitiesTypesAssets.neitherPercent}%) |`);
  lines.push(`| **Project Total** | **${stats.total.total}** | **${stats.total.withStories} (${stats.total.storiesPercent}%)** | **${stats.total.withTests} (${stats.total.testsPercent}%)** | **${stats.total.withBoth} (${stats.total.bothPercent}%)** | **${stats.total.withNeither} (${stats.total.neitherPercent}%)** |`);
  lines.push('');
  lines.push('---');
  lines.push('');
  
  // Export Summary
  lines.push('### Export Summary');
  lines.push(`- **Public**: ${exportSummary.public.total} items (${exportSummary.public.components} components, ${exportSummary.public.templates} templates, ${exportSummary.public.services} services, ${exportSummary.public.hooks} hooks, ${exportSummary.public.contexts} contexts, ${exportSummary.public.assets} asset)`);
  lines.push(`- **Internal**: ${exportSummary.internal.total} items (${exportSummary.internal.components} components, ${exportSummary.internal.templates} templates, ${exportSummary.internal.services} services, ${exportSummary.internal.utilities} utilities, ${exportSummary.internal.types} types, ${exportSummary.internal.assets} asset)`);
  lines.push('');
  lines.push('---');
  lines.push('');
  
  // Footer
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  lines.push(`*Last updated: ${dateStr}*  `);
  lines.push('*Repository: [GetDKAN/cmsds-open-data-components](https://github.com/GetDKAN/cmsds-open-data-components)*');
  lines.push('');
  
  return lines.join('\n');
}

// Main execution
try {
  console.log('📝 Generating Components Inventory Report...\n');
  const report = generateReport();
  
  fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
  
  console.log(`\n✅ Report generated successfully!`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log(`📊 File size: ${(Buffer.byteLength(report, 'utf8') / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('❌ Error generating report:', error);
  process.exit(1);
}
