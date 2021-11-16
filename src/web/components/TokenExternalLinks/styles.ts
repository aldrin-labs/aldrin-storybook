import styled from 'styled-components'
import SvgIcon from '../SvgIcon'
import { COLORS } from '@variables/variables'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto 5px;
`

export const Anchor = styled.a`
  cursor: pointer;
`

export const Icon = styled(SvgIcon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin: 0 5px;
  background: ${COLORS.primary};
  background: radial-gradient(circle, rgba(255,255,255,1) 60%,  rgba(101,28,228,1) 61%,  rgba(101,28,228,1) 100%);
  border-radius: 50%;
`