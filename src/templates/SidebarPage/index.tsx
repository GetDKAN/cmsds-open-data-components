import React, { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive'
import SidebarNavigation from '../../components/SidebarNavigation';
import { MenuLinkType } from '../../types/misc';

type SidebarPageProps = {
  links: MenuLinkType[],
  menuTitle: string,
  mobileMaxWidth?: number;
  children: ReactNode
}

const SidebarPage = (props: SidebarPageProps) => {
  const {links, menuTitle, mobileMaxWidth = 48, children} = props;
  const mobileMax = useMediaQuery({ query: `(max-width: ${mobileMaxWidth}rem)` });
  return(
    <div className={`${mobileMax ? "a" : 'ds-l-container'}`}>
      <div className={`${mobileMax ? "a" : 'ds-l-row'}`}>
        <div className={`${mobileMax ? 'a' : "ds-l-col--4"}`}>
          <SidebarNavigation links={links} title={menuTitle} mobileMax={mobileMax} />
        </div>
        <div className={`${mobileMax ? "ds-l-container" : " ds-l-md-col--8"}`}>
          { children }
        </div>
      </div>

    </div>
  );
}

export default SidebarPage;
