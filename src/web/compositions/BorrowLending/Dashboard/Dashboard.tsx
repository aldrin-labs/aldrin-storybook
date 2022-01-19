import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import React from 'react'
import NumberFormat from 'react-number-format'
import { compose } from 'recompose'

import { Block, BlockContent } from '@sb/components/Block'
import { Cell, Page, WideContent } from '@sb/components/Layout'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WalletAccountsType } from '@sb/compositions/BorrowLending/Markets/types'
import { BlueButton } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'
import { RootRow } from '@sb/compositions/Pools/components/Charts/styles'
import { useWallet } from '@sb/dexUtils/wallet'

import TableAssets from './components/TableAssets'
import {
  TitleBlock,
  NumberValue,
  BlockNumber,
  TextCol,
  RewardCard,
  BlockReward,
  Subtitle,
} from './Dashboard.styles'

type DashboardProps = {
  theme: Theme
  reserves: any
  obligations: any
  walletAccounts: WalletAccountsType | []
  userSummary: any
  obligationDetails: any
}

const Dashboard = ({
  theme,
  reserves,
  obligations,
  walletAccounts,
  userSummary,
  obligationDetails,
}: DashboardProps) => {
  const { wallet } = useWallet()

  const borrowedValue = obligationDetails
    ? parseInt(obligationDetails.borrowedValue.toString(), 10) / 10 ** 18
    : 0

  if (wallet.publicKey && !obligations) {
    return null
  }

  return (
    <Page>
      <WideContent>
        <RootRow>
          <Cell col={12}>
            <Block>
              <BlockContent>
                <RowContainer>
                  <Cell col={12} colLg={4}>
                    <BlockNumber>
                      <TitleBlock>Deposit Value</TitleBlock>
                      <NumberValue>
                        {userSummary?.totalDepositWorth ? (
                          <NumberFormat
                            value={userSummary.totalDepositWorth}
                            displayType="text"
                            decimalScale={2}
                            fixedDecimalScale
                            thousandSeparator
                            prefix="$"
                          />
                        ) : (
                          0
                        )}
                      </NumberValue>
                    </BlockNumber>
                  </Cell>
                  <Cell col={12} colLg={4}>
                    <BlockNumber>
                      <TitleBlock>Net APY</TitleBlock>
                      <NumberValue>TBA</NumberValue>
                    </BlockNumber>
                  </Cell>
                  <Cell col={12} colLg={4}>
                    <BlockNumber>
                      <TitleBlock>Borrow Value</TitleBlock>
                      <NumberValue>
                        <NumberFormat
                          value={borrowedValue}
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator
                          prefix="$"
                        />
                      </NumberValue>
                    </BlockNumber>
                  </Cell>
                </RowContainer>
                <RowContainer>
                  <Cell col={12} colLg={4}>
                    <TextCol>0%</TextCol>
                    <Subtitle>Borrowing Power Used</Subtitle>
                  </Cell>
                  <Cell col={12} colLg={4}>
                    <TextCol>0%</TextCol>
                    <Subtitle>Borrowing Power</Subtitle>
                  </Cell>
                  <Cell col={12} colLg={4}>
                    <TextCol>$0</TextCol>
                    <Subtitle>You Borrowed</Subtitle>
                  </Cell>
                </RowContainer>

                <RowContainer>
                  <Cell col={12} colLg={8}>
                    <RewardCard>
                      <RowContainer>
                        <Cell col={12} colLg={4}>
                          <BlockReward>
                            <TitleBlock>Total Claimable Reward</TitleBlock>0
                          </BlockReward>
                        </Cell>
                        <Cell col={12} colLg={4}>
                          <BlockReward>
                            <TitleBlock>Your Balance</TitleBlock>0
                          </BlockReward>
                        </Cell>
                        <Cell col={12} colLg={4}>
                          <BlockReward>
                            <BlueButton
                              theme={theme}
                              width="calc(50% - .5rem)"
                              style={{ alignSelf: 'center' }}
                            >
                              Claim All
                            </BlueButton>
                          </BlockReward>
                        </Cell>
                      </RowContainer>
                    </RewardCard>
                  </Cell>
                </RowContainer>
              </BlockContent>
            </Block>
          </Cell>
        </RootRow>

        <RootRow>
          <Cell col={12}>
            <Block style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
              <TableAssets
                theme={theme}
                walletAccounts={walletAccounts}
                reserves={reserves}
              />
            </Block>
          </Cell>
        </RootRow>
      </WideContent>
    </Page>
  )
}

export default compose(withTheme())(Dashboard)
