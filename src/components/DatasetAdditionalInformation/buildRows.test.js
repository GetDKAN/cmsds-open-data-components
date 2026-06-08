import { buildRows } from './index';

describe('buildRows', () => {
  it('returns empty array for empty mapping', () => {
    expect(buildRows({}, { foo: 'bar' })).toEqual([]);
  });

  it('skips keys missing from datasetInfo', () => {
    const mapping = {
      missing: () => [{ label: 'Missing', value: 'never' }],
      present: (v) => [{ label: 'Present', value: v }],
    };
    const rows = buildRows(mapping, { present: 'yes' });
    expect(rows).toEqual([{ label: 'Present', value: 'yes' }]);
  });

  it('spreads multi-row mapping results into a single array', () => {
    const mapping = {
      a: (v) => [
        { label: 'A1', value: v },
        { label: 'A2', value: v + '!' },
      ],
    };
    const rows = buildRows(mapping, { a: 'x' });
    expect(rows).toEqual([
      { label: 'A1', value: 'x' },
      { label: 'A2', value: 'x!' },
    ]);
  });

  it('preserves order based on mapping key order', () => {
    const mapping = {
      first: (v) => [{ label: 'First', value: v }],
      second: (v) => [{ label: 'Second', value: v }],
    };
    const rows = buildRows(mapping, { first: '1', second: '2' });
    expect(rows.map((r) => r.label)).toEqual(['First', 'Second']);
  });
});
