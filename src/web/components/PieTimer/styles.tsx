import styled from 'styled-components'

const PieTimerContainer = styled.div`
  position: relative;

  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;

  cursor: pointer;

  @property --percentage {
    initial-value: 100%;
    inherits: false;
    syntax: '<percentage>';
  }

  @keyframes timer {
    to {
      --percentage: 0%;
    }
  }

  .pie-timer-filled {
    width: 100%;
    height: 100%;

    background: conic-gradient(#d7c202, #00b55e);
    border-radius: 50%;
    opacity: 0.8;
    z-index: 1;
  }

  .pie-timer-fill-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;

    animation: timer 15s infinite linear;
    background: conic-gradient(
      rgba(0, 0, 0, 0) var(--percentage),
      ${({ theme }) => theme.colors.white6} 0
    );
    z-index: 2;
  }

  .svg-overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    z-index: 2;

    svg {
      width: 100%;
      height: 100%;
    }
  }
`

const PieTimerCircleInside = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white6};
  z-index: 3;
`

const SmalletPieTimerCircleInside = styled(PieTimerCircleInside)`
  width: 0.4em;
  height: 0.4em;
  border: 1px solid ${({ theme }) => theme.colors.white4};
`

export { PieTimerContainer, PieTimerCircleInside, SmalletPieTimerCircleInside }
