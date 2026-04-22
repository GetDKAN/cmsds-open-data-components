import React, { ReactElement, ReactNode, useEffect, useState, useRef } from 'react';
import { Button, ArrowIcon } from '@cmsgov/design-system';
import HeaderContext from '../../templates/Header/HeaderContext';
import DatasetListSubmenu from '../DatasetListSubmenu';
import { NavLinkArray } from '../../types/misc';
import { DatasetSubmenuListProps } from '../../types/search';

import './submenu.scss';
import SubMenuStaticList from '../SubMenuStaticList';

export type SubMenuProps = {
  link: NavLinkArray;
  linkClasses?: string;
  subLinkClasses?: string;
  wrapLabel?: boolean;
};

const SubMenu = ({ link, linkClasses, subLinkClasses, wrapLabel = true }: SubMenuProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const headerContext = React.useContext(HeaderContext);
  const innerHtml: ReactNode = wrapLabel ? <span>{link.label}</span> : link.label;
  const menu = useRef<HTMLLIElement>(null);
  useEffect(() => {
    let currentMenu: HTMLLIElement | null = null;
    if (menu.current) {
      currentMenu = menu.current;
    }

    function handleClickOutside(event: MouseEvent) {
      if (currentMenu && !currentMenu.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    function handleFocusOut(event: FocusEvent) {
      if (currentMenu && !currentMenu.contains(event.relatedTarget as Node)) {
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

  let submenuBlock: ReactNode;

   if(link.submenu) {
    if (Array.isArray(link.submenu)) {
      submenuBlock = <SubMenuStaticList
        submenuArray={link.submenu}
        subLinkClasses={subLinkClasses}
        setIsExpanded={setIsExpanded}
      />;
    } else if (React.isValidElement(link.submenu)) {
      const { rootUrl, location } = (link.submenu as ReactElement<DatasetSubmenuListProps>).props;
      submenuBlock = <DatasetListSubmenu
        location={location}
        rootUrl={rootUrl}
        subLinkClasses={subLinkClasses}
      />
    }
  }

  return (
    <li className={`dkan-c-nav-submenu has-submenu${isExpanded ? ' open' : ''}`} ref={menu}>
      <Button
        variation="ghost"
        onDark={headerContext.onDark}
        className={`${linkClasses}`}
        aria-haspopup="true"
        aria-expanded={isExpanded}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
      >
        {innerHtml}
        <ArrowIcon className="ds-u-margin-left--1" direction={isExpanded ? "up" : "down"} />
      </Button>
      {submenuBlock}
    </li>
  );
};

export default SubMenu;
