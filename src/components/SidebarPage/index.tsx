import React, { ReactNode } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { MenuLinkType } from '../../types/misc';

type SidebarPageProps = {
  links: MenuLinkType[],
  menuTitle: string,
  children: ReactNode
}

const SidebarPage = (props: SidebarPageProps) => {
  const {links, menuTitle, children} = props;
  return(
    <div className="ds-l-container">
      <div className="ds-l-row">
        <div className="ds-u-display--none ds-u-md-display--block ds-l-col--4">
          <SidebarNavigation links={links} title={menuTitle} />
        </div>
        <div className="ds-l-md-col--8">
          { children }
        </div>
      </div>

    </div>
  );
}

export default SidebarPage;
