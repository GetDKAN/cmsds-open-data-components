import React from 'react';
import { Choice, Accordion, AccordionItem, AddIcon, RemoveIcon } from '@cmsgov/design-system';
import { SearchAPIFacetType, SearchFacetsPropTypes } from '../../types/search';
import './dataset-search-facets.scss';

const SearchFacets = (props: SearchFacetsPropTypes) => {
  const { facets, title, onClickFunction, selectedFacets = [] } = props;
  const filteredFacets = facets .filter((f: SearchAPIFacetType) => {
    return Number(f.total) > 0 || selectedFacets.findIndex((i) => i === f.name) !== -1;
  });

  return (
    <div className="dkan-dataset-search--facet-container ds-u-margin-bottom--4">
      <Accordion>
        <AccordionItem
          contentClassName="ds-u-padding-left--1 ds-u-padding-right--0"
          heading={title}
          defaultOpen
        >
            {!filteredFacets.length ?
              <p className="ds-text-heading--md">No matching facets found.</p>
            :
              <ul>
                {filteredFacets
                .map((f: SearchAPIFacetType) => {
                  return (
                    <li key={f.name as React.Key}>
                      <Choice
                        className="ds-u-margin-y--1"
                        checked={selectedFacets.findIndex((s) => s === f.name) > -1 ? true : false}
                        name={`facet_theme_${f.name}`}
                        type="checkbox"
                        label={`${f.name} (${f.total})`}
                        value={f.name}
                        onClick={() => onClickFunction(f.type, f.name)}
                      />
                    </li>
                  )})
                }
              </ul>
            }
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SearchFacets;
