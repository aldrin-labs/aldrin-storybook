import styled from 'styled-components'

export const AnimatedImage = styled.svg`
  width: ${(props) => props.width || '2.5rem'};
  height: auto;
  animation-name: rotate;
  animation-duration: 5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(60deg);
    }

    50% {
      transform: rotate(0deg);
    }

    75% {
      transform: rotate(-60deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

  .with-fill {
    fill: ${(props) => props.color || props.theme.colors.gray0};
  }
`

export const LoaderBlockInner = styled.div``

export const LoaderBlockWrap = styled.div`
  position: relative;

  ${LoaderBlockInner} {
    opacity: 0;
  }

  .with-loader {
    position: absolute;
    left: calc(50% - 1.5em);
    top: calc(50% - 1.5em);
  }
`
