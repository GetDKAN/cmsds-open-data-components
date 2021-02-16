import React, { useState } from 'react';
import { Button } from '@cmsgov/design-system';
import NavLink from '../NavLink';

const SubMenu = ({link, linkClasses, wrapLabel}) => {
  const [isExpanded, setIsExapanded] = useState(false);
  const innerHtml = wrapLabel ? <span>{link.label}</span> : link.label;
  return (
    <li
      className={`has-submenu ${isExpanded ? "open" : ""}`}
    >
      <Button
        size="small"
        variation="transparent"
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