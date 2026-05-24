import { truncateText } from './truncateText';

describe('truncateText', () => {
  it('returns empty string for null / undefined', () => {
    expect(truncateText(null as unknown as string)).toBe('');
    expect(truncateText(undefined as unknown as string)).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(truncateText('')).toBe('');
  });

  it('keeps only content before the first </p>', () => {
    const html = '<p>First sentence.</p><p>Second sentence.</p>';
    expect(truncateText(html)).toBe('First sentence.');
  });

  it('keeps only content before the first <br/> when no </p>', () => {
    expect(truncateText('Lead text<br/>Following text')).toBe('Lead text');
  });

  it('truncates at the configured length boundary', () => {
    const long = 'word '.repeat(100).trim();
    const out = truncateText(long, 50);
    expect(out.length).toBeLessThanOrEqual(50);
    expect(out.endsWith('...')).toBe(true);
  });

  it('strips all HTML tags via DOMPurify allowlist', () => {
    const result = truncateText('Plain <strong>bold</strong> <em>emphasis</em>');
    expect(result).not.toMatch(/<[^>]+>/);
    expect(result).toContain('bold');
    expect(result).toContain('emphasis');
  });
});
