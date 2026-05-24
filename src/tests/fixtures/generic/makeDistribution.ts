import { DistributionType } from '../../../types/dataset';

export const makeDistribution = (overrides: Partial<DistributionType> = {}): DistributionType => ({
  identifier: 'dist-001',
  data: {
    '@type': 'dcat:Distribution',
    format: 'csv',
    title: 'Sample Sales Distribution',
    description: 'A neutral fixture distribution for tests',
    downloadURL: 'https://example.test/data/sales.csv',
    describedBy: 'https://example.test/data/schema.json',
    describedByType: 'application/json',
    mediaType: 'text/csv',
    '%Ref:downloadURL': [
      {
        identifier: 'dist-001-source',
        data: {
          filePath: 'https://example.test/data/sales.csv',
          identifier: 'dist-001-source',
          perspective: 'source',
          version: '1700000000',
          checksum: null,
          mimeType: 'text/csv',
        },
      },
    ],
  },
  ...overrides,
});
