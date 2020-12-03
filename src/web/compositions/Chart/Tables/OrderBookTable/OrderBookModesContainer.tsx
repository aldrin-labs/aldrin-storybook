import React from 'react';

import { ModesContainer, SvgMode } from './OrderBookTableContainer.styles'
import {
    StyledSelect,
    StyledOption,
  } from '@sb/components/TradingWrapper/styles'
  
import SortByBoth from '@icons/SortByBoth.svg'
import SortByAsks from '@icons/SortByAsks.svg'
import SortByBids from '@icons/SortByBids.svg'


const OrderBookModesContainer = ({ mode, setOrderbookMode }) => (
	<ModesContainer>
		<SvgMode src={SortByBoth} isActive={mode === 'both'} onClick={() => setOrderbookMode('both')} />
		<SvgMode src={SortByBids} isActive={mode === 'bids'} onClick={() => setOrderbookMode('bids')} />
		<SvgMode src={SortByAsks} isActive={mode === 'asks'} onClick={() => setOrderbookMode('asks')} />
		<div style={{ width: '60%', padding: '0 1rem' }}>
			{/* <StyledSelect
        theme={theme}
        onChange={(e: ChangeEvent) => {
          setOrderbookAggregation(
            aggregationModes.find(
              (mode) => String(mode.label) === e.target.value
            ).value
          )
        }}
      >
        {aggregationModes.map((option) => (
          <StyledOption key={option.label}>{option.label}</StyledOption>
        ))}
      </StyledSelect> */}
		</div>
	</ModesContainer>
);

export default React.memo(OrderBookModesContainer)