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
