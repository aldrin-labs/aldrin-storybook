import React from 'react'
import styled from 'styled-components'

import { IProps } from './ScreenerTabs.types'

const ScreenerTabs = ({ ...props }: IProps) => {
  const onClickTab = (clickedTab: string) => {
    const { onChangeTab } = props

    if (onChangeTab) {
      onChangeTab(clickedTab)
    }
  }

  const { tab } = props

  return (
    <TabContainer>
      <Tab
        onClick={() => onClickTab('marketSummary')}
        active={tab === 'marketSummary'}
      >
        Market Summary
      </Tab>

      <Tab onClick={() => onClickTab('overview')} active={tab === 'overview'}>
        Overview
      </Tab>

      <Tab
        onClick={() => onClickTab('performance')}
        active={tab === 'performance'}
      >
        Performance
      </Tab>

      <Tab
        onClick={() => onClickTab('oscillators')}
        active={tab === 'oscillators'}
      >
        Oscillators
      </Tab>

      <Tab
        onClick={() => onClickTab('trendFollowing')}
        active={tab === 'trendFollowing'}
      >
        Trend-Following
      </Tab>
    </TabContainer>
  )
}

export default ScreenerTabs

const Tab = styled.button`
  color: ${(props: { active?: boolean }) =>
    props.active ? '#4ed8da' : '#fff'};
  border-color: ${(props: { active?: boolean }) =>
    props.active ? '#4ed8da' : 'transparent'};

  padding: 10px 30px;
  border-radius: 3px;
  background-color: #292d31;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  margin: 10px 15px;
  outline: none;
  box-sizing: border-box;

  &:hover {
    color: #4ed8da;
    border-color: #4ed8da;
  }

  @media (max-width: 1080px) {
    display: none;
    width: 8rem;
    padding: 0.5rem;
  }

  @media (max-width: 615px) {
    width: 5.5rem;
    padding: 0.5rem;
  }
`

const TabContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  padding-top: 30px;
`
