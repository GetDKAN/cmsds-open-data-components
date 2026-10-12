import {DistributionType } from '../../../types/dataset';

export const makeDistribution = (overrides: Partial<DistributionType> = {}): DistributionType => ({
  '@type': 'dcat:Distribution',
  format: 'csv',
  title: 'Sample Sales Distribution',
  description: 'A neutral fixture distribution for tests',
  downloadURL: 'https://example.test/data/sales.csv',
  describedBy: 'https://example.test/data/schema.json',
  describedByType: 'application/json',
  mediaType: 'text/csv',
  ...overrides,
});
