import styled from 'styled-components'

const Container = styled.div`
  height: 8rem;
  padding: 24px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background: #d26069;
`

const Emoji = styled.span`
  font-size: 20px;
  padding-right: 24px;
`

const Text = styled.span`
  color: #fff;
  font-size: 12px;

  @media (max-width: 600px) {
    font-size: 8px;
  }
`

export { Container, Emoji, Text }
