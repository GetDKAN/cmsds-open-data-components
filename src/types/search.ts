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

export type NewParamsType = {
  fulltext?: string;
  theme?: string[];
  keyword?: string[];
};

export type DatasetSearchPageProps = {
  surveyLink?: string;
  rootUrl: string;
  additionalParams: {
    ACA: string;
    redirect: boolean;
  }
  enableSort: boolean;
  pageTitle: string;
  filterTitle: string;
  showSort?: boolean;
  showLargeFileWarning?: boolean;
  introText: string;
};

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