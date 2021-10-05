import { CSSProperties } from 'react';
import { WalletAdapter } from '../../dexUtils/types';
import { Theme } from '../../types/materialUI';

interface Item {
  text: string
  icon?: any
  onMouseOver?: () => void
  to: string
  onClick?: () => void
  style?: CSSProperties
}

export interface WalletStatusButtonProps {
  id: string
  theme: Theme
  wallet: WalletAdapter
  connected: boolean
}

export interface IProps extends WalletStatusButtonProps {
  buttonText: string
  items: Item[]
  selectedMenu: string | undefined
  selectActiveMenu(i: string): void
  onMouseOver?: () => void
  isSelected: boolean
  isNavBar: boolean
  showOnTop: boolean
  height: string
  containerStyle: CSSProperties
  buttonStyles: CSSProperties
}

export interface ConnectWalletButtonProps {
  buttonStyles?: React.CSSProperties
  id: string
  height: string
  theme: Theme,
  wallet: WalletAdapter
}