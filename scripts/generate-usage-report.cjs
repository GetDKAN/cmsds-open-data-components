#!/usr/bin/env node

/**
 * Component Usage Report Generator
 * 
 * Scans a project that uses cmsds-open-data-components as a dependency and generates
 * a comprehensive markdown usage report including:
 * - Which components, templates, services, hooks, and utilities are being used
 * - Where they are imported/used in the codebase
 * - Usage frequency and patterns
 * - Unused available components
 * 
 * This script should be run from the root of a project that depends on
 * @civicactions/cmsds-open-data-components
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_SCAN_DIRS = ['src', 'app', 'pages', 'components', 'templates'];
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const PACKAGE_NAME = '@civicactions/cmsds-open-data-components';

// Command line arguments
const args = process.argv.slice(2);
const outputFile = args[0] || 'COMPONENT_USAGE_REPORT.md';
const projectRoot = process.cwd();

/**
 * Get the list of public exports from the installed package
 */
function getAvailableComponents() {
  try {
    const packagePath = path.join(projectRoot, 'node_modules', PACKAGE_NAME);
    const indexPath = path.join(packagePath, 'dist', 'index.d.ts');
    
    if (!fs.existsSync(indexPath)) {
      // Fallback to package.json exports
      const pkgJsonPath = path.join(packagePath, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        return {
          version: pkgJson.version,
          exports: new Set()
        };
      }
      throw new Error('Could not find package index');
    }
    
    const content = fs.readFileSync(indexPath, 'utf8');
    const exports = new Set();
    
    // Match export declarations
    const exportMatches = content.matchAll(/export\s+(?:declare\s+)?(?:const|function|class|interface|type)\s+(\w+)/g);
    for (const match of exportMatches) {
      exports.add(match[1]);
    }
    
    // Match default exports
    const defaultMatches = content.matchAll(/export\s+\{\s*default\s+as\s+(\w+)\s*\}/g);
    for (const match of defaultMatches) {
      exports.add(match[1]);
    }
    
    // Get version
    const pkgJsonPath = path.join(packagePath, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    
    return {
      version: pkgJson.version,
      exports
    };
  } catch (error) {
    console.warn('⚠️  Could not read package exports, will detect from usage');
    return {
      version: 'unknown',
      exports: new Set()
    };
  }
}

/**
 * Recursively find all files with specified extensions in a directory
 */
function findFiles(dir, extensions, results = []) {
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules, .git, build directories
      if (entry.name === 'node_modules' || 
          entry.name === '.git' || 
          entry.name === 'build' || 
          entry.name === 'dist' ||
          entry.name === '.next' ||
          entry.name === 'coverage') {
        continue;
      }
      
      if (entry.isDirectory()) {
        findFiles(fullPath, extensions, results);
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return results;
}

/**
 * Parse a file for imports from cmsds-open-data-components
 */
function parseFileForImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    const getLineNumber = (index) => content.substring(0, index).split('\n').length;
    
    // Match named imports: import { Component1, Component2 } from 'package'
    const namedImportRegex = new RegExp(
      `import\\s+\\{([^}]+)\\}\\s+from\\s+['"]${PACKAGE_NAME}['"]`,
      'g'
    );
    
    for (const match of content.matchAll(namedImportRegex)) {
      const names = match[1]
        .split(',')
        .map(n => n.trim())
        .filter(n => n.length > 0);
      
      names.forEach(name => {
        imports.push({
          name,
          type: 'named',
          line: getLineNumber(match.index)
        });
      });
    }
    
    // Match default imports: import Component from 'package'
    const defaultImportRegex = new RegExp(
      `import\\s+(\\w+)\\s+from\\s+['"]${PACKAGE_NAME}['"]`,
      'g'
    );
    
    for (const match of content.matchAll(defaultImportRegex)) {
      imports.push({
        name: match[1],
        type: 'default',
        line: getLineNumber(match.index)
      });
    }
    
    return imports;
  } catch (error) {
    return [];
  }
}

/**
 * Scan the project for component usage
 */
function scanProjectForUsage() {
  console.log('🔍 Scanning project for component usage...');
  
  const usageMap = new Map();
  const scanDirs = DEFAULT_SCAN_DIRS
    .map(dir => path.join(projectRoot, dir))
    .filter(dir => fs.existsSync(dir));
  
  if (scanDirs.length === 0) {
    console.warn('⚠️  No standard source directories found. Scanning entire project...');
    scanDirs.push(projectRoot);
  }
  
  let filesScanned = 0;
  
  for (const scanDir of scanDirs) {
    const files = findFiles(scanDir, FILE_EXTENSIONS);
    filesScanned += files.length;
    
    for (const file of files) {
      const imports = parseFileForImports(file);
      
      if (imports.length > 0) {
        const relativePath = path.relative(projectRoot, file);
        
        for (const imp of imports) {
          if (!usageMap.has(imp.name)) {
            usageMap.set(imp.name, []);
          }
          
          usageMap.get(imp.name).push({
            file: relativePath,
            line: imp.line,
            type: imp.type
          });
        }
      }
    }
  }
  
  console.log(`   Scanned ${filesScanned} files`);
  console.log(`   Found ${usageMap.size} unique components in use`);
  
  return usageMap;
}

/**
 * Categorize components by type based on naming conventions
 */
function categorizeComponent(name) {
  if (name.startsWith('use')) return 'Hook';
  if (name.endsWith('Context') || name.endsWith('Provider')) return 'Context';
  if (name.endsWith('Page') || name.endsWith('Template')) return 'Template';
  if (name.includes('Service') || name.startsWith('fetch') || name.startsWith('get')) return 'Service';
  if (name.endsWith('Util') || name.endsWith('Helper')) return 'Utility';
  return 'Component';
}

/**
 * Generate markdown table row with GitHub link
 */
function generateUsageRow(name, usages, category) {
  const count = usages.length;
  const files = [...new Set(usages.map(u => u.file))];
  const fileList = files.map(f => `\`${f}\``).join('<br>');
  
  const githubPath = getGitHubPath(name, category);
  const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${githubPath}`;
  const nameLink = `[${name}](${githubUrl})`;
  
  return `| ${nameLink} | ${count} | ${fileList} |`;
}

/**
 * Determine GitHub path based on component category and name
 */
function getGitHubPath(name, category) {
  // Standard categories map directly to directories
  const categoryPaths = {
    'Component': `src/components/${name}`,
    'Hook': `src/components/${name}`,
    'Template': `src/templates/${name}`,
    'Service': `src/services/${name}`,
    'Utility': `src/utilities/${name}`
  };
  
  if (categoryPaths[category]) {
    return categoryPaths[category];
  }
  
  // Context locations vary, check by name
  if (category === 'Context') {
    if (name.includes('DataTable')) {
      return `src/components/DatasetTableTab/${name}.tsx`;
    }
    if (name === 'HeaderContext') {
      return `src/templates/Header/${name}.tsx`;
    }
    if (name === 'ACAContext') {
      return `src/utilities/${name}.ts`;
    }
    return `src/templates/Dataset/${name}.tsx`;
  }
  
  return `src/components/${name}`;
}

/**
 * Generate the usage report
 */
function generateReport(usageMap, availableComponents) {
  const lines = [];
  const projectInfo = getProjectInfo(availableComponents);
  
  // Header
  addReportHeader(lines, projectInfo);
  
  // Summary statistics
  addSummaryStatistics(lines, usageMap);
  
  // Categorize and add category breakdown
  const categorized = categorizeUsages(usageMap);
  addCategoryBreakdown(lines, categorized);
  
  // Detailed usage table
  addUsageTable(lines, usageMap);
  
  // Footer
  addReportFooter(lines);
  
  return lines.join('\n');
}

/**
 * Get project information
 */
function getProjectInfo(availableComponents) {
  const projectPkgPath = path.join(projectRoot, 'package.json');
  
  if (!fs.existsSync(projectPkgPath)) {
    return {
      name: 'Unknown Project',
      version: availableComponents.version
    };
  }
  
  const projectPkg = JSON.parse(fs.readFileSync(projectPkgPath, 'utf8'));
  const deps = { ...projectPkg.dependencies, ...projectPkg.devDependencies };
  
  return {
    name: projectPkg.name || path.basename(projectRoot),
    version: deps[PACKAGE_NAME] || availableComponents.version
  };
}

/**
 * Add report header section
 */
function addReportHeader(lines, projectInfo) {
  lines.push(`# ${projectInfo.name} Component Usage Report`);
  lines.push('');
  lines.push(`Analysis of \`${PACKAGE_NAME}\` usage in this project.`);
  lines.push('');
  lines.push(`**Library Version**: \`${PACKAGE_NAME}: ${projectInfo.version}\`  `);
  lines.push('');
  lines.push('---');
  lines.push('');
}

/**
 * Add summary statistics section
 */
function addSummaryStatistics(lines, usageMap) {
  const totalUsages = Array.from(usageMap.values()).reduce((sum, usages) => sum + usages.length, 0);
  const uniqueComponents = usageMap.size;
  const filesUsingComponents = new Set();
  
  usageMap.forEach(usages => {
    usages.forEach(usage => filesUsingComponents.add(usage.file));
  });
  
  lines.push('## Summary Statistics');
  lines.push('');
  lines.push(`- **Unique Components Used**: ${uniqueComponents}`);
  lines.push(`- **Total Import Statements**: ${totalUsages}`);
  lines.push(`- **Files Using Components**: ${filesUsingComponents.size}`);
  lines.push('');
}

/**
 * Categorize components by type
 */
function categorizeUsages(usageMap) {
  const categorized = new Map();
  
  usageMap.forEach((usages, name) => {
    const category = categorizeComponent(name);
    if (!categorized.has(category)) {
      categorized.set(category, []);
    }
    categorized.get(category).push({ name, usages });
  });
  
  return categorized;
}

/**
 * Add category breakdown section
 */
function addCategoryBreakdown(lines, categorized) {
  lines.push('### By Category');
  lines.push('');
  lines.push('| Category | Count |');
  lines.push('|----------|-------|');
  
  const categories = ['Component', 'Template', 'Hook', 'Context', 'Service', 'Utility'];
  categories.forEach(cat => {
    const count = categorized.get(cat)?.length || 0;
    if (count > 0) {
      lines.push(`| ${cat}s | ${count} |`);
    }
  });
  
  lines.push('');
  lines.push('---');
  lines.push('');
}

/**
 * Add detailed usage table section grouped by category
 */
function addUsageTable(lines, usageMap) {
  lines.push('## Component Usage Details');
  lines.push('');
  
  // Categorize all components
  const categorized = new Map();
  usageMap.forEach((usages, name) => {
    const category = categorizeComponent(name);
    if (!categorized.has(category)) {
      categorized.set(category, []);
    }
    categorized.get(category).push({ name, usages });
  });
  
  // Generate a table for each category
  const categories = ['Component', 'Template', 'Hook', 'Context', 'Service', 'Utility'];
  categories.forEach(category => {
    const items = categorized.get(category);
    if (!items || items.length === 0) return;
    
    // Sort by usage count within category
    items.sort((a, b) => b.usages.length - a.usages.length);
    
    // Category header
    lines.push(`### ${category}s`);
    lines.push('');
    
    // Table header
    lines.push('| Name | Count | Used In |');
    lines.push('|------|-------|---------|');
    
    // Table rows
    items.forEach(({ name, usages }) => {
      lines.push(generateUsageRow(name, usages, category));
    });
    
    lines.push('');
    lines.push('---');
    lines.push('');
  });
}

/**
 * Add report footer
 */
function addReportFooter(lines) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  lines.push(`*Last updated: ${dateStr}*  `);
  lines.push(`*Generated by ${PACKAGE_NAME} usage report tool*`);
  lines.push('');
}

/**
 * Check if running in the library repo itself
 */
function isLibraryRepo() {
  const pkgJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    return pkgJson.name === PACKAGE_NAME;
  }
  return false;
}

/**
 * Generate sample report for the library repo using Storybook files
 */
function generateSampleReport() {
  console.log('📚 Detected library repository - generating sample usage report...\n');
  
  const usageMap = scanStoryFiles();
  
  console.log(`   Found ${usageMap.size} unique components used in stories`);
  
  const pkgJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  const availableComponents = {
    version: pkgJson.version,
    exports: new Set()
  };
  
  const report = generateReport(usageMap, availableComponents);
  const sampleNote = createSampleNote();
  
  return sampleNote + report;
}

/**
 * Scan Storybook files for component usage
 */
function scanStoryFiles() {
  const usageMap = new Map();
  const srcPath = path.join(projectRoot, 'src');
  const storyFiles = findFiles(srcPath, ['.stories.js', '.stories.jsx', '.stories.ts', '.stories.tsx']);
  
  console.log(`   Found ${storyFiles.length} Storybook files to analyze`);
  
  storyFiles.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    const content = fs.readFileSync(file, 'utf8');
    
    extractLocalImports(content, relativePath, usageMap);
  });
  
  return usageMap;
}

/**
 * Extract local imports from file content
 */
function extractLocalImports(content, relativePath, usageMap) {
  const getLineNumber = (index) => content.substring(0, index).split('\n').length;
  
  // Match local imports like: import { Component } from './Component'
  const localImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]\.\//g;
  const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]\.\//g;
  
  for (const match of content.matchAll(localImportRegex)) {
    const names = match[1].split(',').map(n => n.trim()).filter(n => n.length > 0);
    names.forEach(name => {
      if (!usageMap.has(name)) {
        usageMap.set(name, []);
      }
      usageMap.get(name).push({
        file: relativePath,
        line: getLineNumber(match.index),
        type: 'named'
      });
    });
  }
  
  for (const match of content.matchAll(defaultImportRegex)) {
    const name = match[1];
    if (!usageMap.has(name)) {
      usageMap.set(name, []);
    }
    usageMap.get(name).push({
      file: relativePath,
      line: getLineNumber(match.index),
      type: 'default'
    });
  }
}

/**
 * Create sample note for library repo reports
 */
function createSampleNote() {
  return [
    '> **Note**: This is a sample usage report generated from the cmsds-open-data-components library repository.',
    '> It shows how components are used in Storybook files within this repository.',
    '> When run in a project that depends on this library, the report will show actual component usage.',
    '',
    '---',
    ''
  ].join('\n');
}

/**
 * Main execution
 */
function main() {
  console.log('📊 Generating Component Usage Report...\n');
  
  try {
    // Check if running in the library repo itself
    if (isLibraryRepo()) {
      const report = generateSampleReport();
      const outputPath = path.join(projectRoot, 'SAMPLE_' + outputFile);
      fs.writeFileSync(outputPath, report, 'utf8');
      
      console.log(`\n✅ Sample usage report generated successfully!`);
      console.log(`📄 Output: ${outputPath}`);
      console.log(`📊 File size: ${(Buffer.byteLength(report, 'utf8') / 1024).toFixed(2)} KB`);
      console.log(`\n💡 This sample report shows component usage in Storybook files.`);
      console.log(`   To see real usage, run this command in a project that depends on this library.`);
      return;
    }
    
    // Check if package is installed
    const packagePath = path.join(projectRoot, 'node_modules', PACKAGE_NAME);
    if (!fs.existsSync(packagePath)) {
      console.error(`❌ Error: ${PACKAGE_NAME} is not installed in this project`);
      console.error('   Make sure to run this from a project that depends on cmsds-open-data-components');
      process.exit(1);
    }
    
    // Get available components
    const availableComponents = getAvailableComponents();
    console.log(`   Library version: ${availableComponents.version}`);
    
    // Scan for usage
    const usageMap = scanProjectForUsage();
    
    if (usageMap.size === 0) {
      console.warn('⚠️  No component usage found in this project');
      console.warn('   Make sure you are running this from the correct directory');
      process.exit(0);
    }
    
    // Generate report
    const report = generateReport(usageMap, availableComponents);
    
    // Write to file
    const outputPath = path.join(projectRoot, outputFile);
    fs.writeFileSync(outputPath, report, 'utf8');
    
    console.log(`\n✅ Usage report generated successfully!`);
    console.log(`📄 Output: ${outputPath}`);
    console.log(`📊 File size: ${(Buffer.byteLength(report, 'utf8') / 1024).toFixed(2)} KB`);
    console.log(`📦 Components tracked: ${usageMap.size}`);
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, scanProjectForUsage, generateReport };
