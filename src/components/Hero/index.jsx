import React from 'react';
import { navigate } from '@reach/router';
import { Button, TextField } from '@cmsgov/design-system';

const Hero = ({title, description, searchUrl, searchKey, textfieldLabel, searchButtonText}) => {
  const [searchValue, setSearchValue] = React.useState('');

  function submitHero(e) {
    e.preventDefault();
    navigate(`/${searchUrl}?${searchKey}=${searchValue}`)
  }

  return (
    <section className={`dc-c-hero ds-base ds-u-padding--2`}>
      <div className="ds-l-container">
        <div className="ds-l-row">
          <h1 className="ds-text-heading--5xl ds-u-color--white ds-u-margin-y--1">{title}</h1>
          <p className="ds-u-color--white ds-u-measure--wide">{description}</p>
        </div>
        <form
          onSubmit={(e) => submitHero(e)}
          className="ds-l-row ds-u-align-items--stretch ds-u-margin-y--4 ds-u-md-flex-wrap--nowrap ds-u-flex-wrap--wrap"
        >
          <div style={{position: 'relative'}} className="ds-l-row ds-u-align-items--stretch ds-u-margin-y--4 ds-u-flex-wrap--nowrap">
            <div className="ds-u-padding--0 ds-u-margin-right--1" style={{flex: "1 1 100%", maxWidth: "100%"}}>
              <TextField
                label={textfieldLabel}
                labelClassName="ds-u-visibility--screen-reader"
                name="search_text_input"
                style={{maxWidth: "none", height: "61px", margin: "0 20px 0 0"}}
                onChange={e => setSearchValue(e.target.value)}
              />
            </div>
            <Button className="ds-u-margin-left--auto" size="big" type="submit">
              <span className="fas fa-search small-text ds-u-sm-display--none" />
              <span className="full-text ds-u-display--none ds-u-sm-display--inline-block">{searchButtonText}</span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
};

Hero.defaultProps = {
  searchKey: 'fulltext',
  searchUrl: 'datasets',
  textfieldLabel: 'Search for a dataset',
  searchButtonText: 'Search'
}

export default Hero;