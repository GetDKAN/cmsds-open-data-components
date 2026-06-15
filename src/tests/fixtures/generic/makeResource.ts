import { ResourceType } from '../../../types/dataset';

const defaultRows = [
  { product_name: 'Alpha Widget', region: 'North', quantity: 12, unit_price: 9.99, sale_date: '2025-01-04' },
  { product_name: 'Beta Gadget', region: 'South', quantity: 7, unit_price: 14.5, sale_date: '2025-01-05' },
  { product_name: 'Gamma Tool', region: 'East', quantity: 33, unit_price: 4.25, sale_date: '2025-01-06' },
  { product_name: 'Delta Kit', region: 'West', quantity: 5, unit_price: 49.0, sale_date: '2025-01-07' },
  { product_name: 'Epsilon Set', region: 'North', quantity: 21, unit_price: 7.75, sale_date: '2025-01-08' },
  { product_name: 'Zeta Pack', region: 'South', quantity: 16, unit_price: 12.0, sale_date: '2025-01-09' },
  { product_name: 'Eta Bundle', region: 'East', quantity: 9, unit_price: 19.95, sale_date: '2025-01-10' },
  { product_name: 'Theta Box', region: 'West', quantity: 14, unit_price: 8.5, sale_date: '2025-01-11' },
  { product_name: 'Iota Crate', region: 'North', quantity: 3, unit_price: 25.0, sale_date: '2025-01-12' },
  { product_name: 'Kappa Case', region: 'South', quantity: 28, unit_price: 6.75, sale_date: '2025-01-13' },
];

const defaultColumns = ['product_name', 'region', 'quantity', 'unit_price', 'sale_date'];

const defaultSchema = {
  'dist-001': {
    fields: {
      product_name: { mysql_type: 'varchar(64)', description: 'Product name', type: 'string' },
      region: { mysql_type: 'varchar(20)', description: 'Sales region', type: 'string' },
      quantity: { mysql_type: 'int', description: 'Units sold', type: 'integer' },
      unit_price: { mysql_type: 'decimal(10,2)', description: 'Price per unit', type: 'number' },
      sale_date: { mysql_type: 'date', description: 'Date of sale', type: 'date' },
    },
  },
};

export const makeResource = (overrides: Partial<ResourceType> = {}): ResourceType => ({
  error: null,
  columns: defaultColumns,
  count: defaultRows.length,
  totalRows: defaultRows.length,
  totalColumns: defaultColumns.length,
  limit: 25,
  offset: 0,
  loading: false,
  conditions: [],
  schema: defaultSchema,
  values: defaultRows,
  setLimit: () => {},
  setOffset: () => {},
  setSort: () => {},
  setConditions: () => {},
  setResource: () => {},
  ...overrides,
});
