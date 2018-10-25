import styled from 'styled-components'

export const Chart = styled.div`
  width: 100%;
  min-height: 5em;
  margin-top: 24px;
  height: ${(props: { height: string }) => props.height};

  @media (min-width: 1400px) {
    height: 100%;
  }
`

export const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 16px auto 16px auto;
`

export const SProfileChart = styled.div`
  width: 100%;
  padding: 0 16px;
  border-radius: 3px;

  margin: 0 auto;
  height: 100%;

  display: flex;
  flex-direction: column;
`
