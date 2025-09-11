import { getFormatType } from './format';
import { DistributionType } from '../types/dataset';

describe('getFormatType', () => {
  it('should return empty string when dist is null or undefined', () => {
    expect(getFormatType(null as any)).toBe('');
    expect(getFormatType(undefined as any)).toBe('');
    expect(getFormatType({} as DistributionType)).toBe('');
  });

  it('should return lowercase format when data.format exists', () => {
    const dist: DistributionType = {
      data: { format: 'CSV' }
    } as DistributionType;
    expect(getFormatType(dist)).toBe('csv');
  });

  it('should return format from mediaType when format is not available', () => {
    const dist: DistributionType = {
      data: { mediaType: 'application/json' }
    } as DistributionType;
    expect(getFormatType(dist)).toBe('json');
  });

  it('should handle undefined downloadURL cases without throwing errors', () => {
    // Undefined downloadURL
    expect(getFormatType({
      data: {}
    } as DistributionType)).toBe('');

    // Null downloadURL
    expect(getFormatType({
      data: { "%Ref:downloadURL": null }
    } as any)).toBe('');

    // Empty array
    expect(getFormatType({
      data: { "%Ref:downloadURL": [] }
    } as any)).toBe('');

    // Undefined first element
    expect(getFormatType({
      data: { "%Ref:downloadURL": [undefined] }
    } as any)).toBe('');

    // Missing data property
    expect(getFormatType({
      data: { "%Ref:downloadURL": [{}] }
    } as any)).toBe('');
  });

  // Valid downloadURL case
  it('should return format from downloadURL mimeType when available', () => {
    const dist: DistributionType = {
      data: {
        "%Ref:downloadURL": [
          { data: { mimeType: 'application/pdf' } }
        ]
      }
    } as any;
    expect(getFormatType(dist)).toBe('pdf');
  });

  it('should prioritize format > mediaType > downloadURL mimeType', () => {
    const dist: DistributionType = {
      data: {
        format: 'CSV',
        mediaType: 'application/json',
        "%Ref:downloadURL": [
          { data: { mimeType: 'application/pdf' } }
        ]
      }
    } as any;
    expect(getFormatType(dist)).toBe('csv');
  });
});
