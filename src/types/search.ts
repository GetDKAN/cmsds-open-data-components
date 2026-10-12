import { Location } from "react-router-dom";
import { DistributionType } from "./dataset";

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
  analytics?: boolean;
  onAnalyticsEvent?: (url: Location) => void;
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
  distribution?: Partial<DistributionType>[];
  theme?: string[];
  released?: string;
  nextUpdateDate?: string;
  [key: string]: unknown;
}
