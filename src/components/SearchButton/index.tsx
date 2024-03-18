import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from '@cmsgov/design-system';

type SearchButtonProps = {
  text?: string;
  altMobileStyle?: boolean;
};

const SearchButton = (props: SearchButtonProps) => {
  const { text, altMobileStyle } = props;
  const sm = useMediaQuery({ minWidth: 0, maxWidth: 768 });
  return (altMobileStyle && sm) ? (
    <Button
      className="ds-u-margin-left--auto ds-u-padding-x--0 ds-c-button--solid dc-c-search-button-mobile"
      size="big"
      type="submit"
      style={{ width: '70px' }}
    >
      <span className="fas fa-search small-text" />
    </Button>
  ) : (
    <Button type="submit" variation="solid" className="ds-l-col--2">
      <span className="fas fa-search small-text ds-u-sm-display--none" />
      <div className="full-text ds-u-display--none ds-u-sm-display--inline-block ds-u-display--flex ds-u-align-items--center">
        <span>{text ? text : 'Search'}</span>
        {` `}
        <span className="fas fa-arrow-right" />
      </div>
    </Button>
  );
};

export default SearchButton;
