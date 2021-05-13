import styled from 'styled-components'

export const BoldHeader = styled.h1`
  font-family: Avenir Next Bold;
  font-size: 2.5rem;
  letter-spacing: -1.04615px;
  color: #f5f5fb;
`
export const StyledInput = styled.input`
  background: #222429;
  border: 0.1rem solid #3a475c;
  border-radius: 1.5rem;
  height: 7.5rem;
  width: ${(props) => props.width || '100%'};
  padding: 0 2rem;
  outline: none;
  &::placeholder {
    font-size: 1.7rem;
    font-family: 'Avenir Next Thin';
  }
`
export const TokenContainer = styled.div`
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  position: absolute;
`
export const Line = styled.div`
  border: 0.1rem solid #3a475c;
  height: 0.1rem;
  margin: 2rem 0;
  width: 100%;
`
