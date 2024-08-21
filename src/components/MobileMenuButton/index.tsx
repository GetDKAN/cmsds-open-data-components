import React from 'react';
import { Button } from '@cmsgov/design-system';
import HeaderContext from '../../templates/Header/HeaderContext';

import "./mobile-menu-button.scss";

export type MobileMenuButtonProps = {
  wrapperClasses?: string
}

const MobileMenuButton = (props: MobileMenuButtonProps) => {
  const headerContext = React.useContext(HeaderContext);
  const { wrapperClasses } = props;
  return(
    <Button
      aria-haspopup="true"
      aria-expanded={headerContext.mobileMenuOpen}
      className={`dkan-c-mobile-menu-button ${wrapperClasses} dkan-c-mobile-menu-button--${headerContext.mobileMenuOpen ? "close" : "open"}`}
      onClick={() => headerContext.setMobileMenuOpen(!headerContext.mobileMenuOpen)}
    >
      <span>Menu</span>
    </Button>
  );
}

export default MobileMenuButton;
