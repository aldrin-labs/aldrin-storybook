import styled from 'styled-components'

export const ContainerWithBack = styled.div`
  width: calc(100% / 7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 1em;
`
export const Card = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 10em;
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
