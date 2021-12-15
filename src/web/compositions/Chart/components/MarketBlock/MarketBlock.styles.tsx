import React from 'react'
import styled from 'styled-components'


export const ExclamationMark = styled(({ fontSize, lineHeight, ...props }) => (
  <span {...props}>!</span>
))`
  color: ${(props) => props.color || props.theme.palette.orange.dark};
  font-family: Avenir Next Demi;
  font-size: ${(props) => props.fontSize || '5rem'};
  line-height: ${(props) => props.lineHeight || '6rem'};
  margin: ${(props) => props.margin || '0 2rem 0 0'};
`

export const Title = styled(
  ({ width, fontFamily, fontSize, color, textAlign, margin, ...props }) => (
    <span {...props} />
  )
)`
  width: ${(props) => props.width || 'auto'};
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  font-style: normal;
  font-weight: normal;
  font-size: ${(props) => props.fontSize || '1.4rem'};
  text-align: center;
  color: ${(props) => props.color || '#ecf0f3'};
  text-align: ${(props) => props.textAlign || 'center'};
  margin: ${(props) => props.margin || '0'};
`

export const MarketStatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 6rem;
  padding: 0 3rem;
  border-bottom: ${(props) => props.theme.palette.border.new};
  background: ${(props) => props.theme.palette.background.paper};

  @media (max-width: 600px) {
    display: none;
  }
`
export const MobileMarketStatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 10rem;
  padding: 0 3rem;
  background: #17181a;
  border-bottom: ${(props) => props.theme.palette.border.new};
  @media (min-width: 600px) {
    display: none;
  }
`
