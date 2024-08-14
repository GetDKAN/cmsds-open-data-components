import React from 'react';
import { NavLink } from 'react-router-dom';
import HeaderContext from '../../templates/Header/HeaderContext';
import SubMenu from '../SubMenu';
import { NavLinkArray } from '../../templates/Header';
import './header-nav.scss';

export type HeaderNavProps = {
  links: NavLinkArray[],
  topNavLinks?: NavLinkArray[]
}

const HeaderNav = (props: HeaderNavProps) => {
  const headerContext = React.useContext(HeaderContext);
  const { links, topNavLinks } = props;


  // const handleMenuEsc = (e: KeyboardEvent) => {
  //   if (e.key === 'Escape') {
  //     e.preventDefault();

  //     setMenuOpen(false);
  //   }
  // };



  return(
    <div className={`dkan-c-nav-menu dkan-c-nav-menu--${headerContext.mobileMenuOpen ? "open" : "close"}`}>
      <nav
        className='dkan-c-main-nav'
        style={{
          "--mobile-nav-top-offset": headerContext.navTop
        } as React.CSSProperties}
      >
        <ul className="ds-u-display--flex dc-c-header--links ds-u-justify-content--start ds-u-align-items--center ds-u-flex-direction--row">
          {links.map((link: any) => {
            if (link.submenu) {
              return (
                <SubMenu
                  key={link.id}
                  link={link}
                  wrapLabel={""}
                  subLinkClasses={""}
                  linkClasses={''}
                />
              )
            }
            return(
              <li>
                <NavLink to={link.url} className="ds-c-button ds-c-button--on-dark ds-c-button--ghost ds-u-xl-margin-right--4 ds-u-margin-right--3 ds-u-padding-y--3">
                  <span>{link.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      {topNavLinks &&
        <nav className='dkan-c-top-nav'>
          <ul>
            {topNavLinks.map((link: any) => {
              return(
                <NavLink to={link.url} className="ds-c-button ds-c-button--on-dark ds-c-button--ghost ds-u-xl-margin-right--4 ds-u-margin-right--3 ds-u-padding-y--3">
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </ul>
        </nav>
      }
    </div>
  );
}

export default HeaderNav;
