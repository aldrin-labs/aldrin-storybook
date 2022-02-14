import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 30%;
  height: auto;
  margin: ${(props) => props.margin || '0'};
  padding: 0;

  @media (max-width: 600px) {
    width: 95%;
  }
`
