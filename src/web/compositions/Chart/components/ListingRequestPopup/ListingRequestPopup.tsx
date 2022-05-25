import React, { useEffect, useState } from 'react'

import { Text } from '@sb/compositions/Addressbook/index'
import { Theme, withTheme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import CloseIcon from '@icons/closeIcon.svg'
import CoolIcon from '@icons/coolIcon.svg'

import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import { encode, isValidPublicKey } from '@sb/dexUtils/utils'
import { notify } from '@sb/dexUtils/notifications'
import { SRadio } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection, useConnectionConfig } from '@sb/dexUtils/connection'
import { PublicKey } from '@solana/web3.js'
import { getDexProgramIdByEndpoint } from '@core/config/dex'
import { Market, MARKETS, TOKEN_MINTS } from '@project-serum/serum'
import { useAllMarketsList, useAllMarketsMapById } from '@sb/dexUtils/markets'
import { compose } from 'recompose'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { addSerumCustomMarket } from '@core/graphql/mutations/chart/addSerumCustomMarket'
import { writeQueryData } from '@core/utils/TradingTable.utils'
import { getUserCustomMarkets } from '@core/graphql/queries/serum/getUserCustomMarkets'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { Link, useHistory } from 'react-router-dom'
import { Loading } from '@sb/components/Loading'
import { checkForLinkOrUsername } from '@sb/dexUtils/checkForLinkOrUsername'
import { graphql } from 'react-apollo'
import {
  categoriesOfMarkets,
  defaultRequestDataState,
} from './ListingRequestPopup.config'
import {
  BlueButton,
  Form,
  StyledPaper,
  SubmitButton,
  TextField,
  Title,
  StyledLabel,
  StyledTab,
} from '../../Inputs/SelectWrapper/SelectWrapperStyles'
import {
  BannerContainer,
  BT1,
  BT2,
  BT3,
  BT4,
  ApplyButton,
  Line as ApplyLine,
} from './styles'

const ListingRequestPopup = ({
  theme,
  onClose,
  open,
  customMarkets,
  setCustomMarkets,
  addSerumCustomMarketMutation,
  getUserCustomMarketsQuery,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  customMarkets: any
  setCustomMarkets: (markets: any[]) => void
  addSerumCustomMarketMutation: any
  getUserCustomMarketsQuery: any
}) => {
  const [loadingMarket, setLoadingMarket] = useState(false)
  const [isRequestSubmitted, submitRequest] = useState(false)
  const [market, setMarket] = useState(null)
  const [loading, changeLoading] = useState(false)
  const [newMarketAccountInfo, setNewMarketAccountInfo] = useState(null)
  const [requestData, setRequestData] = useState(defaultRequestDataState)

  const { wallet } = useWallet()
  const connection = useConnection()
  const history = useHistory()
  const { endpoint } = useConnectionConfig()

  const allMarketsMap = useAllMarketsList()
  const allMarketsMapById = useAllMarketsMapById()

  const setData = ({ fieldName, value }) => {
    return setRequestData({ ...requestData, [fieldName]: value })
  }

  const handleSubmit = (e) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'listingRequest',
        ...requestData,
      }),
    })
      .then(() => {
        submitRequest(true)
      })
      .catch((error) => {
        console.log(error)
        notify({
          type: 'error',
          message: 'Something went wrong, please try again.',
        })
      })

    e.preventDefault()
  }

  const onAddCustomMarket = (customMarket: any) => {
    const marketInfo = [...allMarketsMap.values()].some(
      (m) => m.address.toBase58() === customMarket.address
    )

    if (marketInfo) {
      notify({
        message: `A market with the given ID already exists`,
        type: 'error',
      })

      return false
    }

    const newCustomMarkets = [...customMarkets, customMarket]
    setCustomMarkets(newCustomMarkets)
    history.push(`/chart/spot/${customMarket.name.replace('/', '_')}`)
    return true
  }

  const { publicKey } = wallet

  const wellFormedMarketId = isValidPublicKey(requestData.marketID)

  const programId = newMarketAccountInfo
    ? newMarketAccountInfo.owner.toBase58()
    : getDexProgramIdByEndpoint(endpoint)?.toString()

  useEffect(() => {
    if (!wellFormedMarketId || !programId) {
      return
    }
    setLoadingMarket(true)
    Market.load(
      connection,
      new PublicKey(requestData.marketID),
      {},
      new PublicKey(programId)
    )
      .then((market) => {
        setMarket(market)
      })
      .catch(() => {
        setMarket(null)
      })
      .finally(() => setLoadingMarket(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, requestData.marketID, programId])

  useEffect(() => {
    const fetch = async () => {
      const marketAccountInfo = await connection.getAccountInfo(
        new PublicKey(requestData.marketID)
      )
      setNewMarketAccountInfo(marketAccountInfo)
    }

    wellFormedMarketId && fetch()
  }, [requestData.marketID, wellFormedMarketId])

  const marketLabel = requestData.baseTokenName.concat(
    '_',
    requestData.quoteTokenName
  )

  const knownMarketByName = allMarketsMap.has(marketLabel)
  const knownMarketById = allMarketsMapById.has(requestData.marketID)

  const knownProgram = MARKETS.find((m) => m.programId.toBase58() === programId)

  const knownBaseCurrency =
    market?.baseMintAddress &&
    TOKEN_MINTS.find((token) => token.address.equals(market.baseMintAddress))
      ?.name

  const knownQuoteCurrency =
    market?.quoteMintAddress &&
    TOKEN_MINTS.find((token) => token.address.equals(market.quoteMintAddress))
      ?.name

  const isContactValid = checkForLinkOrUsername(requestData.contact)
  const canSubmit =
    !loadingMarket &&
    !!market &&
    market.publicKey.toBase58() === requestData.marketID &&
    requestData.marketID &&
    programId &&
    (knownBaseCurrency || requestData.baseTokenName) &&
    (knownQuoteCurrency || requestData.quoteTokenName) &&
    wellFormedMarketId &&
    isContactValid &&
    !knownMarketById &&
    !knownMarketByName

  const isDisabled =
    requestData.baseTokenName === '' ||
    requestData.quoteTokenName === '' ||
    requestData.marketID === '' ||
    requestData.contact === '' ||
    loading ||
    !canSubmit

  const onSubmit = async () => {
    if (!canSubmit) {
      notify({
        message: 'Please fill in all fields with valid values',
        type: 'error',
      })

      return
    }

    const params = {
      address: requestData.marketID,
      programId,
      name: marketLabel,
    }

    if (!knownBaseCurrency) {
      params.baseLabel = requestData.baseTokenName
    }
    if (!knownQuoteCurrency) {
      params.quoteLabel = requestData.quoteTokenName
    }

    await changeLoading(true)

    const resultOfAdding = await onAddCustomMarket(params)
    if (resultOfAdding) {
      await addSerumCustomMarketMutation({
        variables: {
          publicKey,
          symbol: `${knownBaseCurrency || requestData.baseTokenName}/${
            knownQuoteCurrency || requestData.quoteTokenName
          }`.toUpperCase(),
          isPrivate: false,
          marketId: requestData.marketID,
          programId,
        },
      })
    } else {
      await changeLoading(false)
      return
    }

    await changeLoading(false)

    await writeQueryData(
      getUserCustomMarkets,
      { publicKey },
      {
        getUserCustomMarkets: [
          ...getUserCustomMarketsQuery.getUserCustomMarkets,
          {
            isPrivate: false,
            marketId: requestData.marketID,
            programId,
            publicKey,
            symbol: `${knownBaseCurrency || requestData.baseTokenName}/${
              knownQuoteCurrency || requestData.quoteTokenName
            }`.toUpperCase(),
            __typename: 'SerumCustomMarket',
          },
        ],
      }
    )

    await notify({
      message: 'Your custom market successfully added.',
      type: 'success',
    })

    await history.push(
      `/chart/spot/${knownBaseCurrency || requestData.baseTokenName}_${
        knownQuoteCurrency || requestData.quoteTokenName
      }`
    )
    await submitRequest(true)
    await onDoClose()
  }

  const onDoClose = () => {
    setMarket(null)
    onClose()
  }

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      PaperProps={{ width: '135rem', height: '75rem' }}
      onEnter={() => {
        submitRequest(false)
        setRequestData(defaultRequestDataState)
      }}
      maxWidth="lg"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '1rem' }} justify="space-between">
        <Title>
          {isRequestSubmitted ? 'Request Submitted!' : 'List New Market'}
        </Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer' }}
          width="2rem"
          height="2rem"
        />
      </RowContainer>
      {isRequestSubmitted ? (
        <RowContainer direction="column">
          <SvgIcon
            src={CoolIcon}
            width="9rem"
            height="10rem"
            style={{ marginTop: '6rem' }}
          />
          <Text
            padding="0 1rem 0 0"
            style={{
              width: '50%',
              marginTop: '2rem',
              textAlign: 'center',
              whiteSpace: 'normal',
            }}
          >
            Thank you for your request, we will review it shortly and take
            action.
          </Text>
          <BlueButton
            style={{ width: '100%', margin: '6rem 0 0 0' }}
            disabled={false}
            theme={theme}
            onClick={() => {
              submitRequest(false)
              onClose()
            }}
          >
            Ok
          </BlueButton>
        </RowContainer>
      ) : (
        <Form
          onSubmit={handleSubmit}
          name="listingRequest"
          data-netlify="true"
          method="post"
          action="/success"
        >
          <RowContainer justify="space-between" height="100%">
            <Row height="100%" width="66%">
              <input type="hidden" name="form-name" value="listingRequest" />
              <input
                type="text"
                name="category"
                value={requestData.category.join(' ')}
                id="category"
                style={{ display: 'none' }}
              />
              <RowContainer justify="space-between">
                <Row width="49%">
                  <RowContainer wrap="nowrap">
                    <Text
                      fontSize="1.2rem"
                      padding="0 1rem 0 0"
                      whiteSpace="nowrap"
                    >
                      Base Token Name{' '}
                      <span style={{ color: '#FFBDAE' }}>*</span>
                    </Text>
                    <Line />
                  </RowContainer>
                  <RowContainer justify="space-between">
                    <TextField
                      height="5rem"
                      type="text"
                      name="baseTokenName"
                      id="baseTokenName"
                      autoComplete="off"
                      theme={theme}
                      placeholder="e.g. RIN"
                      value={requestData.baseTokenName}
                      onChange={(e) =>
                        setData({
                          fieldName: 'baseTokenName',
                          value: e.target.value,
                        })
                      }
                    />
                  </RowContainer>
                </Row>
                <Row width="49%">
                  <RowContainer wrap="nowrap">
                    <Text
                      fontSize="1.2rem"
                      padding="0 1rem 0 0"
                      whiteSpace="nowrap"
                    >
                      Quote Token Name{' '}
                      <span style={{ color: '#FFBDAE' }}>*</span>
                    </Text>
                    <Line />
                  </RowContainer>
                  <RowContainer justify="space-between">
                    <TextField
                      height="5rem"
                      type="text"
                      name="quoteTokenName"
                      id="quoteTokenName"
                      autoComplete="off"
                      theme={theme}
                      placeholder="e.g. USDC"
                      value={requestData.quoteTokenName}
                      onChange={(e) =>
                        setData({
                          fieldName: 'quoteTokenName',
                          value: e.target.value,
                        })
                      }
                    />
                  </RowContainer>
                </Row>
              </RowContainer>
              <RowContainer>
                <RowContainer wrap="nowrap">
                  <Text
                    fontSize="1.2rem"
                    padding="0 1rem 0 0"
                    whiteSpace="nowrap"
                  >
                    Market ID
                    <span style={{ color: '#FFBDAE', marginLeft: '0.5rem' }}>
                      *
                    </span>{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://docs.aldrin.com/dex/how-to-list-a-market-on-aldrin-dex"
                      style={{
                        color: theme.palette.blue.serum,
                        textDecoration: 'none',
                      }}
                    >
                      Learn More
                    </a>
                  </Text>
                  <Line />
                </RowContainer>
                <RowContainer justify="space-between">
                  <TextField
                    height="5rem"
                    type="text"
                    name="marketID"
                    id="marketID"
                    autoComplete="off"
                    theme={theme}
                    placeholder="e.g. 7gZNLDbWE73ueAoHuAeFoSu7JqmorwCLpNTBXHtYSFTa"
                    value={requestData.marketID}
                    onChange={(e) =>
                      setData({
                        fieldName: 'marketID',
                        value: e.target.value,
                      })
                    }
                  />
                </RowContainer>
              </RowContainer>{' '}
              {wellFormedMarketId ? (
                <RowContainer justify="flex-start">
                  {!market && !loadingMarket && (
                    <Text style={{ color: '#F69894' }}>Not a valid market</Text>
                  )}
                  {market && knownMarketById && (
                    <Text style={{ color: '#F69894' }}>
                      This market already exists and cannot be duplicated.
                    </Text>
                  )}
                  {market && !knownProgram && (
                    <Text style={{ color: '#F69894' }}>
                      Warning: unknown DEX program
                    </Text>
                  )}
                  {market && knownProgram && knownProgram.deprecated && (
                    <Text style={{ color: '#F69894' }}>
                      Warning: deprecated DEX program.
                    </Text>
                  )}
                </RowContainer>
              ) : requestData.marketID && !wellFormedMarketId ? (
                <RowContainer justify="flex-start" margin="2rem 0 0 0">
                  <Text style={{ color: '#F69894' }}>Invalid market ID</Text>
                </RowContainer>
              ) : (
                knownMarketByName && (
                  <Text style={{ color: '#F69894' }}>
                    Market with such name already exists and cannot be
                    duplicated.
                  </Text>
                )
              )}
              <RowContainer justify="space-between">
                <Row width="49%">
                  <RowContainer wrap="nowrap">
                    <Text
                      fontSize="1.2rem"
                      padding="0 1rem 0 0"
                      whiteSpace="nowrap"
                    >
                      Twitter Link
                    </Text>
                    <Line />
                  </RowContainer>
                  <RowContainer justify="space-between">
                    <TextField
                      height="5rem"
                      type="url"
                      name="twitterLink"
                      id="twitterLink"
                      autoComplete="off"
                      theme={theme}
                      placeholder="e.g. https://twitter.com/Aldrin_Exchange"
                      value={requestData.twitterLink}
                      onChange={(e) =>
                        setData({
                          fieldName: 'twitterLink',
                          value: e.target.value,
                        })
                      }
                    />
                  </RowContainer>
                </Row>
                <Row width="49%">
                  <RowContainer wrap="nowrap">
                    <Text
                      fontSize="1.2rem"
                      padding="0 1rem 0 0"
                      whiteSpace="nowrap"
                    >
                      Coinmarketcap or Coingecko Link{' '}
                    </Text>
                    <Line />
                  </RowContainer>
                  <RowContainer justify="space-between">
                    <TextField
                      height="5rem"
                      type="url"
                      name="coinMarketCapLink"
                      id="coinMarketCapLink"
                      autoComplete="off"
                      theme={theme}
                      placeholder="e.g. https://coinmarketcap.com/currencies/aldrin/"
                      value={requestData.coinMarketCapLink}
                      onChange={(e) =>
                        setData({
                          fieldName: 'coinMarketCapLink',
                          value: e.target.value,
                        })
                      }
                    />
                  </RowContainer>
                </Row>
              </RowContainer>
              <RowContainer>
                <RowContainer wrap="nowrap">
                  <Text
                    fontSize="1.2rem"
                    padding="0 1rem 0 0"
                    whiteSpace="nowrap"
                  >
                    Select the categories to which the project belongs
                  </Text>
                  <Line />
                </RowContainer>
                <RowContainer justify="space-between">
                  {categoriesOfMarkets.map((el) => {
                    return (
                      <StyledTab
                        key={el}
                        isSelected={requestData.category.includes(el)}
                        onClick={() => {
                          if (requestData.category.includes(el)) {
                            const indexOfElement =
                              requestData.category.findIndex(
                                (category) => category === el
                              )
                            setData({
                              fieldName: 'category',
                              value: [
                                ...requestData.category.slice(
                                  0,
                                  indexOfElement
                                ),
                                ...requestData.category.slice(
                                  indexOfElement + 1
                                ),
                              ],
                            })
                          } else {
                            setData({
                              fieldName: 'category',
                              value: [...requestData.category, el],
                            })
                          }
                        }}
                      >
                        {el}
                      </StyledTab>
                    )
                  })}
                </RowContainer>
              </RowContainer>
              <RowContainer justify="space-between">
                <Row width="49%">
                  <RowContainer wrap="nowrap">
                    <Text
                      fontSize="1.2rem"
                      padding="0 1rem 0 0"
                      whiteSpace="nowrap"
                    >
                      How to contact the team{' '}
                      <span style={{ color: '#FFBDAE' }}>*</span>
                    </Text>
                    <Line />
                  </RowContainer>
                  <RowContainer justify="space-between">
                    <TextField
                      height="5rem"
                      type="text"
                      name="contact"
                      id="contact"
                      autoComplete="off"
                      theme={theme}
                      placeholder="e.g. contact@aldrin.com"
                      value={requestData.contact}
                      onChange={(e) =>
                        setData({
                          fieldName: 'contact',
                          value: e.target.value,
                        })
                      }
                    />
                  </RowContainer>
                </Row>
                <Row width="49%" margin="2rem 0 0 0">
                  <RowContainer wrap="nowrap">
                    <Text
                      fontSize="1.2rem"
                      padding="0 1rem 0 0"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Would the team like to be interviewed on the{' '}
                      <a
                        href="https://www.youtube.com/channel/UCO6TDGIdWPQsa6Dio7GFbUQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.blue.serum,
                          textDecoration: 'none',
                        }}
                      >
                        Simplifi DeFi show
                      </a>
                      ?
                    </Text>
                    <Line />
                  </RowContainer>
                  <RowContainer
                    height="6rem"
                    justify="flex-start"
                    style={{ paddingTop: '1rem' }}
                  >
                    <Row margin="0 1.5rem 0 0">
                      <SRadio
                        id="noDefiShow"
                        checked={requestData.defiShow === 'No'}
                        onChange={(e) =>
                          setData({
                            fieldName: 'defiShow',
                            value: 'No',
                          })
                        }
                      />
                      <StyledLabel htmlFor="noDefiShow" color="#fbf2f2">
                        No
                      </StyledLabel>
                    </Row>{' '}
                    <Row>
                      <SRadio
                        id="yesDefiShow"
                        onChange={(e) =>
                          setData({
                            fieldName: 'defiShow',
                            value: 'Yes',
                          })
                        }
                        checked={requestData.defiShow === 'Yes'}
                      />
                      <StyledLabel htmlFor="yesDefiShow" color="#fbf2f2">
                        Yes
                      </StyledLabel>
                    </Row>
                  </RowContainer>
                </Row>{' '}
              </RowContainer>
              {requestData.contact !== '' && !isContactValid && (
                <RowContainer justify="flex-start">
                  <Text style={{ color: '#F69894' }}>
                    Not valid contact. Please, use @username or left link to
                    your contact.
                  </Text>
                </RowContainer>
              )}
              <RowContainer>
                <SubmitButton
                  isDisabled={isDisabled}
                  disabled={isDisabled}
                  theme={theme}
                  type="submit"
                >
                  {loading ? (
                    <Loading size={16} style={{ height: '16px' }} />
                  ) : (
                    'Submit'
                  )}
                </SubmitButton>
              </RowContainer>
            </Row>
            <Row
              width="33%"
              height="calc(100% - 2rem)"
              margin="2rem 0 0 0"
              style={{ alignSelf: 'flex-start' }}
            >
              <BannerContainer>
                <BT1>CREATE</BT1>
                <BT2>A LIQUIDITY</BT2>
                <BT3>POOL ON </BT3>
                <BT4>OUR AMM</BT4>
                <ApplyButton as={Link} onClick={onClose} to="/pools/create">
                  Click Here to Apply
                  <ApplyLine />
                </ApplyButton>
              </BannerContainer>
            </Row>
          </RowContainer>
        </Form>
      )}
    </DialogWrapper>
  )
}

export default compose(
  withMarketUtilsHOC,
  withTheme(),
  queryRendererHoc({
    query: getUserCustomMarkets,
    name: 'getUserCustomMarketsQuery',
    fetchPolicy: 'cache-only',
    variables: (props) => ({
      publicKey: props.publicKey,
    }),
  }),
  graphql(addSerumCustomMarket, { name: 'addSerumCustomMarketMutation' })
)(ListingRequestPopup)
