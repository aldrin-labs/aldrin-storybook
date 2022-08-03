import { usePools } from '@aldrin_exchange/swap_hook'
import { PublicKey } from '@solana/web3.js'
import React, { FC, useEffect, useState } from 'react'

import { SvgIcon } from '@sb/components'
import {
  BlackPage,
  Cell,
  Row,
  StretchedBlock,
  WideContent,
} from '@sb/components/Layout'
import { InlineText, Text } from '@sb/components/Typography'
import { useConnection } from '@sb/dexUtils/connection'
import { migrateLiquidity } from '@sb/dexUtils/migrateAll'
import { notify } from '@sb/dexUtils/notifications'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { stakeAll } from '@sb/dexUtils/stakeAll'
import { useStakingPoolInfo } from '@sb/dexUtils/staking/hooks'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { groupBy } from '@core/collection'
import {
  DEFAULT_FARMING_TICKET_END_TIME,
  getCalcAccounts,
  getParsedUserFarmingTickets,
  getParsedUserStakingTickets,
  getTokenDataByMint,
  MINIMAL_STAKING_AMOUNT,
  POOLS_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
  ProgramsMultiton,
  RIN_MINT,
  STAKING_PROGRAM_ADDRESS,
  walletAdapterToWallet,
} from '@core/solana'
import { FarmingCalc, FarmingTicket } from '@core/types/farming.types'
import { stripByAmount } from '@core/utils/numberUtils'

import { ConnectWalletPopup } from '../Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { getUniqueAmountsToClaimMap } from '../Pools/components/Tables/utils/getUniqueAmountsToClaimMap'
import AldrinHelmetIcon from './assets/aldrinHelmet.svg'
import SuccessIcon from './assets/success.svg'
import ToolKitIcon from './assets/toolKit.svg'
import {
  ColumnStretchBlock,
  MigrationToolBlockContainer,
  StyledButton,
  StyledInput,
  StyledLink,
  UserLiquidityContainer,
} from './styles'
import {
  CommonStepParams,
  ConnectWalletStepParams,
  SpecifyWalletAddressParams,
  WithdrawPositionsParams,
} from './types'

const ConnectWalletStep: FC<ConnectWalletStepParams> = ({
  nextStep,
  openWalletPopup,
}) => {
  const { wallet, connected } = useWallet()
  const [listenWallet, setListenWallet] = useState(false)

  useEffect(() => {
    if (listenWallet) {
      wallet.on('connect', () => nextStep())
    }
  }, [wallet, listenWallet])

  return (
    <>
      <StretchedBlock>
        <SvgIcon src={ToolKitIcon} width="2em" height="2em" />
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          Dear Aldrinauts,
        </Text>
        <Text margin="1em 0 0 0">
          About 8 000 Solana Wallets got compromised today. Funds locked in
          smart contracts are safe but withdrawal may cause them to get stolen.
          Follow next instructions to get your staking and liquidity positions
          safe.
        </Text>
      </ColumnStretchBlock>
      <StyledButton
        $variant="blue"
        onClick={async () => {
          if (!connected) {
            openWalletPopup()
            setListenWallet(true)
          } else {
            nextStep()
          }
        }}
      >
        {connected ? 'Sure, next step' : 'Connect Wallet'}
      </StyledButton>
    </>
  )
}

const CreateNewWalletStep: FC<CommonStepParams> = ({ nextStep }) => {
  return (
    <>
      <StretchedBlock>
        <InlineText size="xl" weight={600}>
          1
        </InlineText>
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          Create New Wallet
        </Text>
        <Text margin="1em 0 0 0">
          To ensure that you withdraw funds to an uncompromised wallet, we
          recommend you to create a new address on the basic Solana wallet{' '}
          <StyledLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://sollet.io"
          >
            Sollet.io
          </StyledLink>
        </Text>
      </ColumnStretchBlock>
      <StyledButton $variant="blue" onClick={nextStep}>
        I have created new wallet
      </StyledButton>
    </>
  )
}

const SpecifyWalletAddressStep = ({
  nextStep,
  setSendToWalletAddress,
}: SpecifyWalletAddressParams) => {
  const [walletAddress, setWalletAddress] = useState('')

  return (
    <>
      <StretchedBlock>
        <InlineText size="xl" weight={600}>
          2
        </InlineText>
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          Specify your recently created new wallet address
        </Text>
        <StyledInput
          name="toWalletAddress"
          value={walletAddress}
          placeholder="Paste address here"
          onChange={(value) => setWalletAddress(value)}
        />
      </ColumnStretchBlock>
      <StyledButton
        $variant="blue"
        onClick={() => {
          try {
            const pk = new PublicKey(walletAddress)
          } catch (e) {
            notify({
              message: 'Invalid publicKey',
              type: 'error',
            })
            return
          }

          setSendToWalletAddress(walletAddress)
          nextStep()
        }}
      >
        Next
      </StyledButton>
    </>
  )
}

const MigratePositionsStep = ({
  nextStep,
  operationType,
  sendToWalletAddress,
}: WithdrawPositionsParams) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const tokenInfosMap = useTokenInfos()

  const { data } = useStakingPoolInfo()
  const { poolInfo } = data || { poolInfo: null }

  const { pools } = usePools()
  const [userTokenAccounts] = useUserTokenAccounts()

  const [stakingTickets, setStakingTickets] = useState<FarmingTicket[]>([])
  const [stakingCalcAccounts, setStakingCalcAccounts] = useState<FarmingCalc[]>(
    []
  )
  const [loadingStakingInfo, setStakingInfoLoading] = useState(true)

  const [poolsTickets, setPoolsTickets] = useState<
    Map<string, FarmingTicket[]>
  >(new Map())
  const [poolsCalcAccounts, setPoolCalcAccounts] = useState<
    Map<string, FarmingCalc[]>
  >(new Map())
  const [loadingPoolsInfo, setPoolsInfoLoading] = useState(true)

  const stakingTicketsAmount = stakingTickets.reduce(
    (acc, ticket) => acc + ticket.tokensFrozen / 10 ** 9,
    0
  )

  const stakingCalcAccountsAmount = stakingCalcAccounts.reduce(
    (acc, calc) => acc + +calc.tokenAmount / 10 ** 9,
    0
  )

  const { amount: userRINTokenAccountBalance } = getTokenDataByMint(
    userTokenAccounts,
    RIN_MINT
  )

  const stakingAmount =
    stakingTicketsAmount +
    stakingCalcAccountsAmount +
    userRINTokenAccountBalance

  const poolsToShow = pools.filter((pool) => {
    const hasTickets = poolsTickets.has(pool.swapToken)

    const { amount: lpTokenAmount } = getTokenDataByMint(
      userTokenAccounts,
      pool.poolTokenMint
    )
    const hasLpTokens = lpTokenAmount > MINIMAL_STAKING_AMOUNT

    return hasTickets || hasLpTokens
  })

  const isWithdrawLiquidityFromUserAccount = operationType === 'withdraw'
  const MIN_SOL_TO_MIGRATE = 0.05

  const userNativeSOLToken =
    userTokenAccounts.length > 0 ? userTokenAccounts[0] : { amount: 0 }
  const isEnoughSOL = userNativeSOLToken.amount > MIN_SOL_TO_MIGRATE

  useEffect(() => {
    const load = async () => {
      setStakingInfoLoading(true)
      setPoolsInfoLoading(true)

      if (!isWithdrawLiquidityFromUserAccount) {
        setStakingInfoLoading(false)
        setPoolsInfoLoading(false)
        return
      }

      const walletWithPk = walletAdapterToWallet(wallet)
      const parsedStakingTickets = await getParsedUserStakingTickets({
        wallet: walletWithPk,
        connection,
      })

      const activeStakingTickets = parsedStakingTickets.filter(
        (ticket) => ticket.endTime === DEFAULT_FARMING_TICKET_END_TIME
      )

      setStakingTickets(activeStakingTickets)

      const rinProgram = ProgramsMultiton.getProgramByAddress({
        programAddress: STAKING_PROGRAM_ADDRESS,
        connection,
        wallet,
      })

      const parsedStakingCalcAccounts = await getCalcAccounts(
        rinProgram,
        walletWithPk.publicKey
      )

      const activeStakingCalcAccounts = parsedStakingCalcAccounts.filter((ca) =>
        ca.tokenAmount.gtn(0)
      )

      setStakingCalcAccounts(activeStakingCalcAccounts)

      setStakingInfoLoading(false)

      const programV1 = ProgramsMultiton.getProgramByAddress({
        programAddress: POOLS_PROGRAM_ADDRESS,
        connection,
        wallet,
      })
      const programV2 = ProgramsMultiton.getProgramByAddress({
        programAddress: POOLS_V2_PROGRAM_ADDRESS,
        connection,
        wallet,
      })
      const accounts = await Promise.all([
        getCalcAccounts(programV1, walletWithPk.publicKey),
        getCalcAccounts(programV2, walletWithPk.publicKey),
      ])

      const calcsForPools = groupBy(accounts.flat(), (acc) =>
        acc.farmingState.toString()
      )

      setPoolCalcAccounts(calcsForPools)

      const poolTickets = await getParsedUserFarmingTickets({
        wallet: walletWithPk,
        connection,
      })

      const activeTicketsForPool = poolTickets.filter(
        (ticket) => ticket.endTime === DEFAULT_FARMING_TICKET_END_TIME
      )

      const ticketsForPools = groupBy(activeTicketsForPool, (pt) => pt.pool)
      setPoolsTickets(ticketsForPools)

      setPoolsInfoLoading(false)
    }

    load()
  }, [])

  return (
    <>
      <StretchedBlock>
        <InlineText size="xl" weight={600}>
          {isWithdrawLiquidityFromUserAccount ? 3 : 5}
        </InlineText>
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          {isWithdrawLiquidityFromUserAccount
            ? 'Withdraw your positions to the new wallet'
            : 'Stake your RIN and positions using new wallet'}
        </Text>
        <UserLiquidityContainer>
          <StretchedBlock>
            <Text>Rin Staking:</Text>
            <Text weight={600}>
              {loadingStakingInfo ? '--' : stripByAmount(stakingAmount)} RIN
            </Text>
          </StretchedBlock>
          {poolsToShow.map((pool) => {
            const { symbol: baseSymbol } = tokenInfosMap.get(pool.tokenA) || {
              symbol: pool.tokenA,
            }

            const { symbol: quoteSymbol } = tokenInfosMap.get(pool.tokenB) || {
              symbol: pool.tokenB,
            }

            const tickets = poolsTickets.get(pool.swapToken) || []
            const ticketsLPAmount = tickets.reduce(
              (acc, ticket) => acc + ticket.tokensFrozen,
              0
            )
            const { amount: userLPTokenAccountBalance } = getTokenDataByMint(
              userTokenAccounts,
              pool.poolTokenMint
            )

            const userLiquidityProviderBalance =
              userLPTokenAccountBalance + ticketsLPAmount

            const [userAmountTokenA, userAmountTokenB] =
              calculateWithdrawAmount({
                selectedPool: pool,
                poolTokenAmount: userLiquidityProviderBalance,
              })

            const ticketsRewardsMap = getUniqueAmountsToClaimMap({
              calcAccounts: poolsCalcAccounts,
              farmingStates: pool.farming || [],
              farmingTickets: [],
            })

            const userAmountInPoolString = `${stripByAmount(
              userAmountTokenA
            )} ${baseSymbol} / ${stripByAmount(
              userAmountTokenB
            )} ${quoteSymbol}`

            const userUnclaimedRewardsString = Array.from(
              ticketsRewardsMap.values()
            )
              .map((reward, i, arr) => {
                const { symbol } = tokenInfosMap.get(
                  reward.farmingTokenMint
                ) || { symbol: reward.farmingTokenMint }

                const rewardAmountString = `${stripByAmount(
                  reward.amount
                )} ${symbol} ${i !== arr.length - 1 ? '/' : ''}`

                return rewardAmountString
              })
              .join('')

            return (
              <StretchedBlock key={pool.swapToken} style={{ marginTop: '1em' }}>
                <Text>
                  {baseSymbol}/{quoteSymbol} Pool:
                </Text>
                <Text weight={600}>
                  {loadingPoolsInfo
                    ? '--'
                    : `${userAmountInPoolString} / ${userUnclaimedRewardsString}`}
                </Text>
              </StretchedBlock>
            )
          })}
        </UserLiquidityContainer>
      </ColumnStretchBlock>
      <StyledButton
        $variant={isEnoughSOL ? 'blue' : 'red'}
        onClick={async () => {
          if (!isEnoughSOL) return
          if (!poolInfo) {
            notify({
              message: 'Staking not loaded',
              type: 'error',
            })
            return
          }

          const walletWithPk = walletAdapterToWallet(wallet)
          if (isWithdrawLiquidityFromUserAccount) {
            await migrateLiquidity({
              wallet: walletWithPk,
              connection,
              newWallet: new PublicKey(sendToWalletAddress),
              rinStaking: poolInfo,
              pools,
              stakingTickets,
              stakingCalcAccounts,
              poolsCalcsByFarmingState: poolsCalcAccounts,
              poolsTicketsByPool: poolsTickets,
              onStatusChange: () => {},
            })
          } else {
            await stakeAll({
              wallet: walletWithPk,
              connection,
              rinStaking: poolInfo,
              pools,
            })
          }
          nextStep()
        }}
      >
        {isEnoughSOL &&
          (isWithdrawLiquidityFromUserAccount
            ? 'Transfer LP Positions, Claimed Rewards & Unstaked RIN'
            : 'Stake RIN and positions')}

        {!isEnoughSOL && (
          <>
            <Text margin="0" color="red1" weight={600}>
              Not Enough SOL for network fees
            </Text>
            <Text margin="0" color="red1" size="esm">
              We recommend to have {MIN_SOL_TO_MIGRATE} SOL to process all
              transactions
            </Text>
          </>
        )}
      </StyledButton>
    </>
  )
}

const ConnectNewWalletStep: FC<ConnectWalletStepParams> = ({
  nextStep,
  openWalletPopup,
}) => {
  const { wallet } = useWallet()
  const [listenWallet, setListenWallet] = useState(false)

  useEffect(() => {
    if (listenWallet) {
      wallet.on('connect', () => nextStep())
    }
  }, [wallet, listenWallet])

  return (
    <>
      <StretchedBlock>
        <InlineText size="xl" weight={600}>
          4
        </InlineText>
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          Stake your RIN and positions using new wallet
        </Text>
        <Text margin="1em 0 0 0">
          Fund your newly created wallet with some SOL for fees and connect it
          to get your RIN back to staking.
        </Text>
      </ColumnStretchBlock>
      <StyledButton
        $variant="blue"
        onClick={async () => {
          await wallet.disconnect()
          setListenWallet(true)
          openWalletPopup()
        }}
      >
        Connect New Wallet
      </StyledButton>
    </>
  )
}

const SuccessStep = () => {
  return (
    <>
      <StretchedBlock>
        <SvgIcon src={SuccessIcon} width="2em" height="2em" />
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>

      <Text weight={600}>Your positions successfully migrated!</Text>
    </>
  )
}

const MigrationTool = () => {
  const [step, setStep] = useState(0)
  const [sendToWalletAddress, setSendToWalletAddress] = useState('')

  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)

  const nextStep = () => setStep(step + 1)
  const openWalletPopup = () => setIsConnectWalletPopupOpen(true)

  return (
    <BlackPage>
      <WideContent style={{ height: '100%' }}>
        <Row
          style={{ width: '100%', height: '100%', justifyContent: 'center' }}
        >
          <Cell
            col={10}
            colSm={9}
            colMd={8}
            colLg={7}
            colXl={6}
            style={{ justifyContent: 'center' }}
          >
            <MigrationToolBlockContainer direction="column">
              {step === 0 && (
                <ConnectWalletStep
                  nextStep={nextStep}
                  openWalletPopup={openWalletPopup}
                />
              )}
              {step === 1 && <CreateNewWalletStep nextStep={nextStep} />}
              {step === 2 && (
                <SpecifyWalletAddressStep
                  nextStep={nextStep}
                  setSendToWalletAddress={setSendToWalletAddress}
                />
              )}
              {step === 3 && (
                <MigratePositionsStep
                  operationType="withdraw"
                  sendToWalletAddress={sendToWalletAddress}
                  nextStep={nextStep}
                />
              )}
              {step === 4 && (
                <ConnectNewWalletStep
                  nextStep={nextStep}
                  openWalletPopup={openWalletPopup}
                />
              )}
              {step === 5 && (
                <MigratePositionsStep
                  operationType="deposit"
                  sendToWalletAddress={sendToWalletAddress}
                  nextStep={nextStep}
                />
              )}
              {step === 6 && <SuccessStep />}
            </MigrationToolBlockContainer>
          </Cell>
          <ConnectWalletPopup
            open={isConnectWalletPopupOpen}
            connectCallback={() => nextStep()}
            onClose={() => setIsConnectWalletPopupOpen(false)}
          />
        </Row>
      </WideContent>
    </BlackPage>
  )
}

export { MigrationTool }
