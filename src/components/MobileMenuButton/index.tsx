import React from 'react';
import { Button } from '@cmsgov/design-system';
import HeaderContext from '../../templates/Header/HeaderContext';

const MobileMenuButton = () => {
  const headerContext = React.useContext(HeaderContext);
  return(
    <Button 
      className={`dkan-c-mobile-menu-button dkan-c-mobile-menu-button--${headerContext.mobileMenuOpen ? "close" : "open"}`}
      onClick={() => headerContext.setMobileMenuOpen(!headerContext.mobileMenuOpen)}
    >
      <span className="ds-u-visibility--screen-reader">Menu</span>
    </Button>
  );
}

export default MobileMenuButton;
