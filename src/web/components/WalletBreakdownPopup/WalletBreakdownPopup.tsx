import { DexInstructions } from '@project-serum/serum'
import { Transaction } from '@solana/web3.js'
import useMobileSize from '@webhooks/useMobileSize'
import BN from 'bn.js'
import copy from 'clipboard-copy'
import { orderBy } from 'lodash'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { compose } from 'recompose'

import { formatSymbol } from '@sb/components/AllocationBlock/DonutChart/utils'
import { Modal } from '@sb/components/Modal'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenName } from '@sb/dexUtils/markets'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import { useWallet } from '@sb/dexUtils/wallet'
import { useCurrentUserOpenOrders } from '@sb/hooks/useCurrentUserOpenOrders'

import { getSignedMoonpayUrl } from '@core/api'
import { DEX_PID } from '@core/config/dex'
import { getDexTokensPrices as getDexTokensPricesRequest } from '@core/graphql/queries/pools/getDexTokensPrices'
import { walletAdapterToWallet } from '@core/solana'
import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'
import { stripByAmountAndFormat } from '@core/utils/numberUtils'

import copyIcon from './images/copy.svg'
import disconnectIcon from './images/disconnect.svg'
import infoCircleIcon from './images/info-circle.svg'
import topUpIcon from './images/top-up.svg'
import {
  PrimaryCard,
  CloseIcon,
  BottomText,
  Title,
  Header,
  Footer,
  Wallet,
  PrimaryCardTop,
  PrimaryCardBottom,
  WalletName,
  PrimaryCardTopLeft,
  PrimaryCardTopRight,
  PrimaryCardBottomLeft,
  PrimaryCardBottomRight,
  Balance,
  BalanceValue,
  BalanceTitle,
  ClaimGasButton,
  TopUpButton,
  TopUpButtonText,
  AssetsTop,
  AssetsTitleLeft,
  AssetsList,
  AssetsTitleRight,
  AssetsListItem,
  AssetsListItemLeft,
  AssetsListItemRight,
  AssetInfo,
  AssetTitle,
  AssetSubtitle,
  DisconnectButton,
  CopyButton,
  GasCashbackLabel,
  GasCashbackValue,
} from './WalletBreakdownPopup.styles'

const modalContentStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

const modalRootStyle = {
  backdropFilter: 'none',
  justifyContent: 'flex-start',
}

type WalletBreakdownPopupProps = {
  onClose: () => void
  open: boolean
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}

const OPEN_ORDER_ACCOUNT_SOL_COST = 0.024

const WalletBreakdownPopup = ({
  onClose,
  open,
  getDexTokensPricesQuery,
}: WalletBreakdownPopupProps) => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { wallet } = useWallet()
  const connection = useConnection()
  const [tokensList, refreshUserTokenList] = useUserTokenAccounts()
  const { enqueueSnackbar } = useSnackbar()
  const isMobile = useMobileSize()
  const tokenMap = useTokenInfos()
  const [openOrders, refreshOpenOrders] = useCurrentUserOpenOrders()

  const FREE_SLOT_BITS_MAX = new BN('f'.repeat(32), 16) // https://doc.rust-lang.org/std/u128/constant.MAX.html

  const openOrderWhichMightBeClosed = openOrders.filter(
    (item) =>
      item.freeSlotBits.eq(FREE_SLOT_BITS_MAX) &&
      item.baseTokenFree.eqn(0) &&
      item.quoteTokenFree.eqn(0)
  )

  const modalBodyStyle = isMobile
    ? {
        height: '90%',
        width: '100%',
      }
    : {
        alignSelf: 'flex-end',
        marginTop: '75px',
        marginRight: '24px',
        maxHeight: '80vh',
      }

  const { getDexTokensPrices = [] } = getDexTokensPricesQuery || {
    getDexTokensPrices: [],
  }

  const tokenPricesMap = getDexTokensPrices.reduce(
    (curr, next) => curr.set(next.symbol, next.price),
    new Map()
  )

  const tokensListWithUsdPrice = orderBy(
    tokensList.map((item) => ({
      ...item,
      usdPrice: item.amount * (tokenPricesMap.get(item.symbol) || 0),
    })),
    (item) => (item.symbol === 'SOL' ? Infinity : item.usdPrice),
    ['desc']
  )

  const totalBalanceInUsd = tokensListWithUsdPrice.reduce(
    (curr, next) => curr + next.usdPrice,
    0
  )

  const onTopUpButtonClick = async () => {
    const signedUrl = await getSignedMoonpayUrl(wallet)

    window.open(signedUrl, '_blank, location=yes')
  }

  const onClaimGasClick = async () => {
    setIsClaiming(true)

    const transaction = new Transaction()
    const walletWithPk = walletAdapterToWallet(wallet)

    openOrderWhichMightBeClosed.forEach((item) => {
      transaction.add(
        DexInstructions.closeOpenOrders({
          market: item.market,
          openOrders: item.address,
          owner: item.owner,
          solWallet: wallet.publicKey,
          programId: DEX_PID,
        })
      )
    })

    await signAndSendSingleTransaction({
      wallet: walletWithPk,
      connection,
      transaction,
      commitment: 'finalized',
    })

    await refreshUserTokenList()
    await refreshOpenOrders()

    setIsClaiming(false)
  }

  return (
    <Modal
      onClose={onClose}
      open={open}
      width="24em"
      styles={{
        root: modalRootStyle,
        body: modalBodyStyle,
        content: modalContentStyle,
      }}
    >
      <Header>
        <Title>Wallet</Title>
        <CloseIcon onClick={onClose}>Esc</CloseIcon>
      </Header>

      <PrimaryCard>
        <PrimaryCardTop>
          <PrimaryCardTopLeft>
            <Wallet>
              <SvgIcon src={wallet.icon} width="1em" height="100%" />
              <WalletName>
                {formatSymbol({ symbol: wallet.publicKey.toString() })}
              </WalletName>
            </Wallet>
          </PrimaryCardTopLeft>
          <PrimaryCardTopRight>
            <CopyButton
              onClick={() => {
                copy(wallet.publicKey.toString())
                enqueueSnackbar('Wallet address copied to the clipboard', {
                  variant: 'success',
                })
              }}
            >
              <SvgIcon src={copyIcon} height="16px" />
            </CopyButton>
            <DisconnectButton onClick={() => wallet.disconnect()}>
              <SvgIcon src={disconnectIcon} height="16px" />
            </DisconnectButton>
          </PrimaryCardTopRight>
        </PrimaryCardTop>
        <PrimaryCardBottom>
          <PrimaryCardBottomLeft>
            <Balance>
              <BalanceTitle>Balance</BalanceTitle>
              <BalanceValue>
                $ {stripByAmountAndFormat(totalBalanceInUsd, 2)}
              </BalanceValue>
            </Balance>
          </PrimaryCardBottomLeft>
          <PrimaryCardBottomRight>
            <TopUpButton onClick={() => onTopUpButtonClick()}>
              <SvgIcon src={topUpIcon} height="12px" />
              <TopUpButtonText>Top Up</TopUpButtonText>
            </TopUpButton>
          </PrimaryCardBottomRight>
        </PrimaryCardBottom>
      </PrimaryCard>

      {!!tokensListWithUsdPrice.length && (
        <>
          <AssetsTop>
            <AssetsTitleLeft>Assets</AssetsTitleLeft>
            <AssetsTitleRight>In your diamond hands</AssetsTitleRight>
          </AssetsTop>

          <AssetsList>
            {tokensListWithUsdPrice
              .filter((item) => !!item.amount && tokenMap.has(item.mint))
              .map((item) => (
                <AssetsListItem key={item.symbol}>
                  <AssetsListItemLeft>
                    <TokenIcon mint={item.mint} size={36} />
                    <AssetInfo>
                      <AssetTitle>
                        {getTokenName({
                          address: item.mint,
                          tokensInfoMap: tokenMap,
                        })}
                      </AssetTitle>
                      <AssetSubtitle>
                        {stripByAmountAndFormat(item.amount)}
                      </AssetSubtitle>
                    </AssetInfo>
                  </AssetsListItemLeft>
                  <AssetsListItemRight>
                    ${stripByAmountAndFormat(item.usdPrice, 2)}
                  </AssetsListItemRight>
                </AssetsListItem>
              ))}
          </AssetsList>
        </>
      )}

      <Footer>
        <BottomText>
          <GasCashbackLabel>Gas Cashback:</GasCashbackLabel>
          <GasCashbackValue>
            {`${stripByAmountAndFormat(
              openOrderWhichMightBeClosed.length * OPEN_ORDER_ACCOUNT_SOL_COST
            )} SOL`}
          </GasCashbackValue>

          <DarkTooltip title="When you trade on the Serum or swap through the Serum route you pay 0.024 SOL to rent an “open order account” which can be closed with rent fee return. Press “Claim” button on the right to close your “open order” accounts.">
            <span>
              <SvgIcon
                src={infoCircleIcon}
                width="10px"
                height="10px"
                style={{
                  marginLeft: '0.4em',
                }}
              />
            </span>
          </DarkTooltip>
        </BottomText>
        <ClaimGasButton
          disabled={!openOrderWhichMightBeClosed.length}
          onClick={onClaimGasClick}
        >
          {isClaiming ? 'Claiming ...' : 'Claim'}
        </ClaimGasButton>
      </Footer>
    </Modal>
  )
}

export default compose(
  queryRendererHoc({
    query: getDexTokensPricesRequest,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: COMMON_REFRESH_INTERVAL,
  })
)(WalletBreakdownPopup)
