export function transformTableSortToQuerySort(sortArray) {
  let newQuery = [];
  sortArray.forEach((s) => {
    return newQuery.push({property: s.id, order: s.desc ? 'desc' : 'asc'})
  })
  return newQuery;
}