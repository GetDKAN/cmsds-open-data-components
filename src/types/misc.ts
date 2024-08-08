import { ReactNode } from "react"

export type FAQItemType = {
  id: string,
  title: string,
  body: ReactNode,
  open: boolean
}
