import React from 'react'

import { SvgIcon } from '@sb/components'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Text } from '@sb/compositions/Addressbook'

import { stripByAmount } from '@core/utils/chartPageUtils'

import QuestionIcon from '@icons/question.svg'

import { OrderStatsContainer, StatsItem, StatsValue } from './OrderStats.styles'

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
  const cancelFeeCalc = (orderAmount / 100) * cancellingFee
  // const cancelFeeRin = cancelFeeCalc/rinTokenPrice;
  const placingFeeCalc = (orderAmount / 100) * placingFee

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
          <DarkTooltip title="Due to the nature of dTWAP orders have no direct effect on the market price.">
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
          <DarkTooltip
            title="If no one bought a particle of the order during the allocated 15 seconds - it will be merged with the next one with the price lower by 0.001%.
This is to motivate traders to execute your orders. Don’t set the dTWAP order time too short, so that the parts are small enough to be executed in time."
          >
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>

      {/* <StatsItem> */}
      {/*  <Text */}
      {/*    fontFamily="Avenir Next Light" */}
      {/*    color="#F8FAFF" */}
      {/*    fontSize="1.3rem"> */}
      {/*    Fullfill probability: */}
      {/*  </Text> */}
      {/*  <StatsValue> */}
      {/*    <Text */}
      {/*      fontFamily="Avenir Next Demi" */}
      {/*      color="#F8FAFF" */}
      {/*      fontSize="1.3rem"> */}
      {/*      99% */}
      {/*    </Text> */}
      {/*    <DarkTooltip title='99%'> */}
      {/*      <span> */}
      {/*        <SvgIcon src={QuestionIcon} width="16px" height="16px" /> */}
      {/*      </span> */}
      {/*    </DarkTooltip> */}
      {/*  </StatsValue> */}
      {/* </StatsItem> */}

      <StatsItem>
        <Text fontFamily="Avenir Next Light" color="#F8FAFF" fontSize="1.3rem">
          dTWAP Fee:
        </Text>
        <StatsValue>
          <Text fontFamily="Avenir Next Demi" color="#45AC14" fontSize="1.3rem">
            {stripByAmount(placingFeeCalc)} {baseSymbol}
          </Text>
          <DarkTooltip title="0.001% of your order amount.">
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
            {stripByAmount(cancelFeeCalc)} {baseSymbol}
          </Text>
          <DarkTooltip title="A fee of 0.0005% of the order amount is charged if you decide to stop the order.">
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
