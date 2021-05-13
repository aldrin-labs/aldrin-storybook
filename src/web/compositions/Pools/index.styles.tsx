import SvgIcon from '@sb/components/SvgIcon'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import React from 'react'
import styled from 'styled-components'
import { Row } from '../AnalyticsRoute/index.styles'
import MockedToken from '@icons/ccaiToken.svg'
import MockedToken2 from '@icons/solToken.svg'
import { Text } from '@sb/compositions/Addressbook/index'

const BlockTemplate = styled(({ theme, ...props }) => <Row {...props} />)`
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.palette.dark.background};
  border-radius: 0.8rem;
`
export const LiquidityDataContainer = styled(Row)`
  width: 50%;
  border-right: 0.1rem solid #383b45;
  height: 6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 2rem;
  justify-content: space-around;
`
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`
export const TableHeader = styled.tr`
  height: 4rem;
`
export const BorderButton = styled(BtnCustom)`
  border: 0.1rem solid ${(props) => props.borderColor || '#41454E'};
  width: auto;
  padding: 0 2rem;
  height: 4rem;
  text-transform: none;
  color: ${(props) => props.color || '#fbf2f2'};
  border-radius: 1.5rem;
  font-size: 1.4rem;
`

export const TableRow = styled.tr``

export const RowTd = styled.td`
  width: auto;
  // height: ${(props) => props.height || '7rem'};
  padding: 0 2rem;
  font-family: 'Avenir Next Thin';
  // border-bottom: 0.2rem solid #383b45;
  border-top: 0.2rem solid #383b45;
  color: #f5f5fb;
  font-size: 1.5rem;
`
export const TextColumnContainer = styled(Row)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding: 1rem 0;
`
export const IconsContainer = styled.div`
  position: relative;
  height: 3rem;
  width: 5rem;
`
export const TokenIcon = styled.div`
  position: absolute;
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  z-index: ${(props) => props.zIndex};
`

export const TokenIconsContainer = ({}) => {
  return (
    <Row justify={'end'}>
      <IconsContainer>
        <TokenIcon
          zIndex={'0'}
          left={'0'}
          style={{ transform: 'translateX(70%)' }}
        >
          <SvgIcon width={'27px'} height={'27px'} src={MockedToken} />
        </TokenIcon>
        <TokenIcon left={'0'} zIndex={'1'}>
          <SvgIcon width={'27px'} height={'27px'} src={MockedToken2} />
        </TokenIcon>
      </IconsContainer>{' '}
      <Text style={{ marginLeft: '2rem' }} fontFamily={'Avenir Next Demi'}>
        SOL/CCAI
      </Text>{' '}
    </Row>
  )
}

export { BlockTemplate }
