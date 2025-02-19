export type SearchDistributionType = {
  identifier: string;
  downloadURL: string;
}

export type SearchAPIFacetType = {
  type: string;
  name: string;
  total: string;
};

export type SelectedFacetsType = {
  theme: string[];
  keyword: string[];
  [key: string]: string[];
};

export type SidebarFacetTypes = {
  theme: SearchAPIFacetType[];
  keyword: SearchAPIFacetType[];
};

export type DatasetSearchPageProps = {
  surveyLink?: string;
  rootUrl: string;
  additionalParams: {
    ACA: string;
    redirect: boolean;
  }
  enableSort: boolean;
  enablePagination: boolean;
  defaultPageSize: number,
  defaultSort: {
    defaultSort: string;
    defaultOrder: string;
  }
  pageTitle: string;
  filterTitle: string;
  showLargeFileWarning?: boolean;
  largeFileThemes?: Array<string>;
  introText: string;
  showDownloadIcon: boolean;
  altMobileSearchButton?: boolean;
  dataDictionaryLinks?: boolean;
};

export type DistributionItemType = {
  distribution: SearchDistributionType[]
}

export type SearchFacetsPropTypes = {
  facets: SearchAPIFacetType[];
  title: string;
  selectedFacets: string[];
  onClickFunction: (key: string, value: string) => void;
};

export type SortType = {
  defaultSort: string;
  defaultOrder: string;
}