import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import NavBar from '../../components/NavBar';
import SearchModal from '../../components/SearchModal';
import cmsLogo from '../../assets/images/CMSGovLogo-O.png';

const Header = ({siteName, links}) => {
  return (
    <header className="dc-c-header ds-base" aria-label="Site header">
      <div className="dc-c-cmsheader ds-u-display--flex ds-u-padding-x--5 ds-u-align-items--center">
        <div className="ds-l-sm-col--12 ds-l-lg-col--8">
          <div className="cms-link-container">
            <a
              href="https://cms.gov" 
              title="CMS.gov Centers for Medicare &amp; Medicaid Services"
            >
              <img src={cmsLogo} alt="CMS.gov Centers for Medicare &amp; Medicaid Services" />
            </a>
          </div>
          <div>
            <span className="cms-text-container">The Centers for Medicare and Medicaid Services</span>
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
              <SearchModal
                searchFunc={(e) => {e.preventDefault(); console.log(e.target.value);}}
                informationText="Search Open Payments for payments made by drug and medical device companies to physicians and teaching hospitals."
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  siteName: PropTypes.string.isRequired,
}

export default Header;
