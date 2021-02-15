import React from 'react';
import { Button, TextField } from '@cmsgov/design-system';

const Hero = ({title, description, searchUrl}) => {
  const [searchValue, setSearchValue] = React.useState('');
  return (
    <section className={`dc-c-hero ds-base ds-u-padding--2`}>
      <div className="ds-l-container">
        <div className="ds-l-row">
          <h1 className="ds-u-font-size--display ds-u-color--white ds-u-margin-y--1">{title}</h1>
          <p className="ds-u-color--white ds-u-measure--wide">{description}</p>
        </div>
        <div className="ds-l-row ds-u-align-items--stretch ds-u-margin-y--4 ds-u-md-flex-wrap--nowrap ds-u-flex-wrap--wrap">
          <TextField
            label="Search by physician, teaching hospital, or company name"
            labelClassName="ds-u-visibility--screen-reader"
            name="search_text_input"
            className="ds-l-col--12 ds-l-md-col--10 ds-u-padding--0 ds-u-md-margin-right--1"
            onChange={e => setSearchValue(e.target.value)}
            style={{maxWidth: "none", height: "61px", margin: "0 20px 0 0"}}
          />
          <Button href={`${searchUrl}?search=${searchValue}`} className="ds-u-margin-left--auto ds-l-col--12 ds-l-md-col--auto ds-u-margin-top--2 ds-u-md-margin-top--0" variation="default" size="big">
            Search
          </Button>
        </div>
      </div>
    </section>
  )
};

export default Hero;