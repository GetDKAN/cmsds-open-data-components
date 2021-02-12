import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import { Button, Dialog, TextField } from '@cmsgov/design-system';

const SearchModal = ({ searchFunc, appNodeId, informationText, buttonSize }) => {
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSearch, setModalSearch] = useState(false)
  const mobile = useMediaQuery({ minWidth: 0, maxWidth: 543});
  return (
    <>
      <Button
        variation="transparent"
        inversed
        size={buttonSize}
        className="ds-u-border--0 dc-c-search-modal--button"
        onClick={() => setModalSearch(true)}
      >
        {mobile ? <span className="ds-u-visibility--screen-reader">Search</span> : <>Search</>}
      </Button>
      {modalSearch
        && (
          <Dialog
            className="dc-c-search-dialog"
            onExit={() => setModalSearch(false)}
            getApplicationNode={() => document.getElementById(appNodeId)}
            closeButtonVariation="primary"
            closeText={<>Close</>}
          >
            <p>{informationText}</p>
            <form className="ds-l-row" onSubmit={searchFunc}>
              <TextField
                className="ds-l-sm-col--12 ds-l-lg-col--9"
                label="Search Term"
                name="search-modal"
                labelClassName="ds-u-visibility--screen-reader"
                onChange={(e) => setModalSearchTerm(e.target.value)}
              />
              <Button
                type="submit"
                inversed
              >
                Search
              </Button>
            </form>
          </Dialog>
        )}
    </>
    
  )
}

SearchModal.defaultProps = {
  appNodeId: 'App',
  buttonSize: ''
}

export default SearchModal;