import styled from 'styled-components'

type LogoContainer = {
  radius?: string
  left?: string
}

export const LogoWrap = styled.div<LogoContainer>`
  height: 200px;
  position: relative;
  background: linear-gradient(
    276.63deg,
    #0e02ec 4.95%,
    #ab0899 38.28%,
    #e00b21 70.65%,
    #da6239 97.71%
  );

  border-radius: ${(props) => props.radius || '12px 12px 0px 0px'};
  display: flex;
  align-items: center;
  padding: 0 20px;
`
export const AbsoluteImg = styled.img<LogoContainer>`
  position: absolute;
  left: ${(props) => props.left || '78%'};
`
