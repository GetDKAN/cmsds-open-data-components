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

// File pattern constants
const STORY_FILE_PATTERNS = ['.stories.js', '.stories.jsx', '.stories.ts', '.stories.tsx'];
const TEST_FILE_PATTERNS = ['.test.', '.spec.'];
const TS_EXTENSIONS = ['.ts', '.tsx'];

// Special case mappings for components with non-standard exports
const EXPORT_SPECIAL_CASES = {
  'DatasetAdditionalInformation': { exportName: 'buildRows', note: ' (buildRows)' },
  'DatasetTableTab': { exportName: 'DatasetTable', note: ' (as DatasetTable)' },
  'Datatable': { exportName: 'DataTable', note: '' }
};

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
      STORY_FILE_PATTERNS.some(pattern => file.endsWith(pattern))
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
      TEST_FILE_PATTERNS.some(pattern => file.includes(pattern))
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

/**
 * Checks if a component name is publicly exported
 * Handles special cases where export name differs from component name
 * @returns {Object} { isPublic: boolean, note: string }
 */
function isPublicComponent(name, publicExports) {
  // Check direct match
  if (publicExports.has(name)) {
    return { isPublic: true, note: '' };
  }
  
  // Check plural form
  if (publicExports.has(name + 's')) {
    return { isPublic: true, note: '' };
  }
  
  // Check special cases
  const specialCase = EXPORT_SPECIAL_CASES[name];
  if (specialCase && publicExports.has(specialCase.exportName)) {
    return { isPublic: true, note: specialCase.note };
  }
  
  return { isPublic: false, note: '' };
}

/**
 * Creates a standardized inventory item object
 */
function createInventoryItem(type, name, relativePath, isPublic, exportNote = '', hasStoryVal = null, hasTestsVal = null) {
  return {
    type,
    name,
    path: relativePath,
    isPublic,
    exportNote,
    hasStory: hasStoryVal ?? false,
    hasTests: hasTestsVal ?? false
  };
}

// Scan components directory
function scanComponents(publicExports) {
  const componentsDir = path.join(SRC_DIR, 'components');
  const componentDirs = getDirectories(componentsDir);
  
  return componentDirs.map(name => {
    const dirPath = path.join(componentsDir, name);
    const { isPublic, note } = isPublicComponent(name, publicExports);
    
    return createInventoryItem(
      'Component',
      name,
      `src/components/${name}`,
      isPublic,
      note,
      hasStory(dirPath),
      hasTests(dirPath)
    );
  });
}

// Scan templates directory
function scanTemplates(publicExports) {
  const templatesDir = path.join(SRC_DIR, 'templates');
  const templateDirs = getDirectories(templatesDir);
  
  return templateDirs.map(name => {
    const dirPath = path.join(templatesDir, name);
    
    return createInventoryItem(
      'Template',
      name,
      `src/templates/${name}`,
      publicExports.has(name),
      '',
      hasStory(dirPath),
      hasTests(dirPath)
    );
  });
}

// Scan services directory
function scanServices(publicExports) {
  const servicesDir = path.join(SRC_DIR, 'services');
  const serviceDirs = getDirectories(servicesDir);
  
  return serviceDirs.map(name => {
    const dirPath = path.join(servicesDir, name);
    
    return createInventoryItem(
      'Service',
      name,
      `src/services/${name}`,
      publicExports.has(name),
      '',
      false, // Services don't have stories
      hasTests(dirPath)
    );
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
      items.push(createInventoryItem(
        'Utility',
        file.name,
        `src/utilities/${file.name}`,
        publicExports.has(file.name),
        '',
        false,
        hasTests(dirPath)
      ));
    } else if (TS_EXTENSIONS.some(ext => file.name.endsWith(ext))) {
      const name = file.name.replace(/\.(ts|tsx)$/, '');
      if (name !== 'index') {
        const isPublic = publicExports.has(name) || (publicExports.has('acaToParams') && name === 'aca');
        const exportNote = name === 'aca' ? ' (acaToParams)' : '';
        
        items.push(createInventoryItem(
          'Utility',
          name,
          `src/utilities/${file.name}`,
          isPublic,
          exportNote,
          false,
          false
        ));
      }
    }
  });
  
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

// Scan types directory
function scanTypes() {
  const typesDir = path.join(SRC_DIR, 'types');
  const files = fs.readdirSync(typesDir).filter(f => f.endsWith('.ts'));
  
  return files.map(file => 
    createInventoryItem(
      'Type Definition',
      file,
      `src/types/${file}`,
      false, // Type definitions are generally internal
      '',
      false,
      false
    )
  );
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
    
    return createInventoryItem(
      'Asset',
      name,
      `src/assets/${file}`,
      isPublic,
      isCommented ? ' (commented out)' : '',
      false,
      false
    );
  });
}

/**
 * Scans for React hooks (functions starting with 'use') and Context providers
 * Searches in components, templates, and utilities directories
 */
function getHooksAndContexts(publicExports) {
  const items = [];
  
  // Helper to check if a file exports a hook or context
  const scanFileForHooksAndContexts = (filePath, relativePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, path.extname(filePath));
      
      // Skip test and story files
      if (fileName.includes('.test') || fileName.includes('.spec') || fileName.includes('.stories')) {
        return null;
      }
      
      // Check if it's a hook (starts with 'use')
      if (fileName.startsWith('use')) {
        const isPublic = publicExports.has(fileName);
        return {
          type: 'Hook',
          name: fileName,
          path: relativePath,
          isPublic
        };
      }
      
      // Check if it's a Context (file name ends with 'Context' and contains createContext)
      if (fileName.endsWith('Context') && content.includes('createContext')) {
        // Try to extract the exported context name or provider name from the file
        // Look for: export default Name or export const Name
        const exportDefaultMatch = content.match(/export\s+default\s+(\w+)/);
        const exportConstMatch = content.match(/export\s+const\s+(\w*(?:Context|Provider)\w*)/);
        const name = exportDefaultMatch?.[1] || exportConstMatch?.[1] || fileName;
        
        // Check if public by exported name or file name
        const isPublic = publicExports.has(name) || publicExports.has(fileName);
        
        return {
          type: 'Context',
          name: name,
          path: relativePath,
          isPublic
        };
      }
    } catch (e) {
      // Skip files that can't be read
    }
    
    return null;
  };
  
  // Scan components directory for hooks
  const componentsDir = path.join(SRC_DIR, 'components');
  const componentDirs = getDirectories(componentsDir);
  
  componentDirs.forEach(dirName => {
    const dirPath = path.join(componentsDir, dirName);
    
    // Check if directory itself is a hook (starts with 'use')
    if (dirName.startsWith('use')) {
      const isPublic = publicExports.has(dirName);
      items.push(createInventoryItem(
        'Hook',
        dirName,
        `src/components/${dirName}`,
        isPublic,
        '',
        false,
        false
      ));
    }
    
    // Check files in the directory for contexts
    try {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        if (TS_EXTENSIONS.some(ext => file.endsWith(ext))) {
          const filePath = path.join(dirPath, file);
          const relativePath = `src/components/${dirName}/${file}`;
          const result = scanFileForHooksAndContexts(filePath, relativePath);
          if (result && result.type === 'Context') {
            items.push(createInventoryItem(
              result.type,
              result.name,
              result.path,
              result.isPublic,
              '',
              false,
              false
            ));
          }
        }
      });
    } catch (e) {
      // Skip if directory can't be read
    }
  });
  
  // Scan templates directory for contexts
  const templatesDir = path.join(SRC_DIR, 'templates');
  const templateDirs = getDirectories(templatesDir);
  
  templateDirs.forEach(dirName => {
    const dirPath = path.join(templatesDir, dirName);
    
    try {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        if (TS_EXTENSIONS.some(ext => file.endsWith(ext))) {
          const filePath = path.join(dirPath, file);
          const relativePath = `src/templates/${dirName}/${file}`;
          const result = scanFileForHooksAndContexts(filePath, relativePath);
          if (result) {
            items.push(createInventoryItem(
              result.type,
              result.name,
              result.path,
              result.isPublic,
              '',
              false,
              false
            ));
          }
        }
      });
    } catch (e) {
      // Skip if directory can't be read
    }
  });
  
  // Scan utilities directory for contexts
  const utilitiesDir = path.join(SRC_DIR, 'utilities');
  
  try {
    const files = fs.readdirSync(utilitiesDir);
    files.forEach(file => {
      if (TS_EXTENSIONS.some(ext => file.endsWith(ext))) {
        const filePath = path.join(utilitiesDir, file);
        const relativePath = `src/utilities/${file}`;
        const result = scanFileForHooksAndContexts(filePath, relativePath);
        if (result) {
          items.push(createInventoryItem(
            result.type,
            result.name,
            result.path,
            result.isPublic,
            '',
            false,
            false
          ));
        }
      }
    });
  } catch (e) {
    // Skip if directory can't be read
  }
  
  return items;
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

/**
 * Generates markdown table section for a category
 */
function generateTableSection(title, items) {
  const lines = [];
  lines.push(`| **${title}** | | | | |`);
  items.forEach(item => lines.push(generateTableRow(item)));
  lines.push('| | | | | |');
  return lines;
}

/**
 * Generates the inventory table header
 */
function generateInventoryTableHeader() {
  return [
    '## Inventory Table',
    '',
    '| Type | Name | Public Export | Storybook Status | Unit Tests |',
    '|------|------|---------------|------------------|------------|'
  ];
}

/**
 * Generates the quality metrics table
 */
function generateQualityMetricsSection(stats) {
  const lines = [];
  lines.push('## Quality Metrics Summary');
  lines.push('');
  lines.push('### Documentation & Testing Coverage');
  lines.push('');
  lines.push('| Category | Total | With Stories | With Tests | With Both | With Neither |');
  lines.push('|----------|-------|--------------|------------|-----------|--------------|');
  
  const addRow = (label, stat) => {
    const bold = label === 'Project Total' ? '**' : '';
    lines.push(`| ${bold}${label}${bold} | ${bold}${stat.total}${bold} | ${bold}${stat.withStories} (${stat.storiesPercent}%)${bold} | ${bold}${stat.withTests} (${stat.testsPercent}%)${bold} | ${bold}${stat.withBoth} (${stat.bothPercent}%)${bold} | ${bold}${stat.withNeither} (${stat.neitherPercent}%)${bold} |`);
  };
  
  addRow('Components', stats.components);
  addRow('Templates', stats.templates);
  addRow('Services/Hooks/Contexts', stats.servicesHooksContexts);
  addRow('Utilities/Types/Assets', stats.utilitiesTypesAssets);
  addRow('Project Total', stats.total);
  
  lines.push('');
  lines.push('---');
  lines.push('');
  
  return lines;
}

/**
 * Generates the export summary section
 */
function generateExportSummarySection(exportSummary) {
  const lines = [];
  lines.push('### Export Summary');
  
  const pub = exportSummary.public;
  lines.push(`- **Public**: ${pub.total} items (${pub.components} components, ${pub.templates} templates, ${pub.services} services, ${pub.hooks} hooks, ${pub.contexts} contexts, ${pub.assets} asset)`);
  
  const intern = exportSummary.internal;
  lines.push(`- **Internal**: ${intern.total} items (${intern.components} components, ${intern.templates} templates, ${intern.services} services, ${intern.utilities} utilities, ${intern.types} types, ${intern.assets} asset)`);
  
  lines.push('');
  lines.push('---');
  lines.push('');
  
  return lines;
}

/**
 * Generates the document footer
 */
function generateFooter() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return [
    `*Last updated: ${dateStr}*  `,
    '*Repository: [GetDKAN/cmsds-open-data-components](https://github.com/GetDKAN/cmsds-open-data-components)*',
    ''
  ];
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
  
  // Generate markdown sections
  const lines = [];
  
  // Header
  lines.push('# CMSDS Open Data Components Inventory');
  lines.push('');
  lines.push('This document provides a comprehensive inventory of all components, services, templates, types, and utilities available in the cmsds-open-data-components project. Each item is categorized by type and includes information about whether it is publicly exported or internal-only, has Storybook stories, and has unit tests.');
  lines.push('');
  
  // Inventory table
  lines.push(...generateInventoryTableHeader());
  lines.push(...generateTableSection('COMPONENTS', components));
  lines.push(...generateTableSection('HOOKS & CONTEXTS', hooksAndContexts));
  lines.push(...generateTableSection('SERVICES', services));
  lines.push(...generateTableSection('TEMPLATES', templates));
  lines.push(...generateTableSection('TYPES', types));
  lines.push(...generateTableSection('UTILITIES', utilities));
  lines.push(...generateTableSection('ASSETS', assets));
  lines.push('');
  
  // Quality metrics
  lines.push(...generateQualityMetricsSection(stats));
  
  // Export summary
  lines.push(...generateExportSummarySection(exportSummary));
  
  // Footer
  lines.push(...generateFooter());
  
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
