import { getFormatType } from './format';
import {DistributionType } from '../types/dataset';

const baseDist = (overrides: Partial<DistributionType> = {}):DistributionType => ({
  '@type': 'dcat:Distribution',
  format: '',
  title: '',
  description: '',
  downloadURL: '',
  describedBy: '',
  describedByType: '',
  mediaType: '',
  ...overrides,
});

describe('getFormatType', () => {
  it('returns lowercased format when present', () => {
    expect(getFormatType(baseDist({ format: 'CSV' }))).toBe('csv');
  });

  it('falls through to mediaType when format is empty', () => {
    expect(getFormatType(baseDist({ mediaType: 'application/JSON' }))).toBe('json');
  });

  it('falls back to the downloadURL file extension when format and mediaType are empty', () => {
    expect(getFormatType(baseDist({ downloadURL: 'https://example.gov/files/report.pdf' }))).toBe('pdf');
  });

  it('lowercases the file extension', () => {
    expect(getFormatType(baseDist({ downloadURL: 'https://example.gov/files/DATA.CSV' }))).toBe('csv');
  });

  it('handles URL-encoded paths', () => {
    expect(
      getFormatType(baseDist({ downloadURL: 'https://example.gov/files/PY%202014%20Medical-SHOP-Landscape-Inst.pdf' })),
    ).toBe('pdf');
  });

  it('ignores extensions in the query string or fragment', () => {
    expect(getFormatType(baseDist({ downloadURL: 'https://example.gov/download?file=a.csv' }))).toBe('');
    expect(getFormatType(baseDist({ downloadURL: 'https://example.gov/download#a.csv' }))).toBe('');
  });

  it('uses the path extension when a query string is present', () => {
    expect(getFormatType(baseDist({ downloadURL: 'https://example.gov/files/a.zip?version=2' }))).toBe('zip');
  });

  it('returns empty string when the downloadURL has no extension', () => {
    expect(getFormatType(baseDist({ downloadURL: 'https://example.gov/download' }))).toBe('');
  });

  it('handles relative and malformed downloadURLs without throwing', () => {
    expect(getFormatType(baseDist({ downloadURL: '/files/a.xlsx' }))).toBe('xlsx');
    expect(getFormatType(baseDist({ downloadURL: 'http://[bad' }))).toBe('');
  });

  it('returns empty string when nothing is set', () => {
    expect(getFormatType(baseDist())).toBe('');
  });

  it('returns empty string when distribution has no data', () => {
    expect(getFormatType({} as DistributionType)).toBe('');
  });
});
