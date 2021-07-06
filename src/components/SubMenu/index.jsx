import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@cmsgov/design-system';
import NavLink from '../NavLink';

const SubMenu = ({link, linkClasses, wrapLabel}) => {
  const [isExpanded, setIsExapanded] = useState(false);
  const innerHtml = wrapLabel ? <span>{link.label}</span> : link.label;
  const menu = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menu.current && !menu.current.contains(event.target)) {
        setIsExapanded(false);
      }
    }
    function handleFocusOut(event) {
      if (!menu.current.contains(event.relatedTarget)) {
        setIsExapanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    menu.current.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      menu.current.removeEventListener("focusout", handleFocusOut);
    };
  }, [menu, isExpanded]);

  return (
    <li
      className={`has-submenu ${isExpanded ? "open" : ""}`}
      ref={menu}
    >
      <Button
        size="small"
        variation="transparent"
        inverse={true}
        className={linkClasses}
        aria-haspopup="true"
        aria-expanded={isExpanded}
        onClick={(e) => {e.preventDefault(); setIsExapanded(!isExpanded);}}
      >
        {innerHtml}
      </Button>
      <ul className="dc-c-site-menu--sub-menu">
        {link.submenu.map((s) => (
          <li key={s.id}>
            <NavLink
              link={s}
              wrapLabel={wrapLabel}
            />
          </li>
        ))}
      </ul>
    </li>
  )
}

export default SubMenu;