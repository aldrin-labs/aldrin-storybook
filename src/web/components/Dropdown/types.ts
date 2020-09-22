import { CSSProperties } from 'react'

interface Item {
  text: string
  icon?: any
  onMouseOver?: () => void
  to: string
  onClick?: () => void
  style?: CSSProperties
}

export interface IProps {
  id: string
  buttonText: string
  items: Item[]
  selectedMenu: string | undefined
  selectActiveMenu(i: string): void
  onMouseOver?: () => void
}
