import React, { useEffect, ReactNode, ReactElement, useRef } from 'react';
import { useMediaQuery } from 'react-responsive'
import CMSTopNav from '../../components/CMSTopNav';
import HeaderContext from './HeaderContext';

import "./header.scss";

type HeaderProps = {
  topNav?: ReactElement<typeof CMSTopNav>;
  children: ReactNode;
  mobileMaxWidth?: number;
  onDark?: boolean;
};

export type NavLinkArray = {
  id: string;
  label: string;
  url: string;
  target?: string;
  submenu?: NavLinkArray[];
  icon?: ReactNode;
  drupalPage?: boolean;
}

const Header = (props: HeaderProps) => {
  const { topNav, children, mobileMaxWidth = 768, onDark = false } = props;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const mobileMax = useMediaQuery({ query: `(max-width: ${mobileMaxWidth}px)` });
  const menu = useRef<HTMLDivElement>(null);

  function closeMobileMenu() {
    const mobileMenuButtonElement = document.querySelector('.dkan-c-mobile-menu-button');
    if (!mobileMenuButtonElement) {
      return;
    }
    (mobileMenuButtonElement as HTMLElement).focus();
  }

  // Close mobile menu with escape.
  function handleMenuClose(event: KeyboardEvent) {
    if (event.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  function handleClick(event: MouseEvent) {
    // Links are wrapped in spans, this checks if the parent is an A, also check if in the search modal.    
    if (mobileMenuOpen && menu.current && !menu.current.contains(event.target as HTMLElement)) {
      setMobileMenuOpen(false);
      closeMobileMenu()
    }
  }

  const getFocusableElements = (container: HTMLElement) => {
    const allSelectors = container.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );

    const visibleSelectors = Array.from(allSelectors).filter((el: any) => {
      return el.offsetWidth > 0 || el.offsetHeight > 0;
    });

    return {
      selectors: {
        all: allSelectors,
        visible: visibleSelectors,
      },
    };
  };

  function handleFocusIn(){
    if (menu.current) {
      if (!mobileMenuOpen) return;
      const focusableEls = getFocusableElements(menu.current).selectors.visible;
      
      if (focusableEls.length <= 0) return;
      const firstEl = focusableEls[0];
      (firstEl as HTMLElement)?.focus();
    }
    
  }

  const trapFocus = (event: KeyboardEvent) => {
    if(menu.current && mobileMenuOpen) {
      const focusableEls = getFocusableElements(menu.current).selectors.visible;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstEl) {
          (lastEl as HTMLElement)?.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          (firstEl as HTMLElement)?.focus();
          event.preventDefault();
        }
      }
    }
    
  }

  useEffect(() => {
    document.addEventListener('keyup', handleMenuClose);
    document.addEventListener('mousedown', handleClick);
    if(mobileMenuOpen) {
      handleFocusIn();
    } else {
      closeMobileMenu()
    }
    
    if (menu.current) {
      menu.current.addEventListener('keydown', (evt) => trapFocus(evt));
    }
    
    return () => {
      document.removeEventListener('keyup', handleMenuClose);
      document.addEventListener('mousedown', handleClick);
      if (menu.current) {
        menu.current.removeEventListener('keydown', trapFocus);
      }
    }

  }, [mobileMenuOpen]);

  return (
    <HeaderContext.Provider value={{
      mobileMenuOpen,
      setMobileMenuOpen,
      menuRef: menu,
      isMobile: mobileMax,
      onDark: onDark,
    }}>
      <header aria-label="Site header" className={`dkan-c-header dkan-c-header--${mobileMax ? 'mobile' : 'desktop'}`}>
        {topNav && topNav}
        <div className="dkan-c-main-navigation print-margin-left--2">
          <div className="ds-l-container">
            <div className="dkan-c-header--wrapper ds-l-row ds-u-align-items--center">
              { children }
            </div>
          </div>
        </div>
      </header>
    </HeaderContext.Provider>
  );
};

export default Header;
