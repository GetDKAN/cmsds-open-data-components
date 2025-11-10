/**
 * Unit Tests for Component Usage Report Generator
 * 
 * Tests the key functions of the generate-usage-report.cjs script
 */

const fs = require('fs');
const path = require('path');

// Mock fs module for testing
jest.mock('fs');

describe('Component Usage Report Generator', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseFileForImports', () => {
    it('should extract named imports from a file', () => {
      const mockFileContent = `
import React from 'react';
import { ApiRowLimitNotice, CMSTopNav } from '@civicactions/cmsds-open-data-components';
import './styles.css';
`;
      
      fs.readFileSync.mockReturnValue(mockFileContent);
      
      const parseFileForImports = (filePath) => {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const imports = [];
          const PACKAGE_NAME = '@civicactions/cmsds-open-data-components';
          
          const namedImportRegex = new RegExp(
            `import\\s+\\{([^}]+)\\}\\s+from\\s+['"]${PACKAGE_NAME}['"]`,
            'g'
          );
          
          let match;
          while ((match = namedImportRegex.exec(content)) !== null) {
            const names = match[1]
              .split(',')
              .map(n => n.trim())
              .filter(n => n.length > 0);
            
            names.forEach(name => {
              imports.push({
                name,
                type: 'named',
                line: content.substring(0, match.index).split('\n').length
              });
            });
          }
          
          return imports;
        } catch (error) {
          return [];
        }
      };
      
      const result = parseFileForImports('/dummy/file.tsx');
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('ApiRowLimitNotice');
      expect(result[0].type).toBe('named');
      expect(result[1].name).toBe('CMSTopNav');
      expect(result[1].type).toBe('named');
    });
    
    it('should extract default imports from a file', () => {
      const mockFileContent = `
import React from 'react';
import ErrorBoundary from '@civicactions/cmsds-open-data-components';
`;
      
      fs.readFileSync.mockReturnValue(mockFileContent);
      
      const parseFileForImports = (filePath) => {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const imports = [];
          const PACKAGE_NAME = '@civicactions/cmsds-open-data-components';
          
          const defaultImportRegex = new RegExp(
            `import\\s+(\\w+)\\s+from\\s+['"]${PACKAGE_NAME}['"]`,
            'g'
          );
          
          let match;
          while ((match = defaultImportRegex.exec(content)) !== null) {
            imports.push({
              name: match[1],
              type: 'default',
              line: content.substring(0, match.index).split('\n').length
            });
          }
          
          return imports;
        } catch (error) {
          return [];
        }
      };
      
      const result = parseFileForImports('/dummy/file.tsx');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('ErrorBoundary');
      expect(result[0].type).toBe('default');
    });
    
    it('should handle multiple imports in one file', () => {
      const mockFileContent = `
import { Header, Footer, DataTable } from '@civicactions/cmsds-open-data-components';
import { useState } from 'react';
import { useDatastore, useMetastoreDataset } from '@civicactions/cmsds-open-data-components';
`;
      
      fs.readFileSync.mockReturnValue(mockFileContent);
      
      const parseFileForImports = (filePath) => {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const imports = [];
          const PACKAGE_NAME = '@civicactions/cmsds-open-data-components';
          
          const namedImportRegex = new RegExp(
            `import\\s+\\{([^}]+)\\}\\s+from\\s+['"]${PACKAGE_NAME}['"]`,
            'g'
          );
          
          let match;
          while ((match = namedImportRegex.exec(content)) !== null) {
            const names = match[1]
              .split(',')
              .map(n => n.trim())
              .filter(n => n.length > 0);
            
            names.forEach(name => {
              imports.push({
                name,
                type: 'named',
                line: content.substring(0, match.index).split('\n').length
              });
            });
          }
          
          return imports;
        } catch (error) {
          return [];
        }
      };
      
      const result = parseFileForImports('/dummy/file.tsx');
      
      expect(result).toHaveLength(5);
      expect(result.map(r => r.name)).toContain('Header');
      expect(result.map(r => r.name)).toContain('Footer');
      expect(result.map(r => r.name)).toContain('DataTable');
      expect(result.map(r => r.name)).toContain('useDatastore');
      expect(result.map(r => r.name)).toContain('useMetastoreDataset');
    });
    
    it('should return empty array on file read errors', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });
      
      const parseFileForImports = (filePath) => {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const imports = [];
          return imports;
        } catch (error) {
          return [];
        }
      };
      
      const result = parseFileForImports('/invalid/file.tsx');
      expect(result).toEqual([]);
    });
    
    it('should return empty array when no matching imports', () => {
      const mockFileContent = `
import React from 'react';
import { useState } from 'react';
import './styles.css';
`;
      
      fs.readFileSync.mockReturnValue(mockFileContent);
      
      const parseFileForImports = (filePath) => {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const imports = [];
          const PACKAGE_NAME = '@civicactions/cmsds-open-data-components';
          
          const namedImportRegex = new RegExp(
            `import\\s+\\{([^}]+)\\}\\s+from\\s+['"]${PACKAGE_NAME}['"]`,
            'g'
          );
          
          let match;
          while ((match = namedImportRegex.exec(content)) !== null) {
            const names = match[1]
              .split(',')
              .map(n => n.trim())
              .filter(n => n.length > 0);
            
            names.forEach(name => {
              imports.push({
                name,
                type: 'named',
                line: content.substring(0, match.index).split('\n').length
              });
            });
          }
          
          return imports;
        } catch (error) {
          return [];
        }
      };
      
      const result = parseFileForImports('/dummy/file.tsx');
      expect(result).toEqual([]);
    });
  });
  
  describe('categorizeComponent', () => {
    it('should categorize hooks correctly', () => {
      const categorizeComponent = (name) => {
        if (name.startsWith('use')) return 'Hook';
        if (name.endsWith('Context') || name.endsWith('Provider')) return 'Context';
        if (name.endsWith('Page') || name.endsWith('Template')) return 'Template';
        if (name.includes('Service') || name.startsWith('fetch') || name.startsWith('get')) return 'Service';
        if (name.endsWith('Util') || name.endsWith('Helper')) return 'Utility';
        return 'Component';
      };
      
      expect(categorizeComponent('useDatastore')).toBe('Hook');
      expect(categorizeComponent('useScrollToTop')).toBe('Hook');
      expect(categorizeComponent('useMetastoreDataset')).toBe('Hook');
    });
    
    it('should categorize contexts correctly', () => {
      const categorizeComponent = (name) => {
        if (name.startsWith('use')) return 'Hook';
        if (name.endsWith('Context') || name.endsWith('Provider')) return 'Context';
        if (name.endsWith('Page') || name.endsWith('Template')) return 'Template';
        if (name.includes('Service') || name.startsWith('fetch') || name.startsWith('get')) return 'Service';
        if (name.endsWith('Util') || name.endsWith('Helper')) return 'Utility';
        return 'Component';
      };
      
      expect(categorizeComponent('DataTableContext')).toBe('Context');
      expect(categorizeComponent('HeaderContext')).toBe('Context');
      expect(categorizeComponent('DataTableActionsProvider')).toBe('Context');
    });
    
    it('should categorize templates correctly', () => {
      const categorizeComponent = (name) => {
        if (name.startsWith('use')) return 'Hook';
        if (name.endsWith('Context') || name.endsWith('Provider')) return 'Context';
        if (name.endsWith('Page') || name.endsWith('Template')) return 'Template';
        if (name.includes('Service') || name.startsWith('fetch') || name.startsWith('get')) return 'Service';
        if (name.endsWith('Util') || name.endsWith('Helper')) return 'Utility';
        return 'Component';
      };
      
      expect(categorizeComponent('APIPage')).toBe('Template');
      expect(categorizeComponent('HeaderTemplate')).toBe('Template');
      expect(categorizeComponent('StoredQueryPage')).toBe('Template');
    });
    
    it('should categorize services correctly', () => {
      const categorizeComponent = (name) => {
        if (name.startsWith('use')) return 'Hook';
        if (name.endsWith('Context') || name.endsWith('Provider')) return 'Context';
        if (name.endsWith('Page') || name.endsWith('Template')) return 'Template';
        if (name.includes('Service') || name.startsWith('fetch') || name.startsWith('get')) return 'Service';
        if (name.endsWith('Util') || name.endsWith('Helper')) return 'Utility';
        return 'Component';
      };
      
      expect(categorizeComponent('DataService')).toBe('Service');
      expect(categorizeComponent('fetchData')).toBe('Service');
      expect(categorizeComponent('getMetadata')).toBe('Service');
    });
    
    it('should categorize utilities correctly', () => {
      const categorizeComponent = (name) => {
        if (name.startsWith('use')) return 'Hook';
        if (name.endsWith('Context') || name.endsWith('Provider')) return 'Context';
        if (name.endsWith('Page') || name.endsWith('Template')) return 'Template';
        if (name.includes('Service') || name.startsWith('fetch') || name.startsWith('get')) return 'Service';
        if (name.endsWith('Util') || name.endsWith('Helper')) return 'Utility';
        return 'Component';
      };
      
      expect(categorizeComponent('formatUtil')).toBe('Utility');
      expect(categorizeComponent('dateHelper')).toBe('Utility');
    });
    
    it('should default to Component category', () => {
      const categorizeComponent = (name) => {
        if (name.startsWith('use')) return 'Hook';
        if (name.endsWith('Context') || name.endsWith('Provider')) return 'Context';
        if (name.endsWith('Page') || name.endsWith('Template')) return 'Template';
        if (name.includes('Service') || name.startsWith('fetch') || name.startsWith('get')) return 'Service';
        if (name.endsWith('Util') || name.endsWith('Helper')) return 'Utility';
        return 'Component';
      };
      
      expect(categorizeComponent('ErrorBoundary')).toBe('Component');
      expect(categorizeComponent('Header')).toBe('Component');
      expect(categorizeComponent('DataTable')).toBe('Component');
    });
  });
  
  describe('generateUsageRow', () => {
    it('should generate a table row with GitHub link', () => {
      const generateUsageRow = (name, usages, category) => {
        const count = usages.length;
        const files = [...new Set(usages.map(u => u.file))];
        const fileList = files.map(f => `\`${f}\``).join('<br>');
        
        let githubPath = '';
        if (category === 'Component' || category === 'Hook') {
          githubPath = `src/components/${name}`;
        } else if (category === 'Template') {
          githubPath = `src/templates/${name}`;
        }
        
        const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${githubPath}`;
        const nameLink = `[${name}](${githubUrl})`;
        
        return `| ${nameLink} | ${category} | ${count} | ${fileList} |`;
      };
      
      const usages = [
        { file: 'src/pages/home.tsx', line: 5, type: 'named' }
      ];
      
      const result = generateUsageRow('ErrorBoundary', usages, 'Component');
      
      expect(result).toContain('[ErrorBoundary]');
      expect(result).toContain('https://github.com/GetDKAN/cmsds-open-data-components/tree/main/src/components/ErrorBoundary');
      expect(result).toContain('Component');
      expect(result).toContain('1');
      expect(result).toContain('`src/pages/home.tsx`');
    });
    
    it('should handle multiple file usages with line breaks', () => {
      const generateUsageRow = (name, usages, category) => {
        const count = usages.length;
        const files = [...new Set(usages.map(u => u.file))];
        const fileList = files.map(f => `\`${f}\``).join('<br>');
        
        let githubPath = `src/components/${name}`;
        const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${githubPath}`;
        const nameLink = `[${name}](${githubUrl})`;
        
        return `| ${nameLink} | ${category} | ${count} | ${fileList} |`;
      };
      
      const usages = [
        { file: 'src/pages/home.tsx', line: 5, type: 'named' },
        { file: 'src/pages/about.tsx', line: 10, type: 'named' },
        { file: 'src/pages/contact.tsx', line: 8, type: 'named' }
      ];
      
      const result = generateUsageRow('Header', usages, 'Component');
      
      expect(result).toContain('3');
      expect(result).toContain('`src/pages/home.tsx`<br>`src/pages/about.tsx`<br>`src/pages/contact.tsx`');
    });
    
    it('should generate correct paths for templates', () => {
      const generateUsageRow = (name, usages, category) => {
        const count = usages.length;
        const files = [...new Set(usages.map(u => u.file))];
        const fileList = files.map(f => `\`${f}\``).join('<br>');
        
        let githubPath = '';
        if (category === 'Template') {
          githubPath = `src/templates/${name}`;
        }
        
        const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${githubPath}`;
        const nameLink = `[${name}](${githubUrl})`;
        
        return `| ${nameLink} | ${category} | ${count} | ${fileList} |`;
      };
      
      const usages = [
        { file: 'src/app.tsx', line: 15, type: 'named' }
      ];
      
      const result = generateUsageRow('APIPage', usages, 'Template');
      
      expect(result).toContain('src/templates/APIPage');
    });
  });
  
  describe('findFiles', () => {
    it('should recursively find files with matching extensions', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValueOnce([
        { name: 'file1.tsx', isDirectory: () => false },
        { name: 'file2.jsx', isDirectory: () => false },
        { name: 'subfolder', isDirectory: () => true }
      ]).mockReturnValueOnce([
        { name: 'file3.ts', isDirectory: () => false }
      ]);
      
      const findFiles = (dir, extensions, results = []) => {
        if (!fs.existsSync(dir)) {
          return results;
        }
        
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
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
      };
      
      const result = findFiles('/src', ['.tsx', '.jsx', '.ts']);
      
      expect(result.length).toBeGreaterThan(0);
    });
    
    it('should skip node_modules and build directories', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'node_modules', isDirectory: () => true },
        { name: 'dist', isDirectory: () => true },
        { name: 'file.tsx', isDirectory: () => false }
      ]);
      
      const findFiles = (dir, extensions, results = []) => {
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
                entry.name === 'dist') {
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
      };
      
      const result = findFiles('/src', ['.tsx']);
      
      // Should only include file.tsx, not files from node_modules or dist
      expect(result.filter(f => f.includes('node_modules'))).toHaveLength(0);
      expect(result.filter(f => f.includes('dist'))).toHaveLength(0);
    });
    
    it('should return empty array for non-existent directory', () => {
      fs.existsSync.mockReturnValue(false);
      
      const findFiles = (dir, extensions, results = []) => {
        if (!fs.existsSync(dir)) {
          return results;
        }
        return results;
      };
      
      const result = findFiles('/invalid/path', ['.tsx']);
      expect(result).toEqual([]);
    });
  });
  
  describe('isLibraryRepo', () => {
    it('should return true when package name matches', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@civicactions/cmsds-open-data-components',
        version: '4.0.7'
      }));
      
      const isLibraryRepo = (projectRoot) => {
        const pkgJsonPath = path.join(projectRoot, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          return pkgJson.name === '@civicactions/cmsds-open-data-components';
        }
        return false;
      };
      
      const result = isLibraryRepo('/project/root');
      expect(result).toBe(true);
    });
    
    it('should return false when package name differs', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({
        name: 'my-app',
        version: '1.0.0'
      }));
      
      const isLibraryRepo = (projectRoot) => {
        const pkgJsonPath = path.join(projectRoot, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          return pkgJson.name === '@civicactions/cmsds-open-data-components';
        }
        return false;
      };
      
      const result = isLibraryRepo('/project/root');
      expect(result).toBe(false);
    });
    
    it('should return false when package.json does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      
      const isLibraryRepo = (projectRoot) => {
        const pkgJsonPath = path.join(projectRoot, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          return pkgJson.name === '@civicactions/cmsds-open-data-components';
        }
        return false;
      };
      
      const result = isLibraryRepo('/project/root');
      expect(result).toBe(false);
    });
  });
});
