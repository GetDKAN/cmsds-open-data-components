import { SchemaType } from '../../../types/dataset';

export const makeSchema = (resourceId = 'dist-001'): SchemaType => ({
  [resourceId]: {
    fields: {
      product_name: { mysql_type: 'varchar(64)', description: 'Product name', type: 'string' },
      region: { mysql_type: 'varchar(20)', description: 'Sales region', type: 'string' },
      quantity: { mysql_type: 'int', description: 'Units sold', type: 'integer' },
      unit_price: { mysql_type: 'decimal(10,2)', description: 'Price per unit', type: 'number' },
      sale_date: { mysql_type: 'date', description: 'Date of sale', type: 'date' },
      notes: { mysql_type: 'text', description: 'Free-text notes', type: 'string' },
    },
  },
});
