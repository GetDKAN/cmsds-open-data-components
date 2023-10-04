import { useState, useEffect } from "react";
import { fetchDatasets } from "./helpers";

const useSearchAPI = (
  rootUrl,
  initialSearchParams = {},
  additionalParams = {}
) => {
  const defaultSort = "";
  const defaultFulltext = "";
  const defaultSelectedFacets = {};
  const defaultSortOrder = "";
  const defaultPage = 1;
  const defaultPageSize = 10;

  const sortOptions = ["modified", "title"];
  const sortOrderOptions = ["asc", "desc"];
  const [items, setItems] = useState([]);
  const [facets, setFacets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(null);
  const [selectedFacets, setSelectedFacets] = useState(
    initialSearchParams.selectedFacets
      ? initialSearchParams.selectedFacets
      : defaultSelectedFacets
  );
  const [fulltext, setFulltext] = useState(
    initialSearchParams.fulltext
      ? initialSearchParams.fulltext
      : defaultFulltext
  );
  const [sort, setSort] = useState(
    initialSearchParams.sort ? initialSearchParams.sort : defaultSort
  );
  const [sortOrder, setSortOrder] = useState(
    initialSearchParams.sortOrder
      ? initialSearchParams.sortOrder
      : defaultSortOrder
  );
  const [page, setPage] = useState(
    initialSearchParams.page ? initialSearchParams.page : defaultPage
  );
  const [pageSize, setPageSize] = useState(
    initialSearchParams.pageSize
      ? initialSearchParams.pageSize
      : defaultPageSize
  );

  async function search() {
    const options = {
      fulltext: fulltext,
      selectedFacets: selectedFacets,
      sort: sort,
      sortOrder: sortOrder,
      page: Number(page),
      pageSize: pageSize,
    };
    const results = await fetchDatasets(rootUrl, options, additionalParams);
    const itemKeys = Object.keys(results.data.results);
    const itemsArray = itemKeys.map((key) => {
      return results.data.results[key];
    });
    setFacets(results.data.facets);
    setItems(itemsArray);
    setTotalItems(results.data.total);
    setLoading(false);
  }

  function resetFilters() {
    setFulltext(defaultFulltext);
    setSelectedFacets(defaultSelectedFacets);
    setPage(defaultPage);
  }

  useEffect(() => {
    if (totalItems !== null) {
      setPage(1);
    }
  }, [fulltext, selectedFacets, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      search();
    }, 1000);
    return () => clearTimeout(timer);
  }, [fulltext, selectedFacets, sort, sortOrder, page, pageSize]);

  return {
    fulltext,
    selectedFacets,
    sortOptions,
    sortOrderOptions,
    items,
    facets,
    loading,
    totalItems,
    sort,
    sortOrder,
    page,
    pageSize,
    setPage,
    setPageSize,
    setSort,
    setSortOrder,
    setFulltext,
    resetFilters,
  };
};

export default useSearchAPI;
