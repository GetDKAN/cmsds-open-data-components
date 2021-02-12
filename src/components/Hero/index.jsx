import React from 'react';
import { Button, TextField } from '@cmsgov/design-system';

const Hero = ({title, description, searchUrl, inverse}) => {
  const [searchValue, setSearchValue] = React.useState('');
  return (
    <section className={`dc-c-hero ds-base ds-u-padding--2`}>
      <div className="ds-l-container">
        <h1 class="ds-u-font-size--title">{title}</h1>
        <p>{description}</p>
        <div className="ds-l-form-row ds-u-align-items--stretch">
          <TextField
            label="Search by physician, teaching hospital, or company name"
            labelClassName="ds-u-visibility--screen-reader"
            name="search_text_input"
            className="ds-l-col--10"
            onChange={e => setSearchValue(e.target.value)}
            style={{maxWidth: "none", height: "100%", margin: "0 20px 0 0"}}
          />
          <Button href={`${searchUrl}?search=${searchValue}`} className="ds-u-margin-left--auto ds-l-col--2" variation="default" size="big">
            Search
          </Button>
        </div>
      </div>
    </section>
  )
};

export default Hero;