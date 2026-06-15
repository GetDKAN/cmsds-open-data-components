import { transformTableSortToQuerySort } from './transformSorts';

describe('transformTableSortToQuerySort', () => {
  it('returns empty array for empty input', () => {
    expect(transformTableSortToQuerySort([])).toEqual([]);
  });

  it('maps desc:true to order desc', () => {
    expect(transformTableSortToQuerySort([{ id: 'product_name', desc: true }])).toEqual([
      { property: 'product_name', order: 'desc' },
    ]);
  });

  it('maps desc:false to order asc', () => {
    expect(transformTableSortToQuerySort([{ id: 'quantity', desc: false }])).toEqual([
      { property: 'quantity', order: 'asc' },
    ]);
  });

  it('preserves order across multiple sorts', () => {
    const result = transformTableSortToQuerySort([
      { id: 'region', desc: false },
      { id: 'sale_date', desc: true },
    ]);
    expect(result).toEqual([
      { property: 'region', order: 'asc' },
      { property: 'sale_date', order: 'desc' },
    ]);
  });
});
