export function buildCustomColHeaders(customHeaders, columns, schema) {
  return columns.map((column) => {
    const customHeaderIndex = customHeaders.findIndex((header) => header.id === column);
    if(customHeaderIndex > -1) {
      return customHeaders[customHeaderIndex]
    }
    return {
      Header: schema && schema.fields[column].description ? schema.fields[column].description : column,
      accessor: column,
    }
  });
}