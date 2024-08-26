import React from 'react';
import { NavbarProps } from './Navbar.types';
import SubMenu from '../SubMenu';
import NavLink from '../NavLink';

const NavBar = ({ links, menuName, menuId, menuClasses, linkClasses, wrapLabel = false, clickHandler }: NavbarProps) => {
  return (
    <nav className={`dc-c-${menuId}-menu`} aria-labelledby={`dc-c-${menuId}-menu--heading`}>
      <h2 id={`dc-c-${menuId}-menu--heading`} className="ds-u-visibility--screen-reader">
        {menuName}
      </h2>
      <ul className={menuClasses}>
        {links.map((link) => {
          if (link.submenu) {
            return (
              <SubMenu key={link.id} link={link} wrapLabel={wrapLabel} linkClasses={linkClasses} />
            );
          } else {
            return (
              <li key={link.id}>
                <NavLink link={link} className={linkClasses} wrapLabel={wrapLabel} clickHandler={clickHandler} />
              </li>
            );
          }
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
