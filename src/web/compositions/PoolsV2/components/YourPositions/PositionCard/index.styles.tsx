import styled from 'styled-components'

import bg from './assets/bg.png'

type TokenContainerProps = {
  isFirstIcon?: boolean
}

type CardProps = {
  isPositionViewDetailed?: boolean
}

export const ContainerWithBack = styled.div`
  width: 28%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 1em;
`
export const Card = styled.div<CardProps>`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: ${(props) => (props.isPositionViewDetailed ? '13.5em' : '9.5em')};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1em;
  background-image: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  backdrop-filter: opacity(0.5);
  background-color: #fff;
  border-radius: 15px;
  padding: 0.8em;
`

export const InnerBlock = styled.div`
  width: 100%;
  height: 3em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const TokenContainer = styled.div<TokenContainerProps>`
  position: absolute;
  transform: ${(props) =>
    props.isFirstIcon ? 'rotate(-20deg)' : 'rotate(20deg)'};
  top: ${(props) => (props.isFirstIcon ? '-1em' : '2em')};
  right: ${(props) => (props.isFirstIcon ? '-2em' : '4em')};
`
export const TokensBackground = styled.div`
  opacity: 0.1;
`
export const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
