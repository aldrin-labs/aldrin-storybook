interface Item {
  text: string
  icon?: any
  onMouseOver?: () => void
  to: string
}

export interface IProps {
  id: string
  buttonText: string
  items: Item[]
  selectedMenu: string | undefined
  selectActiveMenu(i: string): void
  onMouseOver?: () => void
}
