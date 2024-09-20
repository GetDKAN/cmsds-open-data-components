export interface NavbarProps {
  links: Array<any>;
  menuName: string;
  menuId: string;
  menuClasses?: string;
  linkClasses?: string;
  subLinkClasses?: string;
  wrapLabel?: boolean;
  clickHandler?: Function;
}