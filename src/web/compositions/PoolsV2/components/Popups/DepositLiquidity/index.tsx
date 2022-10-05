import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { depositLiquidity } from '@sb/dexUtils/amm/actions/depositLiquidity'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  CheckboxContainer,
  HiddenCheckbox,
  Icon,
  StyledCheckbox,
} from '../../FiltersSection/index.styles'
import { PlusIcon, TooltipIcon } from '../../Icons'
import { ValuesContainer } from '../../Inputs'
import { HeaderComponent } from '../Header'
import { Box, Column, Row } from '../index.styles'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
import { PeriodButton, PeriodSwitcher } from './index.styles'
import { DepositLiquidityType } from './types'

export const DepositLiquidity: React.FC<DepositLiquidityType> = (props) => {
  const {
    pool,
    userTokenAccountA,
    userTokenAccountB,
    baseTokenDecimals,
    quoteTokenDecimals,
    needBlur,
    onClose,
    open,
    arrow,
    maxBaseAmount,
    maxQuoteAmount,
  } = props

  const [isRebalanceChecked, setIsRebalanceChecked] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [period, setPeriod] = useState('7D')
  const [baseAmount, setBaseAmount] = useState(0)
  const [quoteAmount, setQuoteAmount] = useState(0)

  const wallet = useWallet()
  const connection = useConnection()

  const baseMint = pool?.account?.reserves[0].mint.toString() || ''
  const quoteMint = pool?.account?.reserves[1].mint.toString() || ''

  const deposit = async () => {
    const result = await depositLiquidity({
      wallet,
      connection,
      pool,
      userTokenAccountA,
      userTokenAccountB,
      baseTokenDecimals,
      quoteTokenDecimals,
      baseAmount,
      quoteAmount,
    })

    console.log({ result })
  }

  return (
    <ModalContainer needBlur={needBlur}>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent arrow={arrow} onClose={onClose} />
        <Column height="calc(100% - 11em)" margin="2em 0">
          <Row width="100%">
            <InlineText color="white1" size="sm">
              Deposit
            </InlineText>
            <Row
              onClick={() => {
                setIsRebalanceChecked(!isRebalanceChecked)
              }}
            >
              <CheckboxContainer>
                <HiddenCheckbox type="checkbox" checked={isRebalanceChecked} />
                <StyledCheckbox hoverColor="blue1" color="blue1">
                  <Icon
                    hoverColor="blue1"
                    color="blue1"
                    checked={isRebalanceChecked}
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </Icon>
                </StyledCheckbox>
              </CheckboxContainer>
              <InlineText color="blue1" size="sm">
                Rebalance uneven amounts
              </InlineText>
              <DarkTooltip title="Liquidity must be deposited according to the ratio of the pool. Enable rebalance to auto-trade any entered amount to the pool ratio. When you withdraw the liquidity, you will get values equal to the ratio of the pool at withdrawal time.">
                <span>
                  <TooltipIcon color="blue1" />
                </span>
              </DarkTooltip>
            </Row>
          </Row>
          <Column height="auto" width="100%">
            <ValuesContainer
              setBaseAmount={setBaseAmount}
              setQuoteAmount={setQuoteAmount}
              quoteAmount={quoteAmount}
              baseAmount={baseAmount}
              baseMint={baseMint}
              quoteMint={quoteMint}
              baseMax={maxBaseAmount}
              quoteMax={maxQuoteAmount}
            />
            {isRebalanceChecked && (
              <Row margin="1em 0" width="100%">
                <Box height="auto" width="48%">
                  <Row width="100%">
                    <Row>
                      <InlineText size="sm">Network Fee:</InlineText>
                    </Row>
                    <Row>
                      <InlineText size="sm" color="white1" weight={600}>
                        0.0005 SOL <TooltipIcon color="white2" />
                      </InlineText>
                    </Row>
                  </Row>
                </Box>

                <Box height="auto" width="48%">
                  <Row width="100%">
                    <Row>
                      <InlineText size="sm">Rebalance Fee:</InlineText>
                    </Row>
                    <Row>
                      <InlineText size="sm" color="white1" weight={600}>
                        $14.42 <TooltipIcon color="white2" />
                      </InlineText>
                    </Row>
                  </Row>
                </Box>
              </Row>
            )}
          </Column>

          {isRebalanceChecked && (
            <>
              <Column height="auto" width="100%">
                <Row width="100%">
                  <Column height="auto" width="35%">
                    <Box padding="1em" height="6em">
                      <InlineText size="sm" weight={300} color="white2">
                        <TooltipIcon color="white2" margin="0 5px 0 0" />
                        Position Value{' '}
                      </InlineText>
                      <InlineText color="white1" size="xmd" weight={600}>
                        <InlineText color="white2" size="md" weight={600}>
                          $
                        </InlineText>{' '}
                        120.50
                      </InlineText>
                    </Box>
                  </Column>
                  <Column height="auto" width="60%">
                    <Box padding="1em" height="6em">
                      <InlineText size="sm" weight={300} color="white2">
                        <TooltipIcon color="white2" margin="0 5px 0 0" />
                        Estimated Earnings
                      </InlineText>
                      <Row width="100%">
                        <InlineText color="white1" size="xmd" weight={600}>
                          <InlineText color="white2" size="md" weight={600}>
                            $
                          </InlineText>{' '}
                          20.50
                        </InlineText>
                        <PeriodSwitcher>
                          <PeriodButton
                            isActive={period === '7D'}
                            onClick={() => {
                              setPeriod('7D')
                            }}
                          >
                            <InlineText size="esm">7D</InlineText>
                          </PeriodButton>
                          <PeriodButton
                            isActive={period === '1M'}
                            onClick={() => {
                              setPeriod('1M')
                            }}
                          >
                            <InlineText size="esm">1M</InlineText>
                          </PeriodButton>
                          <PeriodButton
                            isActive={period === '1Y'}
                            onClick={() => {
                              setPeriod('1Y')
                            }}
                          >
                            <InlineText size="esm">1Y</InlineText>
                          </PeriodButton>
                        </PeriodSwitcher>
                      </Row>
                    </Box>
                  </Column>
                </Row>
              </Column>
            </>
          )}
          <Column height="auto">
            <Row
              margin="1em 0"
              width="100%"
              onClick={() => {
                setIsUserVerified(!isUserVerified)
              }}
            >
              <CheckboxContainer marginRight="0.5em">
                <HiddenCheckbox type="checkbox" checked={isUserVerified} />
                <StyledCheckbox hoverColor="yellow1" color="yellow1">
                  <Icon
                    hoverColor="yellow1"
                    color="yellow1"
                    checked={isUserVerified}
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </Icon>
                </StyledCheckbox>
              </CheckboxContainer>
              <InlineText color="yellow1" size="xs">
                I verify that I have read the{' '}
                <InlineText
                  color="yellow1"
                  as="a"
                  target="_blank"
                  href="https://docs.aldrin.com/amm/aldrin-pools-guide-for-farmers"
                >
                  Aldrin Pools Guide
                </InlineText>{' '}
                and understand the risks of providing liquidity, including
                impermanent loss.
              </InlineText>
            </Row>
            <Button
              onClick={() => {
                deposit()
              }}
              $variant="green"
              $width="xl"
              $padding="xxxl"
              $fontSize="sm"
            >
              {!wallet.connected ? (
                'Connect Wallet to Add Liquidity'
              ) : (
                <>
                  <PlusIcon color="green1" />
                  Add Liquidity & Farm
                </>
              )}
            </Button>
          </Column>
        </Column>
      </Modal>
    </ModalContainer>
  )
}
