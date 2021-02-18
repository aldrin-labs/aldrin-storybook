import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import { compose } from 'recompose'
import { Dialog, Paper } from '@material-ui/core'
import { PublicKey } from '@solana/web3.js'
import { Market, MARKETS, TOKEN_MINTS } from '@project-serum/serum'
import { graphql } from 'react-apollo'
import {
  getSecondValueFromFirst,
  GreenSwitcherStyles,
  RedSwitcherStyles,
  DisabledSwitcherStyles,
  BlueSwitcherStyles,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/utils'
import CustomSwitcher, {
  SwitcherHalf,
} from '@sb/components/SwitchOnOff/CustomSwitcher'

import { notify } from '@sb/dexUtils//notifications'
import { isValidPublicKey } from '@sb/dexUtils//utils'
import { useAccountInfo, useConnection } from '@sb/dexUtils/connection'
import { Loading } from '@sb/components/index'

// const { Text } = Typography;
import Clear from '@material-ui/icons/Clear'
import {
  TypographyTitle,
  StyledDialogContent,
  ClearButton,
  StyledDialogTitle,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { addContactCoin } from '@core/graphql/mutations/chart/addContactCoin'

import { Input } from '@sb/compositions/Addressbook/index'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { PurpleButton } from '@sb/compositions/Addressbook/components/Popups/NewCoinPopup'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import ListNewMarketPopup from './ListNewMarketPopup'
import { addSerumCustomMarket } from '@core/graphql/mutations/chart/addSerumCustomMarket'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getUserCustomMarkets } from '@core/graphql/queries/serum/getUserCustomMarkets'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
`

const StyledInput = styled(Input)`
  height: 4rem;
`

const Text = styled.span`
  font-size: 1.5rem;
  padding-bottom: ${(props) => props.paddingBottom};
  text-transform: none;
  color: ${(props) =>
    props.type === 'danger'
      ? '#E04D6B'
      : props.type === 'warning'
      ? '#f4d413'
      : '#ecf0f3'};
`

const CustomMarketDialog = ({
  open,
  onAddCustomMarket,
  onClose,
  theme,
  history,
  addSerumCustomMarketMutation,
  publicKey,
  getUserCustomMarketsQueryRefetch,
  getSerumMarketDataQueryRefetch
}) => {
  const [showCreateMarketPopup, changeShowCreateMarketPopup] = useState(false)
  const connection = useConnection()

  const [marketId, setMarketId] = useState('')
  const [loading, changeLoading] = useState(false)

  const [marketLabel, setMarketLabel] = useState('')
  const [baseLabel, setBaseLabel] = useState('')
  const [quoteLabel, setQuoteLabel] = useState('')
  const [isPrivate, setAsPrivate] = useState(false)

  const [market, setMarket] = useState(null)
  const [loadingMarket, setLoadingMarket] = useState(false)

  const wellFormedMarketId = isValidPublicKey(marketId)

  const [marketAccountInfo] = useAccountInfo(
    wellFormedMarketId ? new PublicKey(marketId) : null
  )
  const programId = marketAccountInfo
    ? marketAccountInfo.owner.toBase58()
    : MARKETS.find(({ deprecated }) => !deprecated).programId.toBase58()

  useEffect(() => {
    if (!wellFormedMarketId || !programId) {
      resetLabels()
      return
    }
    setLoadingMarket(true)
    Market.load(
      connection,
      new PublicKey(marketId),
      {},
      new PublicKey(programId)
    )
      .then((market) => {
        setMarket(market)
      })
      .catch(() => {
        resetLabels()
        setMarket(null)
      })
      .finally(() => setLoadingMarket(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, marketId, programId])

  const resetLabels = () => {
    setMarketLabel(null)
    setBaseLabel(null)
    setQuoteLabel(null)
  }

  const knownMarket = MARKETS.find(
    (m) =>
      m.address.toBase58() === marketId && m.programId.toBase58() === programId
  )
  const knownProgram = MARKETS.find((m) => m.programId.toBase58() === programId)
  const knownBaseCurrency =
    market?.baseMintAddress &&
    TOKEN_MINTS.find((token) => token.address.equals(market.baseMintAddress))
      ?.name

  const knownQuoteCurrency =
    market?.quoteMintAddress &&
    TOKEN_MINTS.find((token) => token.address.equals(market.quoteMintAddress))
      ?.name

  const canSubmit =
    !loadingMarket &&
    !!market &&
    market.publicKey.toBase58() === marketId &&
    marketId &&
    programId &&
    marketLabel &&
    (knownBaseCurrency || baseLabel) &&
    (knownQuoteCurrency || quoteLabel) &&
    wellFormedMarketId

  const onSubmit = async () => {
    if (!canSubmit) {
      notify({
        message: 'Please fill in all fields with valid values',
        type: 'error',
      })
      return
    }

    let params = {
      address: marketId,
      programId,
      name: marketLabel,
    }
    if (!knownBaseCurrency) {
      params.baseLabel = baseLabel
    }
    if (!knownQuoteCurrency) {
      params.quoteLabel = quoteLabel
    }

    console.log('knownBaseCurrency || baseLabel', )
    console.log('knownQuoteCurrency || quoteLabel', )

    if (!marketLabel.includes('_')) {
      notify({
        message: 'Please use "_" for devider',
        type: 'error',
      })
      return
    }

    await changeLoading(true)

    const resultOfAdding = await onAddCustomMarket(params)
    if (resultOfAdding) {
      await addSerumCustomMarketMutation({
        variables: {
          publicKey: publicKey,
          symbol: `${knownBaseCurrency || baseLabel}/${knownQuoteCurrency || quoteLabel}`,
          isPrivate: isPrivate,
          marketId,
          programId
        },
      })
    } else {
      await changeLoading(false)
      await onDoClose()
      return
    }

    // await getUserCustomMarketsQueryRefetch()
    // await getSerumMarketDataQueryRefetch()

    await changeLoading(false)

    await onDoClose()

    await history.push(
      `/chart/spot/${knownBaseCurrency || baseLabel}_${knownQuoteCurrency ||
        quoteLabel}`
    )
  }

  const onDoClose = () => {
    resetLabels()
    setMarket(null)
    setMarketId(null)
    onClose()
  }

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '85rem', margin: 'auto' }}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogTitle
        disableTypography
        theme={theme}
        style={{
          justifyContent: 'space-between',
          background: theme.palette.grey.input,
          borderBottom: `.1rem solid ${theme.palette.text.white}`,
        }}
      >
        <Text
          style={{
            fontSize: '1.8rem',
            color: theme.palette.text.light,
            fontFamily: 'Avenir Next Demi',
          }}
        >
          Add custom market
        </Text>
        <ClearButton>
          <Clear
            style={{ fontSize: '2rem' }}
            color="inherit"
            onClick={onClose}
          />
        </ClearButton>
      </StyledDialogTitle>
      <StyledDialogContent
        style={{ background: theme.palette.grey.input }}
        theme={theme}
        id="share-dialog-content"
      >
        <RowContainer margin={'2rem 0 0 0'}>
          <PurpleButton
            text={'List New Market'}
            width={'20rem'}
            height={'3.5rem'}
            background={theme.palette.green.main}
            onClick={() => {
              changeShowCreateMarketPopup(true)
            }}
          />
        </RowContainer>
        <RowContainer>
          <CustomSwitcher
            theme={theme}
            firstHalfText={'private'}
            secondHalfText={'public'}
            buttonHeight={'3rem'}
            containerStyles={{
              width: '100%',
              marginTop: '2rem',
              padding: 0,
            }}
            firstHalfStyleProperties={
              // pricePlotEnabled
              //   ? DisabledSwitcherStyles(theme)
              BlueSwitcherStyles(theme)
            }
            secondHalfStyleProperties={
              // pricePlotEnabled
              //   ? DisabledSwitcherStyles(theme)
              BlueSwitcherStyles(theme)
            }
            firstHalfIsActive={isPrivate}
            changeHalf={() => {
              setAsPrivate(!isPrivate)
            }}
          />
        </RowContainer>
        {wellFormedMarketId ? (
          <>
            <RowContainer margin={'2rem 0 0 0'}>
              {!market && !loadingMarket && (
                <Text type="danger">Not a valid market</Text>
              )}
              {market && knownMarket && (
                <Text type="warning">Market known: {knownMarket.name}</Text>
              )}
              {market && !knownProgram && (
                <Text type="danger">Warning: unknown DEX program</Text>
              )}
              {market && knownProgram && knownProgram.deprecated && (
                <Text type="warning">Warning: deprecated DEX program</Text>
              )}
            </RowContainer>
          </>
        ) : (
          <>
            {marketId && !wellFormedMarketId && (
              <RowContainer margin={'2rem 0 0 0'}>
                <Text type="danger">Invalid market ID</Text>
              </RowContainer>
            )}
          </>
        )}
        <RowContainer margin={'2rem 0 0 0'}>
          <StyledInput
            theme={theme}
            placeholder="Market Id"
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            // suffix={loadingMarket ? <Loading /> : null}
          />
        </RowContainer>
        <RowContainer margin={'1rem 0 0 0'}>
          <StyledInput
            theme={theme}
            placeholder="Market Label"
            disabled={!market}
            value={marketLabel}
            onChange={(e) => setMarketLabel(e.target.value)}
          />
        </RowContainer>
        <RowContainer margin={'1rem 0 2rem 0'} align={'flex-start'}>
          <Row
            width={'calc(50% - .5rem)'}
            margin={'0 .5rem 0 0'}
            justify={'flex-start'}
          >
            <StyledInput
              theme={theme}
              placeholder="Base label"
              disabled={!market || knownBaseCurrency}
              value={knownBaseCurrency || baseLabel}
              onChange={(e) => setBaseLabel(e.target.value)}
            />
            {market && !knownBaseCurrency && (
              <div>
                <Text type="warning">Warning: unknown token</Text>
              </div>
            )}
          </Row>
          <Row
            width={'calc(50% - .5rem)'}
            margin={'0 0 0 .5rem'}
            justify={'flex-start'}
          >
            <StyledInput
              theme={theme}
              placeholder="Quote label"
              disabled={!market || knownQuoteCurrency}
              value={knownQuoteCurrency || quoteLabel}
              onChange={(e) => setQuoteLabel(e.target.value)}
            />
            {market && !knownQuoteCurrency && (
              <div>
                <Text type="warning">Warning: unknown token</Text>
              </div>
            )}
          </Row>
        </RowContainer>
        <RowContainer justify={'center'}>
          <PurpleButton
            margin={'0 0 0 0rem'}
            text={'Add Market'}
            width={'20rem'}
            height={'4rem'}
            showLoader={loading}
            onClick={(e) => {
              e.preventDefault()
              if (publicKey === '') {    
                notify({
                  message: 'Connect your wallet first',
                  type: 'error',
                })

                return
              }

              onSubmit()
            }}
          />
        </RowContainer>
      </StyledDialogContent>
      <ListNewMarketPopup
        open={showCreateMarketPopup}
        onClose={() => changeShowCreateMarketPopup(false)}
        theme={theme}
      />
    </DialogWrapper>
  )
}

export default compose(
  withRouter,
  withPublicKey,
  // queryRendererHoc({
  //   query: getUserCustomMarkets,
  //   name: 'getUserCustomMarketsQuery',
  //   fetchPolicy: 'cache-first',
  //   variables: (props) => ({
  //     publicKey: props.publicKey,
  //   }),
  // }),
  graphql(addSerumCustomMarket, { name: 'addSerumCustomMarketMutation' })
)(CustomMarketDialog)
