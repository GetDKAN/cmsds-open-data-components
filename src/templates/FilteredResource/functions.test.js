import {
  buildOperatorOptions,
  convertUTCToLocalDate,
  cleanText,
  buildCustomColHeaders,
  getOperatorLabel,
} from './functions';

describe('buildOperatorOptions', () => {
  it('returns text/string operator set for "text" type', () => {
    const ops = buildOperatorOptions('text');
    expect(ops.map((o) => o.value)).toEqual(['=', 'starts with', 'contains', '<>', 'in']);
  });

  it('returns the same set for "string" type', () => {
    const ops = buildOperatorOptions('string');
    expect(ops.map((o) => o.value)).toEqual(['=', 'starts with', 'contains', '<>', 'in']);
  });

  it('returns date operator set for "date" type', () => {
    const ops = buildOperatorOptions('date');
    expect(ops.map((o) => o.value)).toEqual(['=', '<>', '>', '<']);
  });

  it('returns the default operator set for unknown types', () => {
    expect(buildOperatorOptions('blob').map((o) => o.value)).toEqual(['=', '<>']);
  });

  it('appends is_empty / not_empty when enableEmptyFilters is true', () => {
    const ops = buildOperatorOptions('string', true).map((o) => o.value);
    expect(ops).toContain('is_empty');
    expect(ops).toContain('not_empty');
  });
});

describe('convertUTCToLocalDate', () => {
  it('returns input unchanged when falsy', () => {
    expect(convertUTCToLocalDate(null)).toBeNull();
    expect(convertUTCToLocalDate(undefined)).toBeUndefined();
  });

  it('returns a Date instance for valid ISO input', () => {
    const out = convertUTCToLocalDate('2025-01-15T00:00:00Z');
    expect(out).toBeInstanceOf(Date);
    expect(out.getFullYear()).toBe(2025);
    expect(out.getMonth()).toBe(0);
    expect(out.getDate()).toBe(15);
  });
});

describe('cleanText', () => {
  it('joins array values with comma', () => {
    expect(cleanText(['a', 'b', 'c'])).toBe('a,b,c');
  });

  it('returns primitives unchanged', () => {
    expect(cleanText('foo')).toBe('foo');
  });
});

describe('getOperatorLabel', () => {
  it('returns the matching label for a known operator', () => {
    expect(getOperatorLabel('starts with')).toBe('Starts With');
  });

  it('returns the input when operator is unknown', () => {
    expect(getOperatorLabel('xyz')).toBe('xyz');
  });
});

describe('buildCustomColHeaders', () => {
  const schema = {
    fields: {
      product_name: { mysql_type: 'varchar(64)', description: 'Product name', type: 'string' },
      sale_date: { mysql_type: 'date', description: 'Date of sale', type: 'date' },
      quantity: { mysql_type: 'int', description: '', type: 'integer' },
    },
  };

  it('uses schema description when available', () => {
    const result = buildCustomColHeaders([], ['product_name'], schema);
    expect(result[0]).toMatchObject({ header: 'Product name', accessor: 'product_name' });
  });

  it('falls back to the column name when description is empty', () => {
    const result = buildCustomColHeaders([], ['quantity'], schema);
    expect(result[0].header).toBe('quantity');
  });

  it('attaches a cell renderer when an accessor match exists', () => {
    const cell = () => 'X';
    const result = buildCustomColHeaders([{ accessor: 'product_name', cell }], ['product_name'], schema);
    expect(result[0].cell).toBe(cell);
  });

  it('attaches a cell renderer when only a schema-type match exists', () => {
    const cell = () => 'Y';
    const result = buildCustomColHeaders([{ schema: 'date', cell }], ['sale_date'], schema);
    expect(result[0].cell).toBe(cell);
  });

  it('prefers accessor match over schema match', () => {
    const accessorCell = () => 'A';
    const schemaCell = () => 'S';
    const result = buildCustomColHeaders(
      [
        { schema: 'date', cell: schemaCell },
        { accessor: 'sale_date', cell: accessorCell },
      ],
      ['sale_date'],
      schema,
    );
    expect(result[0].cell).toBe(accessorCell);
  });
});
