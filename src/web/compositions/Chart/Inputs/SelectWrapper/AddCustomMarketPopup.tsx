import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
// import { Row, Input, Modal, Row, Typography } from 'antd';
import { notify } from '@sb/dexUtils//notifications'
import { isValidPublicKey } from '@sb/dexUtils//utils'
import { PublicKey } from '@solana/web3.js'
import { Market, MARKETS, TOKEN_MINTS } from '@project-serum/serum'
import { useAccountInfo, useConnection } from '@sb/dexUtils/connection'
import { Loading } from '@sb/components/index'
import { Dialog, Paper } from '@material-ui/core'

// const { Text } = Typography;
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
import { PurpleButton } from '@sb/compositions/Addressbook/NewCoinPopup'

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
  color: ${props => props.type === 'danger' ? '#E04D6B' : props.type === 'warning' ? '#f4d413' : '#ecf0f3'};
`

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index'

const CustomMarketDialog = ({ visible, onAddCustomMarket, onClose, theme }) => {
  const connection = useConnection()

  const [marketId, setMarketId] = useState('')

  const [marketLabel, setMarketLabel] = useState('')
  const [baseLabel, setBaseLabel] = useState('')
  const [quoteLabel, setQuoteLabel] = useState('')

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

  const onSubmit = () => {
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
    onAddCustomMarket(params)
    onDoClose()
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
          justifyContent: 'center',
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
      </StyledDialogTitle>
      <StyledDialogContent
        style={{ background: theme.palette.grey.input }}
        theme={theme}
        id="share-dialog-content"
      >
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
          <Row width={'calc(50% - .5rem)'} margin={'0 .5rem 0 0'} justify={'flex-start'}>
            <StyledInput
              theme={theme}
              placeholder="Base label"
              disabled={!market || knownBaseCurrency}
              value={knownBaseCurrency || baseLabel}
              onChange={(e) => setBaseLabel(e.target.value)}
            />
            {market && !knownBaseCurrency && (
              <div style={{ marginTop: 8 }}>
                <Text type="warning">Warning: unknown token</Text>
              </div>
            )}
          </Row>
          <Row width={'calc(50% - .5rem)'} margin={'0 0 0 .5rem'} justify={'flex-start'}>
            <StyledInput
              theme={theme}
              placeholder="Quote label"
              disabled={!market || knownQuoteCurrency}
              value={knownQuoteCurrency || quoteLabel}
              onChange={(e) => setQuoteLabel(e.target.value)}
            />
            {market && !knownQuoteCurrency && (
              <div style={{ marginTop: 8 }}>
                <Text type="warning">Warning: unknown token</Text>
              </div>
            )}
          </Row>
        </RowContainer>
        <RowContainer justify={'flex-end'}>
          <PurpleButton margin={'0'} text={'Cancel'} width={'12rem'} height={'4rem'} onClick={onClose} />
          <PurpleButton margin={'0 0 0 2rem'} text={'Add'}  width={'12rem'} height={'4rem'} onClick={onSubmit} />
          </RowContainer>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default CustomMarketDialog
