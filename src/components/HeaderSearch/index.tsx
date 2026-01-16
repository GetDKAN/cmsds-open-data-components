import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, TextField } from "@cmsgov/design-system";
import { isValidSearch } from "../../templates/DatasetSearch/DatasetSearch";

import "./header-search.scss";

export type HeaderSearchProps = {
  headingText?: string
};

const HeaderSearch = (props: HeaderSearchProps) => {
  const { headingText = "Dataset Search" } = props;
  const navigate = useNavigate();
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSearch, setModalSearch] = useState(false);
  const [invalidSearch, setInvalidSearch] = useState<boolean>(false);

  function searchForDataset(e: React.SyntheticEvent) {
    e.preventDefault();

    if (window) {
      if (modalSearchTerm) {
        if (isValidSearch(modalSearchTerm)) {
          setInvalidSearch(false);

          if (window.location.pathname !== '/datasets') {
            navigate(`/datasets?fulltext=${modalSearchTerm}`);
          } else {
            window.location.search = `fulltext=${modalSearchTerm}`;
            setModalSearch(false);
          }
        } else {
          setInvalidSearch(true);
        }
      }
    }
  }

  return (
    <div className="dkan-c-main-navigation--search">
      <Button
        variation="ghost"
        onDark={true}
        className="ds-u-border--0 dkan-c-header-search--modal-button"
        onClick={() => setModalSearch(true)}
      >
        <span>Search</span>
      </Button>
      {modalSearch && (
        <Dialog
          className="dc-c-search-dialog"
          isOpen={modalSearch}
          onExit={() => setModalSearch(false)}
          heading={`${headingText}`}
          actions= {
            <form
              className="dkan-dataset-search ds-u-display--flex ds-u-align-items--start ds-u-flex-wrap--nowrap"
              onSubmit={(e: React.SyntheticEvent) => {
                searchForDataset(e);
              }}
            >
              <TextField
                errorMessage={invalidSearch ? 'No special characters allowed. Please enter a valid search term.' : undefined}
                value={modalSearchTerm}
                fieldClassName="ds-u-display--inline-block ds-u-margin--0"
                className="ds-l-col--9"
                label="Search Term"
                name="search-modal"
                labelClassName="ds-u-visibility--screen-reader"
                onChange={(e) => {
                  setInvalidSearch(false);
                  setModalSearchTerm(e.target.value)
                }}
              />
              <Button type="submit" className="ds-l-col--3">
                <span className="fas fa-search small-text ds-u-sm-display--none" />
                <span className="full-text ds-u-display--none ds-u-sm-display--inline-block">
                  Search
                </span>
              </Button>
            </form>
          }
        />
      )}
    </div>
  );
}

export default HeaderSearch;
