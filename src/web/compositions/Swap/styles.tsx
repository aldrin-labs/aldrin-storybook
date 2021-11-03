import styled from 'styled-components'
import { BlockTemplate } from '../Pools/index.styles'

export const Card = styled(BlockTemplate)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 1px solid #383b45;
  border-top: none;
  box-shadow: none;
`
export const TokenLabel = styled.div`
  width: auto;
  padding: 0.5rem 1rem;
  font-family: Avenir Next Medium;
  color: #f8faff;
  border-radius: 1.3rem;
  background: #f69894;
  font-size: 1.4rem;
  margin-left: 1rem;
`

