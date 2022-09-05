import styled from 'styled-components'

type HalfContainer = {
  needPadding?: boolean
}

type SignContainerType = {
  needElement?: boolean
}

export const RightHalfContainer = styled.div<HalfContainer>`
  width: 50%;
  border-radius: 0 12px 12px 0;
  padding: ${(props) =>
    props.needPadding ? '0.5em 1em 0.5em 1.5em' : '0.5em 1em'};
  border: 1px solid ${(props) => props.theme.colors.white5};
  border-left: none;
  background: ${(props) => props.theme.colors.white6};
`

export const LeftHalfContainer = styled.div<HalfContainer>`
  width: 50%;
  border-radius: 12px 0 0 12px;
  padding: ${(props) =>
    props.needPadding ? '0.5em 1.5em 0.5em 1em' : '0.5em 1em'};
  border: 1px solid ${(props) => props.theme.colors.white5};
  background: ${(props) => props.theme.colors.white6};
`

export const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 1em 0;
`

export const SignContainer = styled.div<SignContainerType>`
  position: absolute;
  right: 47.5%;
  top: 29%;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  display: ${(props) => (props.needElement ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.white5};
  background: ${(props) => props.theme.colors.white6};
  color: ${(props) => props.theme.colors.white2};
  font-size: 20px;
  font-weight: 600;
`
