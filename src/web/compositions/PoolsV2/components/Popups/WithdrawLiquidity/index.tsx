import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { redeemLiquidity } from '@sb/dexUtils/amm/actions/redeemLiquidity'
import { Pool } from '@sb/dexUtils/amm/types'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { MinusIcon, TooltipIcon } from '../../Icons'
import { ValuesContainer } from '../DepositLiquidity/DepositContainer'
import { HeaderComponent } from '../Header'
import { Box, Column, Row } from '../index.styles'
import { PeriodButton, PeriodSwitcher, ModalContainer } from './index.styles'

export const WithdrawLiquidity = ({
  onClose,
  open,
  pool,
  maxBaseAmount,
  maxQuoteAmount,
  userTokenAccountA,
  userTokenAccountB,
  baseTokenDecimals,
  quoteTokenDecimals,
}: {
  onClose: () => void
  open: boolean
  pool: Pool
  maxBaseAmount: number
  maxQuoteAmount: number
  userTokenAccountA: string
  userTokenAccountB: string
  baseTokenDecimals: number
  quoteTokenDecimals: number
}) => {
  const [isRebalanceChecked, setIsRebalanceChecked] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [baseAmount, setBaseAmount] = useState(0)
  const [quoteAmount, setQuoteAmount] = useState(0)
  const [period, setPeriod] = useState('7D')

  const wallet = useWallet()
  const connection = useConnection()

  const baseMint = pool?.account?.reserves[0].mint.toString() || ''
  const quoteMint = pool?.account?.reserves[1].mint.toString() || ''

  const withdraw = async () => {
    const result = await redeemLiquidity({
      wallet,
      connection,
      pool,
      userTokenAccountA,
      userTokenAccountB,
      baseTokenDecimals,
      quoteTokenDecimals,
    })

    console.log({ result })
  }

  return (
    <ModalContainer needBlur>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent arrow onClose={onClose} />
        <Column height="calc(100% - 11em)" margin="2em 0">
          <Row width="100%">
            <InlineText color="white2" size="sm">
              Withdraw
            </InlineText>
            {/* make button */}
            <InlineText color="blue1" size="sm" weight={600}>
              Withdraw All
            </InlineText>
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

            <Row margin="1em 0" width="100%">
              <Box height="auto" width="100%">
                <Row width="100%">
                  <Row>
                    <InlineText size="sm">Network Fee:</InlineText>
                  </Row>
                  <Row>
                    <InlineText size="sm" color="white1" weight={500}>
                      0.0005 SOL <TooltipIcon color="white2" />
                    </InlineText>
                  </Row>
                </Row>
              </Box>
            </Row>
          </Column>

          <Column height="auto" width="100%">
            <Row width="100%">
              <Column height="auto" width="35%">
                <Box padding="1em" height="6em">
                  <InlineText size="sm" weight={300} color="white2">
                    <TooltipIcon color="white2" margin="0 5px 0 0" />
                    Withdrawal Value{' '}
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
                    Estimated Earnings if you stay
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

          <Button
            onClick={() => {
              withdraw()
            }}
            $variant="violet"
            $width="xl"
            $padding="xxxl"
            $fontSize="sm"
          >
            <MinusIcon />
            Withdraw Liquidity
          </Button>
        </Column>
      </Modal>
    </ModalContainer>
  )
}
