import styled from 'styled-components'

export const AnimatedImage = styled.img`
  width: ${(props) => props.width || '2.5rem'};
  height: auto;
  animation-name: rotate;
  animation-duration: 5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes rotate {
    0% {
      transform: rotate(60deg);
    }

    50% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(60deg);
    }
  }
`
