import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Button, Dialog, TextField } from '@cmsgov/design-system';

const SearchModal = ({
  searchFunc,
  appNodeId,
  headingText,
  searchModalText,
  buttonSize,
  inversedModalButton,
  inversedSearchButton,
}) => {
  const navigate = useNavigate();
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSearch, setModalSearch] = useState(false);
  const mobile = useMediaQuery({ minWidth: 0, maxWidth: 543 });

  function searchForDataset(e) {
    e.preventDefault();
    if (window) {
      if (window.location.pathname !== '/datasets') {
        navigate(`/datasets?fulltext=${modalSearchTerm}`);
      } else {
        window.location.search = `fulltext=${modalSearchTerm}`;
        setModalSearch(false);
      }
    }
  }

  return (
    <>
      <Button
        variation="ghost"
        onDark={inversedSearchButton}
        size={buttonSize}
        className="ds-u-border--0 dc-c-search-modal--button"
        onClick={() => setModalSearch(true)}
      >
        {mobile ? <span className="ds-u-visibility--screen-reader">Search</span> : <>Search</>}
      </Button>
      {modalSearch && (
        <Dialog
          className="dc-c-search-dialog"
          onExit={() => setModalSearch(false)}
          getApplicationNode={() => document.getElementById(appNodeId)}
          closeButtonText={<>Close</>}
          heading={`${headingText}`}
        >
          {searchModalText &&
            <p>{searchModalText}</p>
          }
          <form
            className="ds-u-display--flex ds-u-align-items--stretch ds-u-flex-wrap--nowrap"
            onSubmit={(e) => {
              searchForDataset(e);
            }}
          >
            <TextField
              value={modalSearchTerm}
              fieldClassName="ds-u-display--inline-block"
              className="ds-l-col--9"
              label="Search Term"
              name="search-modal"
              labelClassName="ds-u-visibility--screen-reader"
              onChange={(e) => setModalSearchTerm(e.target.value)}
            />
            <Button type="submit" className="ds-l-col--3">
              <span className="fas fa-search small-text ds-u-sm-display--none" />
              <span className="full-text ds-u-display--none ds-u-sm-display--inline-block">
                Search
              </span>
            </Button>
          </form>
        </Dialog>
      )}
    </>
  );
};

SearchModal.defaultProps = {
  appNodeId: 'App',
  buttonSize: null,
  inversedModalButton: true,
  inversedSearchButton: true,
  headingText: "Dataset Search"
};

export default SearchModal;
