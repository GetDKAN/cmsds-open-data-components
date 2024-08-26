import React from 'react';
import { useMediaQuery } from 'react-responsive';
import DesktopHeader from '../../components/DesktopHeader';
import MobileHeader from '../../components/MobileHeader';
import './header.scss';

const Header = ({
  mobileMaxWidth = 1023,
  desktopMinWidth = 1024,
  siteName,
  links,
  org,
  includeTopNav = true
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

export default Header;
