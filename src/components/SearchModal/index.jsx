import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Button, Dialog, TextField } from '@cmsgov/design-system';

let mobileSearchClassName = "dc-c-search-dialog";

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
  const mobileSearch = useRef(null);

  useEffect(() => {

    const trapFocus = (event, container) => {
      const focusableEls = getFocusableElements(container).selectors.visible;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstEl) {
          lastEl.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          firstEl.focus();
          event.preventDefault();
        }
      }
    }

    function handleFocusIn(event){
      if (!modalSearch) return;
      const mobileHeaderSearch = document.querySelector(`.${mobileSearchClassName}`);
      if (!mobileHeaderSearch) return
      // Select the first tabbable element in the `mobileHeaderSearch`
      const firstTabbableElement = mobileHeaderSearch.querySelector('input');
      if (!firstTabbableElement) return;
      firstTabbableElement.focus();
    }

    function handleSearchClose(event) {
      // Close upon user hitting escape
      if (event.keyCode === 27 && modalSearch) {
        setModalSearch(false);
      }
    }

    document.addEventListener('keyup', handleSearchClose);
    handleFocusIn();
    //mobileSearch.current.addEventListener('keydown', (evt) => trapFocus(evt, mobileSearch.current));

    return () => {
      document.removeEventListener('keyup', handleSearchClose);
      if (mobileSearch.current) {
        mobileSearch.current.removeEventListener('keydown', trapFocus);
      }
    };
  }, [modalSearch]);

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

  const getFocusableElements = (container) => {
    const allSelectors = container.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );

    const visibleSelectors = Array.from(allSelectors).filter((el) => {
      return el.offsetWidth > 0 || el.offsetHeight > 0;
    });

    return {
      selectors: {
        all: allSelectors,
        visible: visibleSelectors,
      },
    };
  };

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
          className={mobileSearchClassName}
          onExit={() => setModalSearch(false)}
          heading={`${headingText}`}
          ref={mobileSearch}
          actions= {<>
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
          </>}
        />
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
