import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, CloseIconThin } from '@cmsgov/design-system';
import HeaderContext from '../../templates/Header/HeaderContext';
import SubMenu from '../SubMenu';
import { NavLinkArray } from '../../templates/Header';
import HeaderSearch from '../HeaderSearch';
import './header-nav.scss';

export type HeaderNavProps = {
  links: NavLinkArray[];
  topNavLinks?: NavLinkArray[];
  searchInMobile?: boolean;
  wrapperClasses?: string;
}

const HeaderNav = (props: HeaderNavProps) => {
  const headerContext = React.useContext(HeaderContext);
  const { links, topNavLinks, wrapperClasses, searchInMobile } = props;
  const navMenuOpenClass = `dkan-c-nav-menu--${headerContext.mobileMenuOpen ? "open" : "close"}`;
  const isMobileClass = `dkan-c-nav-menu--${headerContext.isMobile ? 'mobile' : 'desktop'}`;
  const linkClasses = 'dkan-c-header--link ds-c-button ds-c-button--ghost';
  const listClasses= 'dkan-c-header--link-list ';
  return(
    <div 
      className={`dkan-c-nav-menu ${wrapperClasses} ${navMenuOpenClass} ${isMobileClass}`} 
      ref={headerContext.menuRef}
    >
      <Button 
        variation='ghost'
        onDark
        className='dkan-c-nav-menu--mobile-close-button'
        onClick={() => headerContext.setMobileMenuOpen(false)}
      >
        <CloseIconThin />
        <span className="ds-u-margin-left--1">Close</span>
      </Button>
      <nav className='dkan-c-main-nav'>
        <ul className={listClasses}>
          {links.map((link: any) => {
            if (link.submenu) {
              return (
                <SubMenu
                  key={link.id}
                  link={link}
                  wrapLabel={true}
                  subLinkClasses={linkClasses}
                  linkClasses={linkClasses}
                />
              )
            }
            return(
              <li>
                <NavLink to={link.url} className={linkClasses}>
                  <span>{link.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      {topNavLinks &&
        <nav className='dkan-c-top-nav'>
          <ul className={listClasses}>
            {topNavLinks.map((link: any) => {
              return(
                <li>
                  <NavLink to={link.url} className={linkClasses}>
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      }
      {searchInMobile &&
        <HeaderSearch />
      }
    </div>
  );
}

export default HeaderNav;
