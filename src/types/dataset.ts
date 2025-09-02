export type DistributionDataType = {
  downloadURL: string,
  format: string,
  title: string,
  description: string,
  describedBy: string,
  describedByType: string,
  mediaType: string,
  mimeType: string,
  "%Ref:downloadURL": DistributionType[],
}

export type DistributionType = {
  identifier: string,
  data: DistributionDataType,
}

export type DatasetType = {
  title: string,
  distribution: DistributionType[],
  error: string,
  description: string,
  identifier: string,
  describedBy?: any, // TODO
  describedByType?: any, //TODO
  modified: string,
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
  customColumns : Array<ColumnType>,
  setDatasetTitle : Function,
  customMetadataMapping : any, // TODO
  apiPageUrl: string,
  dataDictionaryUrl: string | undefined,
  borderlessTabs: boolean,
  defaultPageSize: Number,
  dataDictionaryCSV: boolean,
  dataDictionaryBanner: boolean,
  disableTableControls: boolean,
  hideDataDictionary: boolean,
  customDescription?: Function,
  updateAriaLive?: Function,
  showRowLimitNotice?: boolean,
}


export type ResourceType = {
  columns: Array<string>,
  count: number | null,
  totalRows: number,
  totalColumns: number,
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
  setResource: Function,
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

export type FilterItemType = {
  id: string;
  condition : ConditionType;
  index : number;
  update : Function;
  remove : Function;
  propertyOptions : Array<PropertyType>;
  schema : SchemaType;
  className?: string;
}

export type DatasetOverviewPropsType = {
  dataset: DatasetType,
  resource: ResourceType,
  distributions: DistributionType[],
  metadataMapping: any, //TODO
}

export type DatasetDictionaryItemType = {
  format: string,
  name: string,
  title: string,
  description: string,
  type: string,
  [name: string]: string,
}

export type DatasetDictionaryType = {
  identifier: string,
  title: string,
  data: {
    fields: DatasetDictionaryItemType[]
  }
}

export type DatasetDescriptionType = {
  distribution: DistributionType,
  dataset: DatasetType,
  resource: ResourceType,
  customDescription?: Function,
  updateAriaLive?: Function,
}
