import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Choice, Button } from '@cmsgov/design-system';

export function isSelected(currentFacet, selectedFacets) {
  let isSelected = -1;
  if (selectedFacets) {
    isSelected = selectedFacets.findIndex((s) => s === currentFacet);
  }
  return isSelected;
}

const DatasetSearchFacets = ({ title, facets, onclickFunction, selectedFacets }) => {
  const showLimit = 25;
  const [isOpen, setIsOpen] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const filteredFacets = facets.filter((f) => f.total > 0);
  return (
    <div className="ds-u-margin-bottom--4">
      <Button
        variation="transparent"
        className={`dc-facet-block--toggle ds-h4 ds-u-margin-top--0 ds-u-padding-left--0 ${
          isOpen ? 'open' : 'closed'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </Button>
      {isOpen && (
        <div>
          <ul className="dc-dataset-search--facets ds-u-padding--0 ds-u-margin--0">
            {filteredFacets
              .filter((facet, index) => {
                if (!showMore) {
                  if (index <= showLimit) {
                    return facet;
                  } else {
                    return false;
                  }
                }
                return facet;
              })
              .map((f) => {
                return (
                  <li key={f.name}>
                    <Choice
                      checked={isSelected(f.name, selectedFacets) > -1 ? true : false}
                      name={`facet_theme_${f.name}`}
                      type="checkbox"
                      label={`${f.name} (${f.total})`}
                      value={f.name}
                      onClick={(e) => onclickFunction({ key: f.type, value: e.target.value })}
                    />
                  </li>
                );
              })}
          </ul>
          {!showMore && filteredFacets.length > showLimit && (
            <Button variation="transparent" onClick={() => setShowMore(true)}>
              Show more
            </Button>
          )}
          {showMore && filteredFacets.length > showLimit && (
            <Button variation="transparent" onClick={() => setShowMore(false)}>
              Show less
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

DatasetSearchFacets.propTypes = {
  title: PropTypes.string.isRequired,
  facets: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      total: PropTypes.string.isRequired,
    })
  ).isRequired,
  onclickFunction: PropTypes.func.isRequired,
};

export default DatasetSearchFacets;
