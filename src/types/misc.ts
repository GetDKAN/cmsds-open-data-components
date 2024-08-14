import { ReactNode } from "react"

export type FAQItemType = {
  id: string,
  title: string,
  body: ReactNode,
  open: boolean
}

export type MenuLinkType = {
  id: string,
  label: string,
  url: string,
  target: string
}

export type OrgType = {
  url: string;
  tagline: string;
  urlTitle: string;
  logoAltText?: string;
  logoFilePath?: string;
};

export type NavLinkArray = {
  id: string;
  label: string;
  url: string;
  target?: string;
  submenu?: NavLinkArray[]
}
