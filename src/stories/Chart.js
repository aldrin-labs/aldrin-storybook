import React from 'react'
import { text } from '@storybook/addon-knobs/react'

import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import {SingleChart} from '@components/Chart/Chart'

const TablesContainer = styled.div`
  position: relative;
  display: flex;
  width: 40%;
  height: calc(100vh - 59px - 80px);
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
    width: 100%;
  }
`

const ChartsContainer = styled(TablesContainer)`
  height: calc(100vh - 59px - 80px - 1px);
  justify-content: flex-end;
  flex-direction: column;
  border-right: 1px solid #30353a;
  width: 60%;

  @media (max-width: 1080px) {
    height: calc(100vh - 59px - 80px);
    flex-wrap: nowrap;
  }
`


storiesOf('Chart', module)
  .add(
    'Chart',
    () => {
      const base = text('First currency', 'BTC');
      const quote = text('Second currency','USDT');

    return (
      <ChartsContainer>
        <SingleChart additionalUrl={`/?symbol=${base}/${quote}`} />
      </ChartsContainer>
    )
  }
)
