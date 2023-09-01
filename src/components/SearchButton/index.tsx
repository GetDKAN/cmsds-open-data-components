import { Button } from '@cmsgov/design-system';

type SearchButtonProps = {
  text?: string;
};

const SearchButton = (props: SearchButtonProps) => {
  const { text } = props;

  return (
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
