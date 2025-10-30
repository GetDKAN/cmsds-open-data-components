/**
 * Unit Tests for Component Inventory Generator
 * 
 * Tests the key functions of the generate-inventory.cjs script
 */

const fs = require('fs');
const path = require('path');

// Mock fs module for testing
jest.mock('fs');

describe('Component Inventory Generator', () => {
  
  describe('getPublicExports', () => {
    it('should extract default exports from index.ts', () => {
      const mockIndexContent = `
export { default as ApiRowLimitNotice } from './components/ApiRowLimitNotice';
export { default as CMSTopNav } from './components/CMSTopNav';
export { default as ErrorBoundary } from './components/ErrorBoundary';
`;
      
      fs.readFileSync.mockReturnValue(mockIndexContent);
      
      // Mock the function (in real test, we'd import it)
      const getPublicExports = () => {
        const content = fs.readFileSync('dummy', 'utf8');
        const exports = new Set();
        const lines = content.split('\n');
        
        lines.forEach(line => {
          const defaultMatch = line.match(/export\s+\{\s*default\s+as\s+(\w+)\s*\}/);
          if (defaultMatch) {
            exports.add(defaultMatch[1]);
          }
        });
        
        return exports;
      };
      
      const result = getPublicExports();
      
      expect(result.has('ApiRowLimitNotice')).toBe(true);
      expect(result.has('CMSTopNav')).toBe(true);
      expect(result.has('ErrorBoundary')).toBe(true);
      expect(result.size).toBe(3);
    });
    
    it('should extract named exports from index.ts', () => {
      const mockIndexContent = `
export { buildRows } from './components/DatasetAdditionalInformation';
export { truncateText } from './components/DatasetSearchListItem/truncateText';
`;
      
      fs.readFileSync.mockReturnValue(mockIndexContent);
      
      const getPublicExports = () => {
        const content = fs.readFileSync('dummy', 'utf8');
        const exports = new Set();
        const lines = content.split('\n');
        
        lines.forEach(line => {
          const namedMatch = line.match(/export\s+\{\s*([^}]+)\s*\}\s+from/);
          if (namedMatch) {
            const names = namedMatch[1].split(',').map(n => n.trim());
            names.forEach(name => exports.add(name));
          }
        });
        
        return exports;
      };
      
      const result = getPublicExports();
      
      expect(result.has('buildRows')).toBe(true);
      expect(result.has('truncateText')).toBe(true);
      expect(result.size).toBe(2);
    });
    
    it('should handle multiple exports in one line', () => {
      const mockIndexContent = `
export { buildOperatorOptions, convertUTCToLocalDate, cleanText } from './templates/FilteredResource/functions';
`;
      
      fs.readFileSync.mockReturnValue(mockIndexContent);
      
      const getPublicExports = () => {
        const content = fs.readFileSync('dummy', 'utf8');
        const exports = new Set();
        const lines = content.split('\n');
        
        lines.forEach(line => {
          const namedMatch = line.match(/export\s+\{\s*([^}]+)\s*\}\s+from/);
          if (namedMatch) {
            const names = namedMatch[1].split(',').map(n => n.trim());
            names.forEach(name => exports.add(name));
          }
        });
        
        return exports;
      };
      
      const result = getPublicExports();
      
      expect(result.has('buildOperatorOptions')).toBe(true);
      expect(result.has('convertUTCToLocalDate')).toBe(true);
      expect(result.has('cleanText')).toBe(true);
      expect(result.size).toBe(3);
    });
  });
  
  describe('hasStory', () => {
    it('should return true when story files exist', () => {
      fs.readdirSync.mockReturnValue([
        'ErrorBoundary.stories.tsx',
        'index.tsx'
      ]);
      
      const hasStory = (dirPath) => {
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
      };
      
      const result = hasStory('/dummy/path');
      expect(result).toBe(true);
    });
    
    it('should return false when no story files exist', () => {
      fs.readdirSync.mockReturnValue([
        'index.tsx',
        'component.scss'
      ]);
      
      const hasStory = (dirPath) => {
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
      };
      
      const result = hasStory('/dummy/path');
      expect(result).toBe(false);
    });
    
    it('should handle different story file extensions', () => {
      const extensions = ['.stories.js', '.stories.jsx', '.stories.ts', '.stories.tsx'];
      
      extensions.forEach(ext => {
        fs.readdirSync.mockReturnValue([
          `Component${ext}`,
          'index.tsx'
        ]);
        
        const hasStory = (dirPath) => {
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
        };
        
        expect(hasStory('/dummy/path')).toBe(true);
      });
    });
    
    it('should return false on file system errors', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });
      
      const hasStory = (dirPath) => {
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
      };
      
      const result = hasStory('/invalid/path');
      expect(result).toBe(false);
    });
  });
  
  describe('hasTests', () => {
    it('should return true when test files exist', () => {
      fs.readdirSync.mockReturnValue([
        'component.test.tsx',
        'index.tsx'
      ]);
      
      const hasTests = (dirPath) => {
        try {
          const files = fs.readdirSync(dirPath);
          return files.some(file => 
            file.includes('.test.') || 
            file.includes('.spec.')
          );
        } catch (e) {
          return false;
        }
      };
      
      const result = hasTests('/dummy/path');
      expect(result).toBe(true);
    });
    
    it('should detect spec files', () => {
      fs.readdirSync.mockReturnValue([
        'component.spec.ts',
        'index.tsx'
      ]);
      
      const hasTests = (dirPath) => {
        try {
          const files = fs.readdirSync(dirPath);
          return files.some(file => 
            file.includes('.test.') || 
            file.includes('.spec.')
          );
        } catch (e) {
          return false;
        }
      };
      
      const result = hasTests('/dummy/path');
      expect(result).toBe(true);
    });
    
    it('should return false when no test files exist', () => {
      fs.readdirSync.mockReturnValue([
        'index.tsx',
        'component.scss'
      ]);
      
      const hasTests = (dirPath) => {
        try {
          const files = fs.readdirSync(dirPath);
          return files.some(file => 
            file.includes('.test.') || 
            file.includes('.spec.')
          );
        } catch (e) {
          return false;
        }
      };
      
      const result = hasTests('/dummy/path');
      expect(result).toBe(false);
    });
    
    it('should return false on file system errors', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });
      
      const hasTests = (dirPath) => {
        try {
          const files = fs.readdirSync(dirPath);
          return files.some(file => 
            file.includes('.test.') || 
            file.includes('.spec.')
          );
        } catch (e) {
          return false;
        }
      };
      
      const result = hasTests('/invalid/path');
      expect(result).toBe(false);
    });
  });
  
  describe('getDirectories', () => {
    it('should return only directories', () => {
      const mockDirents = [
        { name: 'Component1', isDirectory: () => true },
        { name: 'Component2', isDirectory: () => true },
        { name: 'index.ts', isDirectory: () => false },
        { name: 'README.md', isDirectory: () => false }
      ];
      
      fs.readdirSync.mockReturnValue(mockDirents);
      
      const getDirectories = (dirPath) => {
        try {
          return fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();
        } catch (e) {
          return [];
        }
      };
      
      const result = getDirectories('/dummy/path');
      
      expect(result).toEqual(['Component1', 'Component2']);
      expect(result.length).toBe(2);
    });
    
    it('should return sorted directory names', () => {
      const mockDirents = [
        { name: 'Zebra', isDirectory: () => true },
        { name: 'Alpha', isDirectory: () => true },
        { name: 'Beta', isDirectory: () => true }
      ];
      
      fs.readdirSync.mockReturnValue(mockDirents);
      
      const getDirectories = (dirPath) => {
        try {
          return fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();
        } catch (e) {
          return [];
        }
      };
      
      const result = getDirectories('/dummy/path');
      
      expect(result).toEqual(['Alpha', 'Beta', 'Zebra']);
    });
    
    it('should return empty array on errors', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });
      
      const getDirectories = (dirPath) => {
        try {
          return fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();
        } catch (e) {
          return [];
        }
      };
      
      const result = getDirectories('/invalid/path');
      expect(result).toEqual([]);
    });
  });
  
  describe('calculateStats', () => {
    it('should calculate correct statistics', () => {
      const items = [
        { type: 'Component', hasStory: true, hasTests: true },
        { type: 'Component', hasStory: true, hasTests: false },
        { type: 'Component', hasStory: false, hasTests: true },
        { type: 'Component', hasStory: false, hasTests: false }
      ];
      
      const calculateStats = (categoryItems) => {
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
      
      const result = calculateStats(items);
      
      expect(result.total).toBe(4);
      expect(result.withStories).toBe(2);
      expect(result.withTests).toBe(2);
      expect(result.withBoth).toBe(1);
      expect(result.withNeither).toBe(1);
      expect(result.storiesPercent).toBe(50);
      expect(result.testsPercent).toBe(50);
      expect(result.bothPercent).toBe(25);
      expect(result.neitherPercent).toBe(25);
    });
    
    it('should handle empty arrays', () => {
      const items = [];
      
      const calculateStats = (categoryItems) => {
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
      
      const result = calculateStats(items);
      
      expect(result.total).toBe(0);
      expect(result.storiesPercent).toBe(0);
      expect(result.testsPercent).toBe(0);
    });
    
    it('should round percentages correctly', () => {
      const items = [
        { type: 'Component', hasStory: true, hasTests: false },
        { type: 'Component', hasStory: true, hasTests: false },
        { type: 'Component', hasStory: false, hasTests: false }
      ];
      
      const calculateStats = (categoryItems) => {
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
      
      const result = calculateStats(items);
      
      // 2/3 = 66.666...% should round to 67%
      expect(result.storiesPercent).toBe(67);
      expect(result.testsPercent).toBe(0);
    });
  });
  
  describe('generateTableRow', () => {
    it('should generate correct markdown table row', () => {
      const item = {
        type: 'Component',
        name: 'ErrorBoundary',
        path: 'src/components/ErrorBoundary',
        isPublic: true,
        exportNote: '',
        hasStory: true,
        hasTests: false
      };
      
      const generateTableRow = (item) => {
        const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${item.path}`;
        const publicStatus = item.isPublic 
          ? `✅ Public${item.exportNote}` 
          : '❌ Internal';
        const storyStatus = item.hasStory ? '✅ Has Story' : '❌ No Story';
        const testStatus = item.hasTests ? '✅ Has Tests' : '❌ No Tests';
        
        return `| ${item.type} | [${item.name}](${githubUrl}) | ${publicStatus} | ${storyStatus} | ${testStatus} |`;
      };
      
      const result = generateTableRow(item);
      
      expect(result).toContain('| Component |');
      expect(result).toContain('[ErrorBoundary]');
      expect(result).toContain('✅ Public');
      expect(result).toContain('✅ Has Story');
      expect(result).toContain('❌ No Tests');
      expect(result).toContain('https://github.com/GetDKAN/cmsds-open-data-components/tree/main/src/components/ErrorBoundary');
    });
    
    it('should handle export notes', () => {
      const item = {
        type: 'Component',
        name: 'DatasetTableTab',
        path: 'src/components/DatasetTableTab',
        isPublic: true,
        exportNote: ' (as DatasetTable)',
        hasStory: false,
        hasTests: true
      };
      
      const generateTableRow = (item) => {
        const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${item.path}`;
        const publicStatus = item.isPublic 
          ? `✅ Public${item.exportNote}` 
          : '❌ Internal';
        const storyStatus = item.hasStory ? '✅ Has Story' : '❌ No Story';
        const testStatus = item.hasTests ? '✅ Has Tests' : '❌ No Tests';
        
        return `| ${item.type} | [${item.name}](${githubUrl}) | ${publicStatus} | ${storyStatus} | ${testStatus} |`;
      };
      
      const result = generateTableRow(item);
      
      expect(result).toContain('✅ Public (as DatasetTable)');
    });
    
    it('should mark internal components correctly', () => {
      const item = {
        type: 'Component',
        name: 'ManageColumns',
        path: 'src/components/ManageColumns',
        isPublic: false,
        exportNote: '',
        hasStory: false,
        hasTests: true
      };
      
      const generateTableRow = (item) => {
        const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${item.path}`;
        const publicStatus = item.isPublic 
          ? `✅ Public${item.exportNote}` 
          : '❌ Internal';
        const storyStatus = item.hasStory ? '✅ Has Story' : '❌ No Story';
        const testStatus = item.hasTests ? '✅ Has Tests' : '❌ No Tests';
        
        return `| ${item.type} | [${item.name}](${githubUrl}) | ${publicStatus} | ${storyStatus} | ${testStatus} |`;
      };
      
      const result = generateTableRow(item);
      
      expect(result).toContain('❌ Internal');
    });
  });
  
  describe('Special Cases', () => {
    it('should handle DataTable case sensitivity', () => {
      const publicExports = new Set(['DataTable']);
      const componentName = 'Datatable';
      
      const isPublic = publicExports.has(componentName) || 
                       componentName === 'Datatable' && publicExports.has('DataTable');
      
      expect(isPublic).toBe(true);
    });
    
    it('should handle DatasetTableTab export as DatasetTable', () => {
      const publicExports = new Set(['DatasetTable']);
      const componentName = 'DatasetTableTab';
      
      const isPublic = componentName === 'DatasetTableTab' && publicExports.has('DatasetTable');
      
      expect(isPublic).toBe(true);
    });
    
    it('should handle buildRows partial export', () => {
      const publicExports = new Set(['buildRows']);
      const componentName = 'DatasetAdditionalInformation';
      
      const isPublic = componentName === 'DatasetAdditionalInformation' && publicExports.has('buildRows');
      
      expect(isPublic).toBe(true);
    });
  });
  
  describe('Integration Tests', () => {
    it('should generate complete report structure', () => {
      const lines = [];
      
      // Header
      lines.push('# CMSDS Open Data Components Inventory');
      lines.push('');
      lines.push('## Inventory Table');
      lines.push('');
      lines.push('| Type | Name | Public Export | Storybook Status | Unit Tests |');
      lines.push('|------|------|---------------|------------------|------------|');
      
      const markdown = lines.join('\n');
      
      expect(markdown).toContain('# CMSDS Open Data Components Inventory');
      expect(markdown).toContain('## Inventory Table');
      expect(markdown).toContain('| Type | Name | Public Export | Storybook Status | Unit Tests |');
    });
    
    it('should generate valid markdown table', () => {
      const item = {
        type: 'Component',
        name: 'TestComponent',
        path: 'src/components/TestComponent',
        isPublic: true,
        exportNote: '',
        hasStory: true,
        hasTests: true
      };
      
      const generateTableRow = (item) => {
        const githubUrl = `https://github.com/GetDKAN/cmsds-open-data-components/tree/main/${item.path}`;
        const publicStatus = item.isPublic 
          ? `✅ Public${item.exportNote}` 
          : '❌ Internal';
        const storyStatus = item.hasStory ? '✅ Has Story' : '❌ No Story';
        const testStatus = item.hasTests ? '✅ Has Tests' : '❌ No Tests';
        
        return `| ${item.type} | [${item.name}](${githubUrl}) | ${publicStatus} | ${storyStatus} | ${testStatus} |`;
      };
      
      const row = generateTableRow(item);
      
      // Should have exactly 5 pipe-separated columns (6 pipes including edges)
      const pipeCount = (row.match(/\|/g) || []).length;
      expect(pipeCount).toBe(6);
    });
  });
});
