import React from "react";
import { Button } from "@cmsgov/design-system";
import { useMediaQuery } from "react-responsive";

import "./ClearFiltersButton.scss";

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
      aria-disabled={disabled || undefined}
      className={`dkan-clear-dataset-filters-button ${disableDefaultClasses ? '' : ' ds-u-float--right ds-l-md-col--6 ds-l-col--5'}${className !== '' ? ` ${className}` : ''}`}
      variation={small ? 'ghost' : undefined}
      onClick={() => { if (!disabled) clearFiltersFn(); }}
    >
      Reset
    </Button>
  )
}

export default ClearFiltersButton;