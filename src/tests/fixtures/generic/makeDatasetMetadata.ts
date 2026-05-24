import { DatasetType } from '../../../types/dataset';
import { makeDistribution } from './makeDistribution';

export const makeDatasetMetadata = (overrides: Partial<DatasetType> = {}): DatasetType => ({
  title: 'Sample Sales Dataset',
  identifier: 'dataset-abc-123',
  description: 'A neutral fixture dataset for unit and integration tests.',
  modified: '2025-01-15',
  released: '2024-06-01',
  nextUpdateDate: '2026-01-15',
  error: '',
  distribution: [makeDistribution()],
  theme: [{ data: 'Sales', identifier: 'theme-sales' }],
  keyword: [{ data: 'inventory', identifier: 'kw-inventory' }],
  ...overrides,
});
