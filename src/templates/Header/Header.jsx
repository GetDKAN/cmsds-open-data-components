import React from 'react';
import { useMediaQuery } from 'react-responsive';
import DesktopHeader from '../../components/DesktopHeader';
import MobileHeader from '../../components/MobileHeader';
import './header.scss';

const Header = ({
  mobileMaxWidth,
  desktopMinWidth,
  siteName,
  links,
  org,
  includeTopNav
}) => {
  const mobile = useMediaQuery({ minWidth: 0, maxWidth: mobileMaxWidth});
  const desktop = useMediaQuery({ minWidth: desktopMinWidth});
  return(
    <>
      {desktop && (
        <DesktopHeader
          siteName={siteName}
          links={links}
          org={org}
          includeTopNav={includeTopNav}
        />
      )}
      {mobile && (
        <MobileHeader
          siteName={siteName}
          links={links}
          org={org}
          includeTopNav={includeTopNav}
        />
      )}
    </>
  );
}

Header.defaultProps = {
  mobileMaxWidth: 1023,
  desktopMinWidth: 1024,
  includeTopNav: true,
}


export default Header;
