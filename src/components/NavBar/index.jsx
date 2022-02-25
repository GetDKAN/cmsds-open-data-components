import React from 'react';
import SubMenu from '../SubMenu';
import NavLink from '../NavLink';

const NavBar = ({ links, menuName, menuId, menuClasses, linkClasses, wrapLabel }) => {
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
                <NavLink link={link} className={linkClasses} wrapLabel={wrapLabel} />
              </li>
            );
          }
        })}
      </ul>
    </nav>
  );
};

NavBar.defaultProps = {
  wrapLabel: false,
};

export default NavBar;
