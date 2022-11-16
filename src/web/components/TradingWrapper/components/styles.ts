import styled from 'styled-components'

const Container = styled.div`
  height: 4rem;
  padding: 12px 24px;
  margin: 12px 1.6rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background: ${(props) => props.theme.colors.red4};
  border-radius: 12px;
`

const Emoji = styled.span`
  font-size: 16px;
  padding-right: 12px;
`

const Text = styled.span`
  color: ${(props) => props.theme.colors.white1};
  font-size: 12px;
`

export { Container, Emoji, Text }
