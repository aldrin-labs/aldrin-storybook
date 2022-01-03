import React from 'react'

import { OrderStatsContainer, StatsItem, StatsValue } from './OrderStats.styles'
import { Text } from '@sb/compositions/Addressbook'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { SvgIcon } from '@sb/components'
import QuestionIcon from '@icons/question.svg'
import { stripByAmount } from '@core/utils/chartPageUtils'

const OrderStats = ({
  orderAmount,
  baseSymbol,
  cancellingFee,
  placingFee,
  rinTokenPrice,
}: {
  orderAmount: number
  baseSymbol: string
  cancellingFee: number
  placingFee: number
  rinTokenPrice: number
}) => {

  const cancelFeeCalc = (orderAmount / 100) * cancellingFee;
  const cancelFeeRin = cancelFeeCalc/rinTokenPrice;
  const placingFeeCalc = (orderAmount / 100) * placingFee;

  return (
    <OrderStatsContainer>
      <StatsItem>
        <Text fontFamily="Avenir Next Light" color="#F8FAFF" fontSize="1.3rem">
          Price Impact
        </Text>
        <StatsValue>
          <Text fontFamily="Avenir Next Demi" color="#F8FAFF" fontSize="1.3rem">
            No direct impact on market
          </Text>
          <DarkTooltip title="Due to the nature of TWAMM orders have no direct effect on the market price.">
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>

      <StatsItem>
        <Text fontFamily="Avenir Next Light" color="#F8FAFF" fontSize="1.3rem">
          Est. Order deflation:
        </Text>
        <StatsValue>
          <Text fontFamily="Avenir Next Demi" color="#F8FAFF" fontSize="1.3rem">
            0.001%
          </Text>
          <DarkTooltip title="If no one bought a particle of the order during the allocated 15 seconds - it will be merged with the next one with the price lower by 0.001%.
This is to motivate traders to execute your orders. Don’t set the TWAMM order time too short, so that the parts are small enough to be executed in time.">
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>

      {/*<StatsItem>*/}
      {/*  <Text*/}
      {/*    fontFamily="Avenir Next Light"*/}
      {/*    color="#F8FAFF"*/}
      {/*    fontSize="1.3rem">*/}
      {/*    Fullfill probability:*/}
      {/*  </Text>*/}
      {/*  <StatsValue>*/}
      {/*    <Text*/}
      {/*      fontFamily="Avenir Next Demi"*/}
      {/*      color="#F8FAFF"*/}
      {/*      fontSize="1.3rem">*/}
      {/*      99%*/}
      {/*    </Text>*/}
      {/*    <DarkTooltip title='99%'>*/}
      {/*      <span>*/}
      {/*        <SvgIcon src={QuestionIcon} width="16px" height="16px" />*/}
      {/*      </span>*/}
      {/*    </DarkTooltip>*/}
      {/*  </StatsValue>*/}
      {/*</StatsItem>*/}

      <StatsItem>
        <Text fontFamily="Avenir Next Light" color="#F8FAFF" fontSize="1.3rem">
          TWAMM Fee:
        </Text>
        <StatsValue>
          <Text fontFamily="Avenir Next Demi" color="#45AC14" fontSize="1.3rem">
            {placingFeeCalc < 0.01 && placingFee > 0 ? '< $0.01' : `$${stripByAmount(placingFeeCalc, 2)}`}
          </Text>
          <DarkTooltip title={'0.001% of your order amount.'}>
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>

      <StatsItem>
        <Text fontFamily="Avenir Next Light" color="#F8FAFF" fontSize="1.3rem">
          Network Fee:
        </Text>
        <StatsValue>
          <Text fontFamily="Avenir Next Demi" color="#45AC14" fontSize="1.3rem">
            0.00005 SOL
          </Text>
          <DarkTooltip title="Standard Solana transaction fee.">
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>

      <StatsItem>
        <Text fontFamily="Avenir Next Light" color="#F8FAFF" fontSize="1.3rem">
          Est. Canceling Fee:
        </Text>
        <StatsValue>
          <Text fontFamily="Avenir Next Demi" color="#45AC14" fontSize="1.3rem">
            {stripByAmount(cancelFeeRin)} RIN
          </Text>
          <DarkTooltip
            title={'A fee of 0.0005% of the order amount is charged if you decide to stop the order. The fee is charged in RIN tokens.'}
          >
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>
    </OrderStatsContainer>
  )
}

export default OrderStats
