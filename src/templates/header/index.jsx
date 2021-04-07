import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import NavBar from '../../components/NavBar';
import SearchModal from '../../components/SearchModal';
import cmsLogo from '../../assets/images/CMSGovLogo-O.png';

const Header = ({siteName, links, org, searchModalText, customSearch = false}) => {
  const { url, tagline, logo, urlTitle, logoAltText } = org;
  return (
    <header className="dc-c-header ds-base" aria-label="Site header">
      <div className="dc-c-cmsheader ds-u-display--flex ds-u-padding-x--5 ds-u-align-items--center">
        <div className="ds-l-sm-col--12 ds-l-lg-col--8">
          <div className="cms-link-container">
            <a
              href={url} 
              title={urlTitle}
            >
              <img src={logo} alt={logoAltText} />
            </a>
          </div>
          <div>
            <span className="cms-text-container">{tagline}</span>
          </div>
        </div>
        <div className="ds-u-margin-left--auto">
          <NavBar
            links={links.topnav}
            menuName="CMS Main Header"
            menuId="cmsheader"
            menuClasses="ds-u-display--flex dc-c-header--links ds-u-font-size--small"
          />
        </div>
      </div>
      <div className="dc-c-main-navigation">
        <div className="ds-l-container">
          <div className="ds-l-row ds-u-align-items--center">
            <div className="ds-u-margin-right--5 ds-u-padding-y--3 dc-c-site-title">
              <Link to="/"><span className="ds-h1">{siteName}</span></Link>
            </div>
            <NavBar
              links={links.main}
              wrapLabel
              menuName="CMS Site Main Nav"
              menuId="site"
              menuClasses="ds-u-display--flex dc-c-header--links ds-u-align-items--center"
              linkClasses="ds-u-margin-right--5 ds-u-padding-y--3"
            />
            <div className="dc-c-main-navigation--search ds-u-margin-left--auto ds-u-padding-left--3">
              {customSearch ? (
                customSearch
              ) : (
                <SearchModal
                  searchFunc={(e) => {e.preventDefault(); console.log(e.target.value);}}
                  searchModalText={searchModalText}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.defaultProps = {
  org: {
    tagline: 'The Centers for Medicare and Medicaid Services',
    url: 'https://cms.gov',
    urlTitle: 'CMS.gov Centers for Medicare &amp; Medicaid Services',
    logo: cmsLogo,
    logoAltText: 'CMS.gov Centers for Medicare &amp; Medicaid Services',
  }
}

Header.propTypes = {
  siteName: PropTypes.string.isRequired,
}

export default Header;