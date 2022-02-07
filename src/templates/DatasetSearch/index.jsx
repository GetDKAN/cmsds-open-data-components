import React, { useEffect, useState } from "react";
import qs from "qs";
import {
  useSearchAPI,
  separateFacets,
} from "@civicactions/data-catalog-services";
import { TextField, Dropdown, Spinner, Button } from "@cmsgov/design-system";
import DatasetSearchListItem from "../../components/DatasetSearchListItem";
import Pagination from "../../components/Pagination";
import DatasetSearchFacets from "../../components/DatasetSearchFacets";

const defaultSort = {
  defaultSort: "modified",
  defaultOrder: "desc",
};

function updateUrl(selectedFacets, fulltext, sort) {
  let newParams = { ...selectedFacets };
  if (fulltext) {
    newParams.fulltext = fulltext;
  }
  if (sort) {
    newParams.sort = sort;
  }
  return qs.stringify(newParams, { addQueryPrefix: true, encode: false });
}

export function selectedFacetsMessage(facets, alternateTitles) {
  let message = [];
  const keys = Object.keys(facets);
  keys.forEach((k) => {
    if (facets[k].length) {
      message.push(`${alternateTitles[k]}: ${facets[k].join(", ")}`);
    }
  });
  return message.join(" & ");
}

export function transformUrlParamsToSearchObject(
  searchParams,
  facetList,
  sortOptions
) {
  const params = qs.parse(searchParams, { ignoreQueryPrefix: true });
  const selectedFacets = {};
  facetList.forEach((facet) => {
    selectedFacets[facet] = params[facet] ? params[facet] : [];
  });
  return {
    selectedFacets: selectedFacets,
    fulltext: params.fulltext,
    sort: !params.sort ? sortOptions.defaultSort : params.sort,
    sortOrder: sortOptions.defaultOrder,
  };
}

const DatasetSearch = ({
  rootUrl,
  location,
  pageTitle,
  introText,
  fulltextLabel,
  fulltextLabelClassName,
  fulltextPlaceholder,
  formClassName,
  additionalParams,
  sortOptions,
}) => {
  const sortOpt = {
    ...defaultSort,
    ...sortOptions,
  };

  const [currentResultNumbers, setCurrentResultNumbers] = useState(null);
  const {
    fulltext,
    selectedFacets,
    loading,
    items,
    sort,
    totalItems,
    facets,
    updateSelectedFacets,
    setFulltext,
    setSort,
    sortOrder,
    setSortOrder,
    setPage,
    pageSize,
    page,
    resetFilters,
  } = useSearchAPI(
    rootUrl,
    {
      ...transformUrlParamsToSearchObject(
        location.search,
        ["theme", "keyword"],
        sortOpt
      ),
    },
    additionalParams
  );
  const { theme, keyword } = separateFacets(facets);
  const [filterText, setFilterText] = useState("");
  React.useEffect(() => {
    if (fulltext !== filterText) {
      setFilterText(fulltext);
    }
  }, [fulltext]);
  React.useEffect(() => {
    const url = new URL(window.location);
    const searchParams = updateUrl(selectedFacets, fulltext, sort);
    window.history.pushState(
      {},
      "",
      `${url.origin}${url.pathname}${searchParams}`
    );
  }, [fulltext, selectedFacets, sort]);
  useEffect(() => {
    const baseNumber = Number(totalItems) > 0 ? 1 : 0;
    const startingNumber =
      baseNumber + (Number(pageSize) * Number(page) - Number(pageSize));
    const endingNumber = Number(pageSize) * Number(page);
    setCurrentResultNumbers({
      total: Number(totalItems),
      startingNumber: startingNumber,
      endingNumber:
        Number(totalItems) < endingNumber ? Number(totalItems) : endingNumber,
    });
  }, [totalItems, pageSize, page]);

  function changePage(page) {
    setPage(page);
    window.scroll(0, 0);
  }

  // function updateSort(value) {
  //   setSortOrder(value);
  //   setSort(value);
  // }

  return (
    <section className="ds-l-container">
      <h1 className="dc-search-header ds-title ds-u-margin-y--3">
        {pageTitle}
      </h1>
      <div className="ds-l-row">
        <div className="ds-l-md-col--8 ds-l-sm-col--12ds-u-margin-bottom--3">
          {introText ? introText : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              () => setFulltext(filterText);
            }}
            className={formClassName}
          >
            <TextField
              fieldClassName="ds-u-margin--0"
              value={filterText}
              className="dc-fulltext--input-container ds-u-padding-right--2"
              label={fulltextLabel}
              labelClassName={fulltextLabelClassName}
              placeholder={fulltextPlaceholder}
              name="dataset_fulltext_search"
              onChange={(e) => setFilterText(e.target.value)}
            />
            <Button
              type="submit"
              htmlFor="dataset_fulltext_search"
              variation="primary"
              onClick={() => setFulltext(filterText)}
            >
              Search
            </Button>
          </form>
          <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--end">
            <div>
              {currentResultNumbers && (
                <p className="ds-u-margin-y--0">
                  Showing {currentResultNumbers.startingNumber} -{" "}
                  {currentResultNumbers.endingNumber} of{" "}
                  {currentResultNumbers.total} datasets
                </p>
              )}
              <p className="ds-u-margin-y--0">
                {selectedFacetsMessage(selectedFacets, {
                  theme: "Categories",
                  keyword: "Tags",
                })}
              </p>
            </div>

            <Button
              className="ds-u-padding--0 dc-c-clear-filters"
              variation="transparent"
              onClick={() => resetFilters()}
            >
              Clear all filters
            </Button>
          </div>
          <ol className="dc-dataset-search-list ds-u-padding--0">
            {items.map((item) => (
              <li className="ds-u-padding--0">
                <DatasetSearchListItem
                  item={item}
                  updateFacets={updateSelectedFacets}
                />
              </li>
            ))}
          </ol>
          {totalItems && (
            <Pagination
              totalPages={Math.ceil(Number(totalItems) / pageSize)}
              currentPage={page}
              buttonAction={changePage}
            />
          )}
        </div>
        <div className="ds-l-md-col--4 ds-l-sm-col--12">
          <div className="ds-u-padding--2 ds-u-margin-bottom--4 ds-u-border--1">
            <Dropdown
              options={[
                { label: "Recently Updated", value: "modified" },
                { label: "Title", value: "title" },
              ]}
              value={sort}
              label="Sort by"
              labelClassName="ds-u-margin-top--0"
              name="dataset_search_sort"
              onChange={(e) => setSort(e.target.value)}
            />
            <Dropdown
              options={[
                { label: "Ascending", value: "asc" },
                { label: "Descending", value: "desc" },
              ]}
              value={sortOrder}
              label="Sort order"
              labelClassName="ds-u-margin-top--0"
              name="dataset_search_sort_order"
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <div className="ds-u-padding--2 ds-u-margin-bottom--4 ds-u-border--1">
            {theme ? (
              <DatasetSearchFacets
                title="Categories"
                facets={theme}
                onclickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.theme}
              />
            ) : (
              <Spinner className="ds-u-valign--middle" />
            )}
            {keyword ? (
              <DatasetSearchFacets
                title="Tags"
                facets={keyword}
                onclickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.keyword}
              />
            ) : (
              <Spinner className="ds-u-valign--middle" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

DatasetSearch.defaultProps = {
  pageTitle: "Datasets",
  introText: "",
  fulltextLabel: "Search term",
  fulltextLabelClassName: "ds-u-visibility--screen-reader",
  fulltextPlaceholder: "Type search term here",
  formClassName:
    "ds-u-display--flex ds-u-justify-content--between ds-u-margin-bottom--2",
};

export default DatasetSearch;
