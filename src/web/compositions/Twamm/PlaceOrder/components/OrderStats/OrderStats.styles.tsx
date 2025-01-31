import styled from 'styled-components'

export const OrderStatsContainer = styled.div`
  height: 100%;
  background: #17181a;
  padding: 3.2rem 3.2rem 3rem;
  border-radius: 1.2rem;
  margin: 0 0 1em 0;
`

export const StatsItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.6rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const StatsValue = styled.div`
  display: flex;
  align-items: center;

  img {
    margin-left: 10px;
  }
`
