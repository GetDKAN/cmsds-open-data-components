import { createContext, useRef } from "react";

const HeaderContext = createContext({
  mobileMenuOpen: false, 
  setMobileMenuOpen: (el: boolean) => {},
  menuRef: null as any,
  isMobile: false,
  onDark: true,
});

export default HeaderContext;
