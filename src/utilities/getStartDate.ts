import { ConditionType } from "../types/dataset";

export function getStartDate(condition : ConditionType, schema : any) {
  const schemaID = Object.keys(schema)[0];
  if (schema[schemaID].fields[condition.property].mysql_type === 'date') {
    const newDate = new Date(condition.value.toString());
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      return newDate;
    }
  }
  return new Date();
}