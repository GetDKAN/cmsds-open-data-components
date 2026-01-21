import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@cmsgov/design-system';
import { isValidSearch } from '../../templates/DatasetSearch/DatasetSearch';
import './Hero.scss';

const Hero = ({
  title,
  description,
  searchUrl = 'datasets',
  searchKey = 'fulltext',
  textfieldLabel = 'Search for a dataset',
  searchButtonText = 'Search'
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [invalidSearch, setInvalidSearch] = useState(false);

  function submitHero(e) {
    e.preventDefault();

    if (searchValue && isValidSearch(searchValue)) {
      setInvalidSearch(false);

      navigate(`/${searchUrl}?${searchKey}=${searchValue}`);
    } else {
      setInvalidSearch(true);
    }
  }

  return (
    <section className={`dc-c-hero ds-base ds-u-padding--2`}>
      <div className="ds-l-container">
        <div className="ds-l-row">
          <h1 className="ds-text-heading--5xl ds-u-color--white ds-u-margin-y--1">{title}</h1>
          <p className="ds-u-color--white ds-u-measure--wide">{description}</p>
        </div>
        <form onSubmit={(e) => submitHero(e)}>
          <div
            style={{ position: 'relative' }}
            className="ds-l-row ds-u-align-items--stretch ds-u-margin-y--4 ds-u-flex-wrap--nowrap"
          >
            <div
              className="ds-u-padding--0 ds-u-margin-right--1"
              style={{ flex: '1 1 100%', maxWidth: '100%' }}
            >
              <TextField
                errorMessage={invalidSearch ? 'No special characters allowed. Please enter a valid search term.' : undefined}
                errorPlacement='bottom'
                label={textfieldLabel}
                labelClassName="ds-u-visibility--screen-reader"
                name="search_text_input"
                style={{ maxWidth: 'none', height: '61px', margin: '0 20px 0 0' }}
                onChange={(e) => {
                  setInvalidSearch(false);
                  setSearchValue(e.target.value);
                }}
              />
            </div>
            <Button className="ds-u-margin-left--auto" size="big" type="submit" variation="solid" onDark>
              <span className="fas fa-search small-text ds-u-sm-display--none" />
              <span className="full-text ds-u-display--none ds-u-sm-display--inline-block">
                {searchButtonText}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
