import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Choice, Button, Accordion, AccordionItem } from '@cmsgov/design-system';

export function isSelected(currentFacet, selectedFacets) {
  let isSelected = -1;
  if (selectedFacets) {
    isSelected = selectedFacets.findIndex((s) => s === currentFacet);
  }
  return isSelected;
}

const DatasetSearchFacets = ({ title, facets, onclickFunction, selectedFacets, loading }) => {
  const showLimit = 25;
  const [isOpen, setIsOpen] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const filteredFacets = facets.filter((f) => {
    const selectedIndex = selectedFacets.findIndex((item) => item === f.name);
    return f.total > 0 || selectedIndex !== -1;
  });
  return (
    <div className="ds-u-margin-bottom--4 dc-dataset-search--facets-container">
      <Accordion>
        <AccordionItem heading={`${title} (${filteredFacets.length})`} defaultOpen>
          <>
            {filteredFacets.length ? (
              <ul className="dc-dataset-search--facets ds-u-padding--0 ds-u-margin--0">
                {filteredFacets.map((f) => {
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
            ) : (
              <p className="ds-h5">No matching facets found.</p>
            )}
          </>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

DatasetSearchFacets.defaultProps = {
  selectedFacets: [],
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
