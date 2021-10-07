export function calculateDatatablePages(totalRows, limit, offset) {
  const numTotalRows = parseInt(totalRows)
  const ofTotal = () => {
    if (limit >= numTotalRows) { return numTotalRows; }
    if (offset === 0) { return limit; }
    return (offset + limit);
  }
  const page = offset / limit;
  const startTotal = () => (page * limit + 1)


  return {
    startTotal: startTotal,
    ofTotal: ofTotal,
    numTotalRows: numTotalRows,
  }
}