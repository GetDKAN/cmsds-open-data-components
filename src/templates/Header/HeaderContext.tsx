import { createContext } from "react";

const HeaderContext = createContext({
  mobileMenuOpen: false, 
  setMobileMenuOpen: (el: boolean) => {},
  navTop: '',
});

export default HeaderContext;
