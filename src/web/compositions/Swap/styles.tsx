import { COLORS } from '@variables/variables'
import styled from 'styled-components'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'

export const SwapPageContainer = styled(RowContainer)`
  background: ${COLORS.bodyBackground};
  overflow-y: auto;
  @media (max-height: 800px) {
    justify-content: flex-start;
  }
`

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

type BoxProps = {
  image?: string
}

export const InfoBox = styled(Row)`
  width: 32%;
  height: 15rem;
  background-image: ${(props: BoxProps) => `url(${props.image})`};
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 2rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
`

export const ValueButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 3rem;
  height: 3rem;
  cursor: pointer;
  padding: 0.7rem 1rem;
  font-family: Avenir Next Bold;
  color: #a7a7ae;
  background-color: #2b2d32;
  margin-left: 0.5rem;
  font-size: 1.5rem;
  line-height: 3rem;
  border: 0.1rem solid #3a475c;
  border-radius: 0.8rem;

  &:focus {
    background: ${(props) => props.theme.palette.blue.serum};
    border: ${(props) => `0.1rem solid ${props.theme.palette.blue.serum}`};
    font-family: Avenir Next Demi;
    color: #f8faff;
  }
`

export const ValueInput = styled.input`
  width: 7.5rem;
  height: 3rem;
  padding: 0.7rem 1rem;
  font-family: Avenir Next Medium;
  color: #fbf2f2;
  background-color: transparent;
  font-size: 1.3rem;
  border: 0.1rem solid #3a475c;
  border-radius: 0.8rem;
  outline: none;
  &:focus {
    border: ${(props) => `0.1rem solid ${props.theme.palette.blue.serum}`};
  }
`

export const BlackRow = styled(Row)`
  background: rgba(5, 5, 5, 0.25);
  border-radius: 1.2rem;
  height: 4.8rem;
  padding: 1.4rem 1.2rem;
`
