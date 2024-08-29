import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button, ArrowIcon } from '@cmsgov/design-system';
import { MenuLinkType } from '../../types/misc';
import './sidebar-navigation.scss';

type SidebarNavigationProps = {
  title: string;
  links: MenuLinkType[];
  mobileMax: boolean;
}

const SidebarNavigation = (props: SidebarNavigationProps) => {
  const { title, links, mobileMax } = props;
  const active = useLocation().pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const styleClasses = 'dkan-c--sidebar-nav-wrapper ds-u-border--1 ds-u-border--color-gray-lightest ds-u-padding--2';
  const mobileClass = `dkan-c-sidebar-nav--${mobileMax ? 'mobile' : 'desktop'}`
  return(
    <div className={`dkan-c-sidebar-nav ${mobileClass}`}>
      <div className='dkan-c-sidebar-nav--mobile-header ds-u-display--flex ds-u-align-items--center ds-u-justify-content--between ds-u-padding-y--2 ds-u-fill--primary-darker ds-u-color--white'>
        <span className="ds-u-margin-left--2 ds-u-margin-y--0 ds-text-heading--xl">Pages in this section</span>
        <Button
          aria-haspopup="true"
          variation='ghost'
          aria-expanded={`${menuOpen ? 'true' : 'false'}`}
          onDark
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="ds-u-visibility--screen-reader">Toggle menu</span>
          <ArrowIcon direction={menuOpen ? 'up' : 'down'} />
        </Button>
      </div>
      <div className={``}>
        <nav className={`${styleClasses} dkan-c-sidebar-nav-menu dkan-c-sidebar-nav-menu--${menuOpen ? 'open' : 'close'}`}>
          <div className="ds-u-padding--2 ds-u-border-bottom--1 ds-u-border--color-gray-lightest">
            <h3 className="ds-text-heading--lg">{ title }</h3>
          </div>
          <ul className="ds-u-padding-bottom--2">
            {links.map(({ url, label }) => (
              <li
                className={`ds-u-padding--1 ds-u-padding-top--2 ds-u-border-bottom--1 ds-u-border--color-gray-lightest ${
                  active === url ? 'active' : ''
                }`}
                key={`${url}${label}`}
              >
                <div className="ds-u-display--flex ds-u-padding-y--1">
                  <div className="dkan-c-sidebar-nav-link-status"></div>
                  <NavLink to={url} className="dkan-c-sidebar-nav-link ds-u-margin-left--2">
                    {label}
                  </NavLink>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

};

export default SidebarNavigation;
