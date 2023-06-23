// OPERATORS
// =
// <> not equal to
// BETWEEN
// IN
// NOT IN
// >=
// <=
// like

export function transformTableFilterToQueryCondition(filterArray) {
  const conditions = filterArray.map((f) => {
    return {
      resource: 't',
      property: f.id,
      value: `%${f.value}%`,
      operator: 'LIKE',
    }
  });
  return conditions;
}

export function transformTableFilterToSQLCondition(filterArray) {
  if(!filterArray || filterArray.length === 0) {
    return '';
  }

  const where_clauses = [];
  filterArray.forEach((v, i) => {
    // Switch delimiter to, and strip any double-quote for Dkan2's sql query.
    let value = `%25${v.value}%25`;
    where_clauses[i] = `${v.id} = "${v.value.replace('"', '')}"`;
  });
  return `[WHERE ${where_clauses.join(' AND ')}]`;
}
