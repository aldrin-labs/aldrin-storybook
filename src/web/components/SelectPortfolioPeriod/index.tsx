import React, { useState } from 'react';
import { StyledButton, StyledArrow, Period } from './SelectPortfolioPeriod.style'

export default function SelectProtfolioPeriod() {

  const [activePeriod, setPeriod] = useState('week');
  const [isOpen, togglePeriod] = useState(false);

  const periods = [
    '24 hours',
    'week',
    'month',
    '6 month',
    'year',
    'all time'
  ];

  const openPeriods = () => {
    togglePeriod(true);
  };

  const choosePeriod = (period: string) => {
    togglePeriod(false);
    setPeriod(period);
  }

  return (
    <>
      <StyledButton disabled={isOpen ? true : false} onClick={openPeriods}>
        show p&l for
        <StyledArrow color={isOpen ? '#16253D' : '#165BE0'} />
      </StyledButton>
      {isOpen
        ? periods.map(period => (
          <Period
            key={period}
            color={period === activePeriod ? '#165BE0' : '#7284A0'}
            onClick={() => choosePeriod(period)}
          >{period}</Period>
        ))
        : (
          <Period
            color={'#165BE0'}
            margin={'0 70px 0px 0px'}
            onClick={openPeriods}
          >{activePeriod}</Period>
        )}
    </>
  );
}
