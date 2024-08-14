import { useEffect, useState, useRef } from 'react';
import { Button } from '@cmsgov/design-system';
import { NavLink } from 'react-router-dom';

import './submenu.scss';

const SubMenu = ({ link, linkClasses, subLinkClasses, wrapLabel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const innerHtml = wrapLabel ? <span>{link.label}</span> : link.label;
  const menu = useRef();
  useEffect(() => {
    let currentMenu = null;
    if (menu.current) {
      currentMenu = menu.current;
    }
    function handleClickOutside(event) {
      if (currentMenu && !currentMenu.contains(event.target)) {
        setIsExpanded(false);
      }
    }
    function handleFocusOut(event) {
      if (currentMenu && !currentMenu.contains(event.relatedTarget)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    currentMenu?.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (currentMenu) {
        currentMenu.removeEventListener('focusout', handleFocusOut);
      }
    };
  }, [isExpanded]);

  return (
    <li className={`dkan-c-nav-submenu has-submenu${isExpanded ? ' open' : ''}`} ref={menu}>
      <Button
        variation="ghost"
        onDark
        className={`${linkClasses} ds-u-margin-right--3 ds-u-padding-y--3`}
        aria-haspopup="true"
        aria-expanded={isExpanded}
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
      >
        {innerHtml}
      </Button>
      <ul className="dc-c-site-menu--sub-menu">
        {link.submenu.map((s) => (
          <li key={s.id}>
            {s.external ? (
              <a href={s.url} className={subLinkClasses}>
                {s.label}
              </a>
            ) : (
              <NavLink
                to={s.url}
                className={subLinkClasses}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {s.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default SubMenu;
