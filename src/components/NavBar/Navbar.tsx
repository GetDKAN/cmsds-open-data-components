import SubMenu from '../SubMenu';
import { NavLink } from 'react-router-dom';
import { NavbarProps } from './Navbar.types';
import './navbar.scss';

const NavBar = (props: NavbarProps) => {
  const { links, menuName, menuId, menuClasses, linkClasses, subLinkClasses, wrapLabel = false } = props;
  return (
    <nav className={`dkan-c-${menuId}-menu`} aria-labelledby={`dkan-c-${menuId}-menu--heading`}>
      <h2 id={`dkan-c-${menuId}-menu--heading`} className="ds-u-visibility--screen-reader">
        {menuName}
      </h2>
      <ul className={menuClasses}>
        {links.map((link) => {
          if (link.submenu) {
            return (
              <SubMenu
                key={link.id}
                link={link}
                wrapLabel={wrapLabel}
                subLinkClasses={subLinkClasses}
                linkClasses={linkClasses}
              />
            );
          } else {
            return (
              <li key={link.id}>
                <NavLink to={link} className={linkClasses}>
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          }
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
