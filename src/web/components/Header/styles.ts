import styled from 'styled-components'
import { COLORS, SIZE } from '../../../variables'
import { Link } from 'react-router-dom'


export const HeaderWrap = styled.header`
  display: flex;
  flex-direction: row;
  height: 48px;
  background: ${COLORS.bodyBackground};
  border-bottom: 1px solid ${COLORS.border};
  padding: 0 ${SIZE.defaultPadding};
`

export const LogoBlock = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const LinksBlock = styled.div`
  margin-left: 0;
`

export const WalletBlock = styled.div`
  margin-left: auto;
`

export const LogoLink = styled(Link)`
  display: block;
  padding: ${SIZE.defaultPadding} 0;
  height: 100%;
  margin-right: ${SIZE.defaultPadding};
`

export const Logo = styled.img`
  height: 100%;
`