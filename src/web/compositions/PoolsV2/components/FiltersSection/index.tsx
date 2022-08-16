import React, { useState } from 'react'

import { InlineText } from '@sb/components/Typography'

import { RootColumn, RootRow } from '../../index.styles'
import { ArrowsIcon } from '../Icons'
import { Container, SortByLabel, SRootRow, StretchedRow } from './index.styles'
import { FilterLabels } from './Labels'
import { Slider } from './RangeSlider'

const lablesForSorting = [
  {
    name: 'Liquidity',
  },
  { name: 'APR' },
  { name: 'Volume 7d' },
  { name: 'Most Recent' },
]

export const ExtendedFiltersSection = () => {
  const [value, setValue] = useState([200, 1000])
  const [sortingOption, chooseSortingOption] = useState('Liquidity')

  return (
    <RootColumn margin="0">
      <SRootRow>
        <FilterLabels />
      </SRootRow>
      <RootRow margin="15px auto" width="90%">
        <Container>
          <StretchedRow>
            <InlineText weight={700} size="sm" color="white2">
              TVL
            </InlineText>
            <InlineText size="sm" color="white2">
              from <InlineText color="gray0">${value[0]}</InlineText> to{' '}
              <InlineText color="gray0">${value[1]}</InlineText>
            </InlineText>
          </StretchedRow>
          <StretchedRow height="23px">
            <Slider
              pearling
              minDistance={10}
              min={100}
              max={1000}
              onChange={(value) => setValue(value)}
            />
          </StretchedRow>
        </Container>
        <Container width="40%">
          <StretchedRow>
            <InlineText weight={700} size="sm" color="white2">
              Sort by
            </InlineText>
          </StretchedRow>
          <SRootRow width="100%" margin="0">
            {lablesForSorting.map((el) => (
              <SortByLabel
                onClick={() => {
                  if (sortingOption.includes(el.name)) {
                    chooseSortingOption('')
                  } else {
                    chooseSortingOption(el.name)
                  }
                }}
                isActive={sortingOption === el.name}
              >
                {el.name.includes('Liquidity') ? (
                  <>
                    <ArrowsIcon /> {el.name}
                  </>
                ) : (
                  el.name
                )}
              </SortByLabel>
            ))}
          </SRootRow>
        </Container>
      </RootRow>
    </RootColumn>
  )
}
