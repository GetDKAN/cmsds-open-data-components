import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuLinkType } from '../../types/misc';
import './sidebar-navigation.scss';

type SidebarNavigationProps = {
  title: string,
  links: MenuLinkType[]
}

const SidebarNavigation = (props: SidebarNavigationProps) => {
  const { title, links } = props;
  const active = useLocation().pathname;
  return(
    <div className="dkan-c-sidebar-nav ds-u-border--1 ds-u-border--color-gray-lightest ds-u-padding--2">
      <nav>
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
  );

};

export default SidebarNavigation;
