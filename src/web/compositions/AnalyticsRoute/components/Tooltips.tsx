import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import { Theme } from '@material-ui/core'

export const SquarePopup = styled.div`
  position: absolute;
  top: -1000px;
  left: -1000px;
  z-index: 1008;

  opacity: 0;
  background: #17181a;
  color: #fff;
  font-family: Avenir Next;
  letter-spacing: 0.01rem;
  text-align: center;

  box-shadow: 0px 0.4rem 0.6rem rgba(8, 22, 58, 0.3);
  border-radius: 0.4rem;
  padding: 0 1rem;
  border: ${(props) => props.theme.palette.border.new};
  transition: 0.3s all ease-out;
`

export const PopupDateContainer = styled.div`
  border-bottom: ${(props) => props.theme.palette.border.new};
  padding: 0.6rem 0;
  font-size: 1.6rem;
`

export const PopupInfoContainer = styled.div`
  display: flex;
  padding: 0.6rem 0;
`

export const PopupInfoBlock = styled.div`
  border-right: ${(props: { isFirstBlock: boolean; theme: Theme }) =>
    props.isFirstBlock && props.theme.palette.border.new};
  padding: ${(props: { isFirstBlock: boolean; theme: Theme }) =>
    props.isFirstBlock ? '0 1.5rem 0 .6rem' : '0 .6rem 0 1.5rem'};
`

export const PopupInfoTitle = styled.p`
  padding: 0;
  margin: 0;
  font-size: 1.6rem;
  padding-bottom: 0.3rem;
  text-transform: capitalize;
  font-weight: normal;
`

export const PopupInfoValue = styled.span`
  font-size: 1.6rem;
  white-space: nowrap;
  font-weight: bold;
  color: #ecf0f3;
`

export const TooltipForButterflyChart = ({
  id,
  theme,
  needQuoteInLabel,
}: {
  id: string
  theme: Theme
  needQuoteInLabel: boolean
}) => {
  return ReactDOM.createPortal(
    <SquarePopup theme={theme} id={`butterflyChart-tooltip-${id}`}>
      <PopupDateContainer
        theme={theme}
        id={`butterflyChart-tooltip-${id}-date`}
      >
        1 Jan
      </PopupDateContainer>
      <PopupInfoContainer>
        <PopupInfoBlock theme={theme} isFirstBlock>
          <PopupInfoValue id={`butterflyChart-tooltip-${id}-buy`}>
            {0}
          </PopupInfoValue>
          <PopupInfoTitle style={{ color: '#A5E898' }}>
            {needQuoteInLabel ? 'Avg. Buy' : 'Buy Trades'}
          </PopupInfoTitle>
        </PopupInfoBlock>

        <PopupInfoBlock theme={theme} isFirstBlock={false}>
          <PopupInfoValue id={`butterflyChart-tooltip-${id}-sell`}>
            0
          </PopupInfoValue>
          <PopupInfoTitle style={{ color: '#F26D68' }}>
            {needQuoteInLabel ? 'Avg. Sell' : 'Sell Trades'}
          </PopupInfoTitle>
        </PopupInfoBlock>
      </PopupInfoContainer>
    </SquarePopup>,
    document.body
  )
}

export const TooltipForAreaChart = ({ theme }: { theme: Theme }) => {
  return ReactDOM.createPortal(
    <SquarePopup theme={theme} id="areaChart-tooltip">
      <PopupDateContainer theme={theme} id="areaChart-tooltip-date">
        1 Jan
      </PopupDateContainer>
      <PopupInfoContainer>
        <PopupInfoBlock theme={theme} isFirstBlock={false}>
          <PopupInfoTitle>P&L after fee</PopupInfoTitle>
          <PopupInfoValue id="areaChart-tooltip-volume">0</PopupInfoValue>
        </PopupInfoBlock>
      </PopupInfoContainer>
    </SquarePopup>,
    document.body
  )
}
