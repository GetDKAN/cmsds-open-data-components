import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, TextField } from "@cmsgov/design-system";
import HeaderContext from "../../templates/Header/HeaderContext";

import "./header-search.scss";

export type HeaderSearchProps = {
  headingText?: string
};

const HeaderSearch = (props: HeaderSearchProps) => {
  const { headingText = "Dataset Search" } = props;
  const navigate = useNavigate();
  const { isMobile } = useContext(HeaderContext);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSearch, setModalSearch] = useState(false);

  function searchForDataset(e: React.SyntheticEvent) {
    e.preventDefault();

    if (window) {
      navigate(`/datasets?fulltext=${modalSearchTerm}`);
      setModalSearch(false);
    }
  }

  return (
    <div className="dkan-c-main-navigation--search">
      <Button
        variation={isMobile ? undefined : 'ghost'}
        className="ds-u-lg-border--0 dkan-c-header-search--modal-button"
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
                value={modalSearchTerm}
                fieldClassName="ds-u-display--inline-block ds-u-margin--0"
                className="ds-l-col--9"
                label="Search Term"
                name="search-modal"
                labelClassName="ds-u-visibility--screen-reader"
                onChange={(e) => {
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
