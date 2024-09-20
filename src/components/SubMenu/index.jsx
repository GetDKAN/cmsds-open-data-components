import React, { useEffect, useState, useRef } from 'react';
import { Button, ArrowIcon } from '@cmsgov/design-system';
import { NavLink } from 'react-router-dom';
import HeaderContext from '../../templates/Header/HeaderContext';

import './submenu.scss';

const SubMenu = ({ link, linkClasses, subLinkClasses, wrapLabel = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const headerContext = React.useContext(HeaderContext);
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
        onDark={headerContext.onDark}
        className={`${linkClasses}`}
        aria-haspopup="true"
        aria-expanded={isExpanded}
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
      >
        {innerHtml}
        <ArrowIcon className="ds-u-margin-left--1" direction={isExpanded ? "down" : "right"} />
      </Button>
      <ul className="dkan-c-site-menu--sub-menu">
        {link.submenu.map((s) => (
          <li key={s.id}>
            {s.external || s.drupalPage ? (
              <a href={s.url} className={`ds-u-display-flex ds-u-align-items--center ${subLinkClasses}`}>
                {s.icon ?? null}
                <span>{s.label}</span>
              </a>
            ) : (
              <NavLink
                to={s.url}
                className={`ds-u-display-flex ds-u-align-items--center ${subLinkClasses}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {s.icon ?? null}
                <span>
                  {s.label}
                </span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default SubMenu;
