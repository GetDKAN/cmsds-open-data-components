import React, { useState } from 'react';
import { SearchPaginationResults } from '@civicactions/data-catalog-components';
import { useSearchAPI, separateFacets } from '@civicactions/data-catalog-services';
import { TextField, Dropdown, Spinner, Button } from '@cmsgov/design-system'
import DatasetSearchListItem from '../../components/DatasetSearchListItem';
import Pagination from '../../components/Pagination';
import DatasetSearchFacets from '../../components/DatasetSearchFacets';

function selectedFacetsMessage(facets, alternateTitles) {
  let message = [];
  const keys = Object.keys(facets);
  keys.forEach((k) => {
    if(facets[k].length) {
      message.push(`${alternateTitles[k]}: ${facets[k].join(', ')}`)
    }
  })
  return message.join(' & ');
}


const DatasetSearch = ({rootUrl}) => {
  const {
    fulltext,
    selectedFacets,
    loading,
    items,
    totalItems,
    facets,
    updateSelectedFacets,
    setFulltext, 
    setSort,
    setPage,
    pageSize,
    page,
    resetFilters
  } = useSearchAPI(rootUrl, {})
  const { theme, keyword } = separateFacets(facets);
  const [filterText, setFilterText] = useState('');
  React.useEffect(() => {
    if(fulltext !== filterText) {
      setFilterText(fulltext)
    }
  }, [fulltext])


  return(
    <section className="ds-l-container">
      <h1 className="dc-search-header">
        Datasets
      </h1>
      <div className="ds-l-row">
        <div className="ds-l-col--8">
          <form
            onSubmit={(e) => {e.preventDefault(); () => setFulltext(filterText);}}
            className="ds-u-display--flex ds-u-justify-content--between ds-u-margin-bottom--2 "
          >
            <TextField
              fieldClassName="ds-u-margin--0"
              value={filterText}
              className="dc-fulltext--input-container ds-u-padding-right--2"
              label="Search term"
              labelClassName="ds-u-visibility--screen-reader"
              placeholder="Type search term here"
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
          
          <SearchPaginationResults
            total={Number(totalItems)}
            pageSize={Number(pageSize)}
            currentPage={Number(page + 1)}
          />
          <p className="ds-u-margin-top--0">
            {selectedFacetsMessage(selectedFacets, {theme: 'Categories', keyword: 'Tags'})}
          </p>
          <Button
            onClick={() => resetFilters()}
          >
            Clear all filters
          </Button>
          <ol className="dc-dataset-search-list ds-u-padding--0">
            {items.map((item) => (
              <li className="ds-u-padding--0">
                <DatasetSearchListItem item={item} updateFacets={updateSelectedFacets}/>
              </li>
            ))}
          </ol>
          <p className="ds-u-text-align--center ds-u-color--gray">{`[${items.length} ${items.length === 1 ? 'entry' : 'entries'} total on page]`}</p>
          {totalItems &&
            (<Pagination
              currentPage={page}
              totalItems={Number(totalItems)}
              itemsPerPage={pageSize}
              gotoPage={setPage}
            />)
          }
        </div>
        <div className="ds-l-col--4">
          <div className="ds-u-padding--2 ds-u-margin-bottom--4 ds-u-border--1">
            <Dropdown
              options={[{ label: 'Recently Updated', value: 'modified' },{ label: 'Alphabetical', value: 'title' }]}
              defaultValue="modified"
              label="Sort by"
              labelClassName="ds-u-margin-top--0"
              name="dataset_search_sort"
              onChange={(e) => setSort(e.target.value)}
            />
          </div>
          <div className="ds-u-padding--2 ds-u-margin-bottom--4 ds-u-border--1">
            {theme ?
              (
                <DatasetSearchFacets
                  title="Categories"
                  facets={theme}
                  onclickFunction={updateSelectedFacets}
                  selectedFacets={selectedFacets.theme}
                />
              )
              : (<Spinner className="ds-u-valign--middle" />)
            }
            {keyword ?
              (
                <DatasetSearchFacets
                  title="Tags"
                  facets={keyword}
                  onclickFunction={updateSelectedFacets}
                  selectedFacets={selectedFacets.keyword}
                />
              )
              : (<Spinner className="ds-u-valign--middle" />)
            }
          </div>
        </div>
      </div>
    </section>
  );
}

export default DatasetSearch;
