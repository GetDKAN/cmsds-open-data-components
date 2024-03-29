import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from '@cmsgov/design-system';
import { NavLink } from 'react-router-dom';
import SearchModal from '../SearchModal';
import NavBar from '../NavBar/Navbar';
import cmsLogo from '../../assets/images/CMSGovLogo-O.png';
import cmsLogoWhite from '../../assets/images/CMSgov@2x-white-O.png';
import './mobile-header.scss';

let mobileHeaderMenuClassName = "dc-c-mobile-header--menu";
const MobileHeader = ({
  siteName,
  links,
  org,
  searchModalText,
  customSearch = false,
  includeTopNav,
  inversedModalButton,
  inversedSearchButton,
  includeSearch,
}) => {
  const { url, logo, urlTitle, logoAltText, inverseLogo } = org;

  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useMediaQuery({ minWidth: 0, maxWidth: 543 });
  const tablet = useMediaQuery({ minWidth: 544, maxWidth: 1023 });
  const menu = useRef(null);
  useEffect(() => {

    const trapFocus = (event, container) => {
      const focusableEls = getFocusableElements(menu.current).selectors.visible;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstEl) {
          lastEl.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          firstEl.focus();
          event.preventDefault();
        }
      }
    }

    function handleFocusIn(event){
      if (!menuOpen) return;
      const mobileHeaderMenu = document.querySelector(`.${mobileHeaderMenuClassName}`);
      if (!mobileHeaderMenu) return
      // Select the first tabbable element in the `mobileHeaderMenu`
      const firstTabbableElement = mobileHeaderMenu.querySelector('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
      if (!firstTabbableElement) return;
      firstTabbableElement.focus();
    }

    function handleClick(event) {
      // Links are wrapped in spans, this checks if the parent is an A, also check if in the search modal.
      if (
        event.target.closest('.dc-c-search-dialog')
      ) {
        setMenuOpen(false);
      }
    }

    function handleMenuClose(event) {
      // Close upon user hitting escape
      if (event.keyCode === 27 && menuOpen) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keyup', handleMenuClose);
    handleFocusIn();
    menu.current.addEventListener('keydown', (evt) => trapFocus(evt, menu.current));

    return () => {
      document.removeEventListener('keyup', handleMenuClose);
      document.removeEventListener('mousedown', handleClick);
      if (menu.current) {
        menu.current.removeEventListener('keydown', trapFocus);
      }
    };
  }, [menuOpen]);

  const getFocusableElements = (container) => {
    const allSelectors = container.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );

    const visibleSelectors = Array.from(allSelectors).filter((el) => {
      return el.offsetWidth > 0 || el.offsetHeight > 0;
    });

    return {
      selectors: {
        all: allSelectors,
        visible: visibleSelectors,
      },
    };
  };

  const handleMobileLinkClick = (e) => {
    if(e.target.closest('a').getAttribute('href') === window.location.pathname)
      setMenuOpen(false);
  }

  return (
    <header
      className={`dc-c-header dc-c-mobile-header ${menuOpen ? 'menu-open' : ''}`}
      aria-label="Site header"
    >
      {includeTopNav && (
        <div
          className={`dc-c-cmsheader ds-u-display--flex ds-u-padding-x--1 ds-u-align-items--center ${
            mobile ? 'ds-u-justify-content--center' : 'ds-u-justify-content--between'
          }`}
        >
          <div className="cms-link-container">
            <a href={url} title={urlTitle}>
              <img src={menuOpen ? inverseLogo : logo} alt={logoAltText} />
            </a>
          </div>

          {tablet && (
            <div className="ds-u-margin-left--auto">
              <NavBar
                links={links.topnav}
                menuName="CMS Main Header"
                menuId="cmsheader"
                menuClasses="ds-u-display--flex ds-u-flex-direction--row dc-c-header--links ds-u-font-size--sm ds-u-margin-bottom--2"
              />
            </div>
          )}
        </div>
      )}
      <div className="dc-c-main-navigation ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
        <Button
          variation="ghost"
          onDark
          size="small"
          className="dc-c-mobile-menu--open"
          onClick={() => setMenuOpen(true)}
        >
          {mobile ? <span className="ds-u-visibility--screen-reader">Menu</span> : <>Menu</>}
        </Button>
        <div className="ds-u-padding-y--3 dc-c-site-title">
          <NavLink className="ds-c-link--inverse ds-text-heading--3xl" to="/">
            <span className="">{siteName}</span>
          </NavLink>
        </div>
        {includeSearch && (
          <div className="dc-c-mobile-menu--search">
            {customSearch ? (
              customSearch
            ) : (
              <SearchModal
                searchFunc={(e) => {
                  e.preventDefault();
                }}
                searchModalText={searchModalText}
                buttonSize={'small'}
                inversedModalButton={inversedModalButton}
                inversedSearchButton={inversedSearchButton}
              />
            )}
          </div>
        )}
      </div>
      <div className={mobileHeaderMenuClassName} data-testid="mobile-menu" ref={menu}>
        <div className={`ds-u-display--flex ${mobileHeaderMenuClassName}-close ds-u-justify-content--between`}>
          <Button
            variation="ghost"
            onDark
            size="small"
            className="dc-c-mobile-menu--close ds-u-margin-left--1 ds-u-padding-left--0"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </Button>
          {tablet && includeSearch && (
            <div className="dc-c-mobile-menu--search">
              {customSearch ? (
                customSearch
              ) : (
                <SearchModal
                  searchFunc={(e) => {
                    e.preventDefault();
                  }}
                  searchModalText={searchModalText}
                  buttonSize={'small'}
                />
              )}
            </div>
          )}
        </div>
        <NavBar
          links={links.main}
          wrapLabel
          menuName="Main Nav"
          menuId="site"
          menuClasses="dc-c-header--links dc-c-header--mobile-links"
          linkClasses="ds-u-margin-left--1 ds-u-padding-bottom--2 ds-text-heading--md"
          clickHandler={handleMobileLinkClick}
        />
        {mobile && (
          <div className="cms-mobile-header--container">
            <span></span>
            <NavBar
              links={links.topnav}
              menuName="CMS Main Header"
              menuId="cms-mobile-header"
              linkClasses="ds-u-margin-left--1 ds-u-margin-bottom--2"
              menuClasses="dc-c-header--links ds-u-font-size--sm ds-u-margin-bottom--2"
            />
          </div>
        )}
      </div>
    </header>
  );
};

MobileHeader.defaultProps = {
  org: {
    tagline: 'The Centers for Medicare and Medicaid Services',
    url: 'https://cms.gov',
    urlTitle: 'CMS.gov Centers for Medicare &amp; Medicaid Services',
    logo: cmsLogo,
    logoAltText: 'CMS.gov Centers for Medicare &amp; Medicaid Services',
    inverseLogo: cmsLogoWhite,
  },
  includeTopNav: true,
  includeSearch: true,
};

export default MobileHeader;
