import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import { Button } from '@cmsgov/design-system';
import { Link } from '@reach/router';
import SearchModal from '../../components/SearchModal';
import NavBar from '../../components/NavBar';
import cmsLogo from '../../assets/images/CMSGovLogo-O.png'
import cmsLogoWhite from '../../assets/images/CMSgov@2x-white-O.png';

const MobileHeader = ({siteName, links, org, searchModalText, customSearch = false}) => {
  const { url, logo, urlTitle, logoAltText, inverseLogo } = org;

  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useMediaQuery({ minWidth: 0, maxWidth: 543});
  const tablet = useMediaQuery({ minWidth: 544, maxWidth: 1023});
  return (
    <header className={`dc-c-header dc-c-mobile-header ${menuOpen ? 'menu-open' : ''}`} aria-label="Site header">
      <div className={`dc-c-cmsheader ds-u-display--flex ds-u-padding-x--1 ds-u-align-items--center ${mobile ? 'ds-u-justify-content--center' : 'ds-u-justify-content--between'}`}>
        <div className="cms-link-container">
          <a
            href={url}
            title={urlTitle}
          >
            <img src={menuOpen ? inverseLogo : logo} alt={logoAltText} />
          </a>
        </div>
        {tablet
          && (
            <div className="ds-u-margin-left--auto">
              <NavBar
                links={links.topnav}
                menuName="CMS Main Header"
                menuId="cmsheader"
                menuClasses="ds-u-display--flex dc-c-header--links ds-u-font-size--small"
              />
            </div>
          )
        }
      </div>
      <div className="dc-c-main-navigation ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
        <Button
          variation="transparent"
          size="small"
          className="dc-c-mobile-menu--open"
          onClick={() => setMenuOpen(true)}
        >
          {mobile ? <span className="ds-u-visibility--screen-reader">Menu</span> : <>Menu</>}
        </Button>
        <div className="ds-u-padding-y--3 dc-c-site-title">
          <Link to="/"><span className="ds-h1">{siteName}</span></Link>
        </div>
        <div className="dc-c-mobile-menu--search">
          <SearchModal
            buttonSize="small"
            searchFunc={(e) => {e.preventDefault(); console.log(e.target.value);}}
            searchModalText="Search Open Payments for payments made by drug and medical device companies to physicians and teaching hospitals."
          />
        </div>
        
      </div>
      <div className="dc-c-mobile-header--menu">
          <div className="ds-u-display--flex dc-c-mobile-header--menu-close ds-u-justify-content--between">
            <Button
              variation="transparent"
              size="small"
              className="dc-c-mobile-menu--close ds-u-margin-left--1 ds-u-padding-left--0"
              onClick={() => setMenuOpen(false)}
            >
              Close
            </Button>
            {tablet
              && (
                <div className="dc-c-mobile-menu--search">
                {customSearch ? (
                  customSearch
                ) : (
                  <SearchModal
                    searchFunc={(e) => {e.preventDefault(); console.log(e.target.value);}}
                    searchModalText={searchModalText}
                    buttonSize={small}
                  />
                )}
                </div>
              )}
          </div>
          <NavBar
            links={links.main}
            wrapLabel
            menuName="CMS Site Main Nav"
            menuId="site"
            menuClasses="dc-c-header--links dc-c-header--mobile-links"
            linkClasses="ds-u-margin-left--1 ds-u-padding-bottom--2 ds-h5"
          />
          {mobile
          && (
            <div className="cms-mobile-header--container">
              <span></span>
              <NavBar
                links={links.topnav}
                menuName="CMS Main Header"
                menuId="cms-mobile-header"
                linkClasses="ds-u-margin-left--1 ds-u-padding-bottom--2"
                menuClasses="dc-c-header--links ds-u-font-size--small"
              />
            </div>
          )}
        </div>
    </header>
  )
}

MobileHeader.defaultProps = {
  org: {
    tagline: 'The Centers for Medicare and Medicaid Services',
    url: 'https://cms.gov',
    urlTitle: 'CMS.gov Centers for Medicare &amp; Medicaid Services',
    logo: cmsLogo,
    logoAltText: 'CMS.gov Centers for Medicare &amp; Medicaid Services',
    inverseLogo: cmsLogoWhite,
  }
}

export default MobileHeader;
