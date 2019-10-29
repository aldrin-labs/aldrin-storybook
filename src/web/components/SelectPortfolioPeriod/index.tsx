import React, { useState, useEffect } from 'react'
import {
  Wrapper,
  StyledButton,
  StyledArrow,
  Period,
} from './SelectPortfolioPeriod.style'

const periodsSPOT = [
  { label: '24 hours', name: '1Day' },
  { label: 'week', name: '1Week' },
  { label: 'month', name: '1Month' },
  { label: '3 month', name: '3Month' },
  { label: '6 month', name: '6Month' },
  { label: 'year', name: '1Year' },
  { label: 'all time', name: 'All' },
]

const periodsFutures = [
  { label: '24 hours', name: '1Day' },
  { label: 'week', name: '1Week' },
  { label: 'month', name: '1Month' },
  { label: '3 month', name: '3Month' },
  { label: '6 month', name: '6Month' },
]

export default function SelectProtfolioPeriod({
  isSPOTCurrently,
  chooseHistoryPeriod,
}) {
  const currentPeriods = isSPOTCurrently ? periodsSPOT : periodsFutures
  const [activePeriod, setPeriod] = useState(
    !isSPOTCurrently ? 'week' : 'all time'
  )

  const [isOpen, togglePeriod] = useState(false)

  useEffect(() => setPeriod(!isSPOTCurrently ? 'week' : 'all time'), [
    isSPOTCurrently,
  ])

  const openPeriods = () => {
    togglePeriod(true)
  }

  const choosePeriod = (period: any) => {
    togglePeriod(false)
    setPeriod(period.label)
    chooseHistoryPeriod(period.name)
  }

  return (
    <Wrapper>
      <StyledButton
        disabled={isOpen && !isSPOTCurrently ? true : false}
        onClick={() => isSPOTCurrently && openPeriods()}
      >
        {isSPOTCurrently ? 'show p&l for' : 'show history for'}
        <StyledArrow
          color={isOpen && !isSPOTCurrently ? '#16253D' : '#165BE0'}
        />
      </StyledButton>
      {isOpen && !isSPOTCurrently ? (
        currentPeriods.map((period) => (
          <Period
            key={period.label}
            color={period.label === activePeriod ? '#165BE0' : '#7284A0'}
            onClick={() => choosePeriod(period)}
          >
            {period.label}
          </Period>
        ))
      ) : (
        <Period
          color={'#165BE0'}
          onClick={() => !isSPOTCurrently && openPeriods()}
        >
          {activePeriod}
        </Period>
      )}
    </Wrapper>
  )
}
