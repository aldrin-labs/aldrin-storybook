import React from 'react';

import {OrderStatsContainer, StatsItem, StatsValue} from "./OrderStats.styles";
import {Text} from "@sb/compositions/Addressbook";
import {DarkTooltip} from "@sb/components/TooltipCustom/Tooltip";
import {SvgIcon} from "@sb/components";
import QuestionIcon from "@icons/question.svg";

const OrderStats = ({
  baseSymbol,
  cancellingFee,
  placingFee,
}: {
  baseSymbol: string,
  cancellingFee: number,
  placingFee: number,
}) => {
  return (
    <OrderStatsContainer>
      <StatsItem>
        <Text
          fontFamily="Avenir Next Light"
          color="#F8FAFF"
          fontSize="1.3rem">
            Price Impact
        </Text>
        <StatsValue>
          <Text
            fontFamily="Avenir Next Demi"
            color="#F8FAFF"
            fontSize="1.3rem">
            No direct impact on market
          </Text>
          <DarkTooltip title='No direct impact on market'>
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>

      <StatsItem>
        <Text
          fontFamily="Avenir Next Light"
          color="#F8FAFF"
          fontSize="1.3rem">
          Est. Order deflation:
        </Text>
        <StatsValue>
          <Text
            fontFamily="Avenir Next Demi"
            color="#F8FAFF"
            fontSize="1.3rem">
            0.001%
          </Text>
          <DarkTooltip title='0.001%'>
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
        <Text
          fontFamily="Avenir Next Light"
          color="#F8FAFF"
          fontSize="1.3rem">
          TWAMM Fee:
        </Text>
        <StatsValue>
          <Text
            fontFamily="Avenir Next Demi"
            color="#45AC14"
            fontSize="1.3rem">
            ${placingFee}
          </Text>
          <DarkTooltip title={`$${placingFee}`}>
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>

      <StatsItem>
        <Text
          fontFamily="Avenir Next Light"
          color="#F8FAFF"
          fontSize="1.3rem">
          Network Fee:
        </Text>
        <StatsValue>
          <Text
            fontFamily="Avenir Next Demi"
            color="#45AC14"
            fontSize="1.3rem">
            0.00005 SOL
          </Text>
          <DarkTooltip title='0.00005 SOL'>
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>

      <StatsItem>
        <Text
          fontFamily="Avenir Next Light"
          color="#F8FAFF"
          fontSize="1.3rem">
          Est. Canceling Fee:
        </Text>
        <StatsValue>
          <Text
            fontFamily="Avenir Next Demi"
            color="#45AC14"
            fontSize="1.3rem">
            ${cancellingFee}
          </Text>
          <DarkTooltip title={`$${cancellingFee}`}>
            <span>
              <SvgIcon src={QuestionIcon} width="16px" height="16px" />
            </span>
          </DarkTooltip>
        </StatsValue>
      </StatsItem>
    </OrderStatsContainer>
  );
};

export default OrderStats;
