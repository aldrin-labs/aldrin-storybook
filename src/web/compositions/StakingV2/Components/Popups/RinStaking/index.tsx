import React, { useState } from 'react'

import { Block, BlockContentStretched } from '@sb/components/Block'
import { FlexBlock, StretchedBlock } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { ImagesPath } from '@sb/compositions/Chart/components/Inputs/Inputs.utils'
import { formatNumberWithSpaces } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { NumberWithLabel } from '../../NumberWithLabel/NumberWithLabel'
import { HeaderComponent } from '../Header'
import InfoIcon from '../Icons/Icon.svg'
import { Column, Row } from '../index.styles'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
import { BigNumber, MainContainer } from './index.styles'
import { StakeContainer } from './StakeContainer'
import { UnstakeContainer } from './UnstakeContainer'

export const RinStaking = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  const [isRebalanceChecked, setIsRebalanceChecked] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [period, setPeriod] = useState('7D')
  const [isBalanceShowing, setIsBalanceShowing] = useState(true)

  const wallet = useWallet()

  return (
    <MainContainer>
      <ModalContainer needBlur className="modal-container">
        <Modal open={open} onClose={onClose}>
          <HeaderComponent close={() => onClose()} token="RIN" />
          <Column height="calc(100% - 10em)" margin="0 0 3em">
            <Column height="auto" width="100%">
              <StakeContainer />

              <Row width="100%" margin="1.25em 0" className="rewards-row">
                <Block margin="0 8px 0 0" className="stake-block">
                  <BlockContentStretched>
                    <FlexBlock
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <InlineText size="sm">Your stake</InlineText>{' '}
                      <SvgIcon
                        style={{ cursor: 'pointer' }}
                        src={
                          isBalanceShowing
                            ? ImagesPath.eye
                            : ImagesPath.closedEye
                        }
                        width="0.9em"
                        height="auto"
                        onClick={() => {
                          setIsBalanceShowing(!isBalanceShowing)
                        }}
                      />
                    </FlexBlock>
                    <BigNumber>
                      <InlineText>
                        {isBalanceShowing
                          ? formatNumberWithSpaces(1000)
                          : '***'}
                      </InlineText>{' '}
                      <InlineText>RIN</InlineText>
                    </BigNumber>
                    <StretchedBlock align="flex-end">
                      <InlineText size="sm">
                        <InlineText>$</InlineText>&nbsp;{' '}
                        {isBalanceShowing ? '99' : '***'}
                      </InlineText>{' '}
                    </StretchedBlock>
                  </BlockContentStretched>
                </Block>

                <Block className="rewards-block">
                  <BlockContentStretched>
                    <FlexBlock
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <InlineText size="sm">Compounded Rewards</InlineText>
                      <DarkTooltip
                        title={
                          <>
                            <p>
                              APR is calculated based on last RIN buyback which
                              are weekly.
                            </p>
                          </>
                        }
                      >
                        <span>
                          <SvgIcon src={InfoIcon} width="0.8em" />
                        </span>
                      </DarkTooltip>
                    </FlexBlock>
                    <BigNumber>
                      <InlineText>
                        {isBalanceShowing
                          ? formatNumberWithSpaces(8000)
                          : '***'}{' '}
                      </InlineText>{' '}
                      <InlineText>RIN</InlineText>
                    </BigNumber>
                    <StretchedBlock align="flex-end">
                      <InlineText size="sm">
                        <InlineText>$</InlineText>&nbsp;{' '}
                        {isBalanceShowing
                          ? formatNumberWithSpaces(1800)
                          : '***'}
                      </InlineText>
                      <NumberWithLabel value={12} label="APY" />
                    </StretchedBlock>
                  </BlockContentStretched>
                </Block>
              </Row>
            </Column>
            <UnstakeContainer />
          </Column>
        </Modal>
      </ModalContainer>
    </MainContainer>
  )
}
