import { Button } from "@cmsgov/design-system";
import { useMediaQuery } from "react-responsive";

const ClearFiltersButton = ({disabled = false, clearFiltersFn} : { disabled?: boolean, clearFiltersFn: Function}) => {
  const small = useMediaQuery({ minWidth: 0, maxWidth: 544 });
  return (
    <Button
      disabled={disabled}
      className="ds-u-float--right ds-l-md-col--6 ds-l-col--5"
      variation={small ? 'ghost' : undefined}
      onClick={() => clearFiltersFn()}
    >
      {small ? 'Clear all' : 'Clear all filters'}
    </Button>
  )
}

export default ClearFiltersButton;