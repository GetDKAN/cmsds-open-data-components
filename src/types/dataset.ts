export type DistributionType = {
  downloadURL: string;
  identifier: string;
}

export type DatasetType = {
  title: string,
  distribution: DistributionType[],
  error: string,
  description: string,
}

export type ConditionType = {
  operator: string,
  property: string,
  value: string | string[],
  key?: string,
  [key: string]: string | string[] | undefined;
}

export type PropertyType = {
  label: string,
  value: string
}

export type ColumnType = {
  header: string,
  accessor: string
}

export type SchemaType = {
  [key: string] : {
    fields: {
      [key: string] : {
        mysql_type: string,
        description: string,
        type: string
      }
    }
  }
}

export type DatasetPageType = {
  id: string,
  rootUrl: string,
  additionalParams: any,
  customColumns : Array<ColumnType>,
  setDatasetTitle : Function,
  customMetadataMapping : any, // TODO
}

export type ResourceType = {
  columns: Array<string>,
  count: number,
  limit: number,
  offset: number,
  loading: boolean,
  conditions: Array<ConditionType>,
  schema: SchemaType,
  values: Array<Object>,
  setLimit: Function,
  setOffset: Function,
  setSort: Function,
  setConditions: Function,
}

export type QueryRowType = {
  id: string,
  condition : ConditionType,
  index : number,
  update : Function,
  remove : Function,
  propertyOptions : Array<PropertyType>,
  schema : SchemaType
}