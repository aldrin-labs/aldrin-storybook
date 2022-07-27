import styled from 'styled-components'

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
  justify-content: center;
  align-items: center;
  margin-bottom: 1em;
  background: linear-gradient(
    40deg,
    rgba(203, 66, 93, 0.7) 0%,
    rgba(157, 57, 138, 0.8) 100%
  );
  border-radius: 15px;
  padding: 0.8em;
  box-shadow: 2px 17px 70px 3px rgba(174, 46, 33, 0.4);
  backdrop-filter: contrast(3);
`

export const InnerBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.gray14};
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding: 0.8em;
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
