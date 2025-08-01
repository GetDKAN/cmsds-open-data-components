import React from "react";
import { Button } from "@cmsgov/design-system";
import { useMediaQuery } from "react-responsive";

const ClearFiltersButton = ({
  disabled = false,
  clearFiltersFn,
  disableDefaultClasses = false,
  className = ''
} : { 
  disabled?: boolean,
  clearFiltersFn: Function,
  disableDefaultClasses?: boolean,
  className?: string
}) => {
  const small = useMediaQuery({ minWidth: 0, maxWidth: 544 });
  return (
    <Button
      disabled={disabled}
      className={`${disableDefaultClasses ? '' : 'ds-u-float--right ds-l-md-col--6 ds-l-col--5'}${className !== '' ? ` ${className}` : ''}`}
      variation={small ? 'ghost' : undefined}
      onClick={() => clearFiltersFn()}
    >
      {small ? 'Clear all' : 'Clear all filters'}
    </Button>
  )
}

export default ClearFiltersButton;