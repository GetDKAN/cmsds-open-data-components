import React, { ReactElement} from 'react';
import CMSTopNav from '../../components/CMSTopNav';
import HeaderSiteTitle from '../../components/HeaderSiteTitle';
import HeaderSearch from '../../components/HeaderSearch';
import MobileMenuButton from '../../components/MobileMenuButton';
import HeaderNav from '../../components/HeaderNav';
import HeaderContext from './HeaderContext';

import "./header.scss";

export type OrgType = {
  url: string;
  tagline: string;
  urlTitle: string;
  logoAltText?: string;
  logoFilePath?: string;
};

type HeaderProps = {
  // siteName: string;
  // headerClasses: string;
  // linkClasses: string;
  // links: any;
  // org: OrgType;
  // inverse?: boolean
  org: OrgType;
  topNav?: ReactElement<typeof CMSTopNav>;
  headerSiteTitle: ReactElement<typeof HeaderSiteTitle>
  mobileMenuButton?: ReactElement<typeof MobileMenuButton>
  headerNav: ReactElement<typeof HeaderNav>
  headerSearch?: ReactElement<typeof HeaderSearch>
};

export type NavLinkArray = {
  id: string;
  label: string;
  url: string;
  target?: string;
  submenu?: NavLinkArray[]
}



const Header = (props: HeaderProps) => {
  const { org, topNav, headerSiteTitle, mobileMenuButton, headerNav, headerSearch } = props;
  

  // const { headerClasses, linkClasses, links, org, inverse } = props;
  // const { logoAltText, logoFilePath, urlTitle, url } = org;
  // const headerClassString = headerClasses ?? 'dc-c-header ds-base';

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navTop = '128px';

  return (
    <HeaderContext.Provider value={{
      mobileMenuOpen,
      setMobileMenuOpen,
      navTop
    }}>
      <header aria-label="Site header" className="dkan-c-header">
        {topNav && topNav}
        <div className="dkan-c-main-navigation print-margin-left--2">
          <div className="ds-l-container">
            <div className="ds-u-display--flex ds-u-align-items--center">
              {mobileMenuButton ? mobileMenuButton : <MobileMenuButton />}
              <div className="ds-u-padding-y--3 dc-c-site-title print-padding-top--0 print-padding-bottom--0 ds-u-text-align--center ds-u-md-text-align--left">
                {headerSiteTitle}
            </div>
            <div className={`nav-container--${mobileMenuOpen ? "open" : "close"}`}>
              {headerNav}
            </div>
            {headerSearch &&
              headerSearch
            }
          </div>
        </div>
      </div>
      </header>
    </HeaderContext.Provider>
  );
};

export default Header;
