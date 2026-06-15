import { getFormatType } from './format';
import { DistributionType } from '../types/dataset';

const baseDist = (overrides: Partial<DistributionType['data']> = {}): DistributionType => ({
  identifier: 'd1',
  data: {
    '@type': 'dcat:Distribution',
    format: '',
    title: '',
    description: '',
    downloadURL: '',
    describedBy: '',
    describedByType: '',
    mediaType: '',
    '%Ref:downloadURL': [],
    ...overrides,
  },
});

describe('getFormatType', () => {
  it('returns lowercased format when present', () => {
    expect(getFormatType(baseDist({ format: 'CSV' }))).toBe('csv');
  });

  it('falls through to mediaType when format is empty', () => {
    expect(getFormatType(baseDist({ mediaType: 'application/JSON' }))).toBe('json');
  });

  it('falls through to %Ref:downloadURL mimeType when format and mediaType are empty', () => {
    const dist = baseDist({
      '%Ref:downloadURL': [
        {
          identifier: 'r1',
          data: {
            filePath: '',
            identifier: 'r1',
            perspective: 'source',
            version: '1',
            checksum: null,
            mimeType: 'text/csv',
          },
        },
      ],
    });
    expect(getFormatType(dist)).toBe('csv');
  });

  it('returns empty string when nothing is set', () => {
    expect(getFormatType(baseDist())).toBe('');
  });

  it('returns empty string when distribution has no data', () => {
    expect(getFormatType({ identifier: 'x' } as DistributionType)).toBe('');
  });
});
