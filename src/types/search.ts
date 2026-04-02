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
  enableSort: boolean;
  enablePagination: boolean;
  defaultPageSize: number,
  defaultSort: {
    defaultSort: string;
    defaultOrder: string;
  }
  pageTitle?: string;
  categoriesTitle?: string;
  filterTitle?: string;
  showLargeFileWarning?: boolean;
  largeFileThemes?: Array<string>;
  introText: string;
  showDownloadIcon: boolean;
  altMobileSearchButton?: boolean;
  dataDictionaryLinks?: boolean;
  showDateDetails?: boolean;
  updateDateMonthYearOnly?: boolean;
  showTopics?: boolean;
  topicSlugFunction?: (topic: string) => string | undefined;
  children?: React.ReactNode;
};

export type DatasetSubmenuListProps = Pick<
  DatasetSearchPageProps,
  'rootUrl' | 'enablePagination' | 'defaultPageSize' | 'defaultSort' | 'dataDictionaryLinks'
> & {
  location: {
    search: string;
    pathname: string;
  };
  subLinkClasses?: string;
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

export type SearchResultItemType = {
  identifier: string;
  title: string;
  modified: string;
  description: string;
  distribution?: SearchDistributionType[];
  theme?: string[];
  released?: string;
  nextUpdateDate?: string;
  '%Ref:distribution'?: Array<{
    identifier: string;
    data: {
      title: string;
      format: string;
      downloadURL: string;
      describedBy?: string;
      describedByType?: string;
    };
  }>;
  [key: string]: unknown;
}
