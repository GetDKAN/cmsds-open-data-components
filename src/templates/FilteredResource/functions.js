// Example custom column headers, where only effective date has an ! at the end
// [
//  {schema: 'date', Cell: ({ value }) => localeDate(value),},
//  {accessor: 'effective_date',Cell: ({ value }) => localeDate(value) + '!',},
// ]

export function buildCustomColHeaders(customHeaders, columns, schema) {
  return columns.map((column) => {
    const customAccessorIndex = customHeaders.findIndex((header) => header.accessor === column);
    const customSchemaIndex = customHeaders.findIndex(
      (header) => header.schema === schema.fields[column].mysql_type
    );
    let newColumn = {};
    // If specific accessor is passed, this will override a general mysql_type Cell rewrite.
    if (customAccessorIndex > -1) {
      newColumn.Header =
        schema && schema.fields[column].description ? schema.fields[column].description : column;
      newColumn.accessor = column;
      newColumn.Cell = customHeaders[customAccessorIndex].Cell;
    } else {
      newColumn.Header =
        schema && schema.fields[column].description ? schema.fields[column].description : column;
      newColumn.accessor = column;
      if (customSchemaIndex > -1) {
        newColumn.Cell = customHeaders[customSchemaIndex].Cell;
      }
    }

    return newColumn;
  });
}

export function convertUTCToLocalDate(date) {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return date;
}

export function cleanText(value, operator) {
  let newValue = value;
  if (Array.isArray(newValue)) {
    newValue = newValue.join(',');
  }
  // return newValue.replace(/(^\%+|\%+$)/gm, '');
  return newValue
}

export const operatorMapping = [
  { label: 'Is', value: '=' },
  { label: 'Starts With', value: 'starts with' },
  { label: 'Contains', value: 'contains' },
  { label: 'Is Not', value: '<>' },
  { label: 'Or', value: 'in' },
  { label: 'Is', value: '=' },
  { label: 'Is Not', value: '<>' },
  { label: 'Greater Than', value: '>' },
  { label: 'Less Than', value: '<' },
];

export function buildOperatorOptions(type) {
  switch (type) {
    case 'text': // Will change from text to string in future update
    case 'string':
      return [
        { label: 'Is', value: '=' },
        { label: 'Starts With', value: 'starts with' },
        { label: 'Contains', value: 'contains' },
        { label: 'Is Not', value: '<>' },
        { label: 'Or', value: 'in' },
      ];
    case 'date':
      return [
        { label: 'Is', value: '=' },
        { label: 'Is Not', value: '<>' },
        { label: 'Greater Than', value: '>' },
        { label: 'Less Than', value: '<' },
      ];
    default:
      // These 2 should be safe for all data types
      return [
        { label: 'Is', value: '=' },
        { label: 'Is Not', value: '<>' },
      ];
  }
}
