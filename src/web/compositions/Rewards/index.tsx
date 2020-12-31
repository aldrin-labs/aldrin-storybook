import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import Timer from 'react-compound-timer'

import { HarvestPopup } from '@sb/compositions/Rewards/components/HarvestPopup'
import { SharePopup } from '@sb/compositions/Rewards/components/SharePopup'

import dayjs from 'dayjs'

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

import { Loading } from '@sb/components/Loading/Loading'

import SvgIcon from '@sb/components/SvgIcon'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { getTotalVolumeForSerumKey } from '@core/graphql/queries/chart/getTotalVolumeForSerumKey'
import { getTotalSerumVolume } from '@core/graphql/queries/chart/getTotalSerumVolume'
import { getTopTwitterFarming } from '@core/graphql/queries/serum/getTopTwitterFarming'
import { addSerumTransaction } from '@core/graphql/mutations/chart/addSerumTransaction'
import { getUserRetweetsHistory } from '@core/graphql/queries/serum/getUserRetweetsHistory'
import { getAllRetweetsHistory } from '@core/graphql/queries/serum/getAllRetweetsHistory'

import serum from '@icons/Serum.svg'
import decefi from '@icons/decefi.svg'
import blackTwitter from '@icons/blackTwitter.svg'
import greenTwitter from '@icons/greenTwitter.svg'
import greenDollar from '@icons/greenDollar.svg'
import greenArrow from '@icons/greenArrow.svg'
import greenTweet from '@icons/greenTweet.svg'
import lightSub from '@icons/lightSub.svg'
import lightBird from '@icons/lightBird.svg'
import shape from '@icons/shape.svg'

import { withTheme } from '@material-ui/styles'
import { useWallet } from '@sb/dexUtils/wallet'
import { notify } from '@sb/dexUtils/notifications'

import { withPublicKey } from '@core/hoc/withPublicKey'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

import { Link } from 'react-router-dom'
// import { Circle } from 'rc-progress';
import { CircularProgressbar as Circle } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { useWallet } from '@sb/dexUtils/wallet'

import { Styles } from './index.styles'
import { Chart } from './components/Chart'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { data } from '../Screener/Selector/selectsData'

export const BlockContainer = styled.div``

export const Card = styled.div`
  width: 35%;
  height: 45rem;
  background-color: ${(props) =>
    props.backgroundColor || props.theme.palette.white.block};
  margin: 0.7rem 1rem;
  border-radius: 0.8rem;
  border: 0.1rem solid
    ${(props) => props.border || props.theme.palette.grey.block};
  font-family: DM Sans;
  font-size: 1.12rem;
  letter-spacing: 0.06rem;
  text-transform: uppercase;
  color: ${(props) => props.color || props.theme.palette.text.grey};
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`
export const Title = styled.div`
  color: ${(props) => props.color || props.theme.palette.text.grey};
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 2.5rem;
`
export const Text = styled.div`
  color: ${(props) => props.color || props.theme.palette.text.black};
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  line-height: 2rem;
  border-bottom: none;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 1px;
  text-transform: none;
`

export const CardText = styled(Text)`
  font-weight: ${(props) => props.fontWeight || 'bold'};
  font-size: ${(props) => props.fontSize || '1.5rem'};
  .twitterRules {
    visibility: hidden;
    position: absolute;
  }

  &:hover .twitterRules {
    z-index: 100;
    visibility: visible;
    position: absolute;
  }
`

export const Value = styled.div`
  color: ${(props) => props.color || props.theme.palette.text.black};

  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 6rem;
`
export const Button = styled.button`
  width: 80%;
  height: 30%;
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  text-transform: capitalize;
  background: ${(props) => props.color || props.theme.palette.blue.serum};
  border-radius: 2px;
  border: none;
`

const ChartTitle = styled.span`
  color: #9f9f9f;
  font-size: 1.6rem;
  text-transform: capitalize;
`

const CardSubTitle = styled.h3`
  color: #9f9f9f;
  font-family: DM Sans;
  font-weight: bold;
  font-size: 1.6rem;
  text-transform: capitalize;
  margin: 0;
  padding-bottom: 0.5rem;
`

const CardSubValue = styled.span`
  color: ${(props) => props.theme.palette.green.shine};
  font-family: DM Sans;
  font-weight: bold;
  font-size: 2rem;
  letter-spacing: 0.1rem;
`

const CardSubValueForVolume = styled.span`
  color: #c7ffd0;
  font-family: DM Sans;
  font-weight: bold;
  font-size: 2rem;
  letter-spacing: 0.1rem;
  display: flex;
  flex-direction: column;
`

const Form = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
`

const LinkInput = styled.input`
  padding-left: 1.5rem;
  border: 0.1rem solid ${(props) => props.theme.palette.blue.serum};
  border-radius: 0.8rem;
  background-color: transparent;
  height: 5rem;
  width: calc((100% - 4rem) / 2);
  margin-right: 1rem;
  color: ${(props) => props.color || props.theme.palette.grey.light};
`

export const srmVolumesInUSDT = [
  100000,
  600000,
  1600000,
  6600000,
  16600000,
  41600000,
  91600000,
  166600000,
  266600000,
  466600000,
]
export const dcfiVolumes = [
  200000,
  400000,
  600000,
  800000,
  1000000,
  1200000,
  1400000,
  1600000,
  1800000,
  2000000,
]
const volumeLabels = [
  '100k',
  '600k',
  '1.6m',
  '6.6m',
  '16.6m',
  '41.6m',
  '91.6m',
  '166.6m',
  '266.6m',
  '466.6m',
]

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  & tr:last-child td {
    border-bottom: none;
  }
`
export const TableRow = styled.tr``

export const Cell = styled.td`
  border-bottom: 0.1rem solid ${(props) => props.borderBottom || '#61d8e6'};
  width: 25%;

  color: ${(props) => props.theme.palette.dark.main};
  height: 5rem;
  text-transform: none;
  margin: 3rem 1rem;
  padding-left: 2rem;

  font-size: 1.5rem;
  white-space: nowrap;

  &:first-child {
    width: 15%;
  }
`
export const HeaderCell = styled.th`
  border-bottom: 0.1rem solid ${(props) => props.borderBottom || '#61d8e6'};
  height: 5rem;

  padding-left: 2rem;
  // border: none;
  font-size: 1.6rem;
  text-transform: capitalize;
  color: ${(props) => props.theme.palette.grey.text};
  font-size: bold;
`

const getPhaseFromTotal = (total) => {
  let phase = 0

  srmVolumesInUSDT.forEach((volume) => {
    if (total > volume) {
      phase++
    }
  })

  return phase
}

const RewardsRoute = (props) => {
  const [linkFromTwitter, setTwittersLink] = useState('')

  const [isHarvestPopupOpen, setOpen] = useState(false)
  // const [isSharePopupOpen, setSharePopupOpen] = useState(false)

  const [isLoading, updateIsLoading] = useState(false)
  const {
    theme,
    getTotalVolumeForSerumKeyQuery,
    getTotalVolumeForSerumKeyQueryRefetch,
    publicKey,
    addSerumTransactionMutation,
    getTotalSerumVolumeQueryRefetch,
    getTotalSerumVolumeQuery,
    getTopTwitterFarmingQuery,
    getUserRetweetsHistoryQuery,
    getAllRetweetsHistoryQuery,
    getAllRetweetsHistoryQueryRefetch,
    getUserRetweetsHistoryQueryRefetch,
    getTopTwitterFarmingQueryRefetch,
  } = props

  const {
    getTotalSerumVolume = {
      usdVolume: 0,
      usdVolumeBounty: 0,
      usdVolumeTwitter: 0,
    },
  } = getTotalSerumVolumeQuery || {
    getTotalSerumVolume: {
      usdVolume: 0,
      usdVolumeBounty: 0,
      usdVolumeTwitter: 0,
    },
  }

  const {
    usdVolume = 0,
    usdVolumeBounty = 0,
    usdVolumeTwitter = 0,
  } = getTotalSerumVolume || {
    usdVolume: 0,
    usdVolumeBounty: 0,
    usdVolumeTwitter: 0,
  }

  const tradedSerumInUSDT = usdVolume

  const currentPhase = getPhaseFromTotal(tradedSerumInUSDT)
  const currentPhaseMaxVolume = srmVolumesInUSDT[currentPhase]
  const currentPhaseMaxVolumeLabel = volumeLabels[currentPhase]

  const prevPhaseMaxVolume =
    currentPhase >= 1 ? srmVolumesInUSDT[currentPhase - 1] : 0
  const prevPhaseDCFIRewarded =
    currentPhase >= 1 ? dcfiVolumes[currentPhase - 1] : 0

  const volumeTradedInThisPhase = tradedSerumInUSDT - prevPhaseMaxVolume

  const dcfiRewarded =
    (volumeTradedInThisPhase / (currentPhaseMaxVolume - prevPhaseMaxVolume)) *
      (dcfiVolumes[currentPhase] - prevPhaseDCFIRewarded) +
    prevPhaseDCFIRewarded
  const dcfiEarned =
    +getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey.dcfiEarned +
    +getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey
      .dcfiCurrentRoundEst
  const dcfiEarnedForTwitter = formatNumberToUSFormat(
    stripDigitPlaces(dcfiEarned, 3)
  ).replace(',', '%2C')

  const percantangeTotalShareDcfi = (dcfiEarned / dcfiRewarded) * 100

  const progressBarSerumValue = +(
    (volumeTradedInThisPhase / (currentPhaseMaxVolume - prevPhaseMaxVolume)) *
    100
  ).toFixed(0)

  useEffect(() => {
    getTotalVolumeForSerumKeyQueryRefetch({ publicKey: publicKey || '' })
  }, [publicKey])

  const { wallet } = useWallet()

  const updateLink = (e) => {
    setTwittersLink(e.target.value)
  }

  const {
    getTopTwitterFarming: getTopTwitterFarmingData = [],
  } = getTopTwitterFarmingQuery

  const { getUserRetweetsHistory = [] } = getUserRetweetsHistoryQuery || {
    getUserRetweetsHistory: [],
  }

  const { getAllRetweetsHistory = [] } = getAllRetweetsHistoryQuery || {
    getAllRetweetsHistory: [],
  }

  const toggleIsOpen = () => {
    setOpen(!isHarvestPopupOpen)
  }

  // const toggleSharePopupIsOpen = () => {
  //   setSharePopupOpen(!isSharePopupOpen)
  // }

  const isDarkTheme = theme.palette.type === 'dark'

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Styles />
      <RowContainer
        style={{ width: '100%', padding: '4rem 2rem' }}
        direction={'row'}
        justify={'space-between'}
      >
        <Title
          style={{ paddingBottom: '1rem', color: theme.palette.text.black }}
          theme={theme}
        >
          Buy SRM and farm DCFI token
        </Title>
        <RowContainer style={{ width: '32%' }}>
          <a
            rel="noopener noreferrel"
            target={'_blank'}
            href={'https://decefi.app/onePager'}
            style={{
              paddingBottom: '2rem',
              width: 'calc((100% - 4rem) / 2)',
              textDecoration: 'none',
              marginRight: '2rem',
            }}
          >
            <BtnCustom
              theme={theme}
              btnColor={theme.palette.grey.main}
              backgroundColor={theme.palette.green.shine}
              hoverBackground={theme.palette.green.shine}
              height={'5rem'}
              fontSize={'1.6rem'}
              btnWidth={'100%'}
              textTransform={'none'}
            >
              Decefi one-pager{' '}
            </BtnCustom>
          </a>
          <a
            rel="noopener noreferrel"
            target={'_blank'}
            href={
              'https://www.youtube.com/watch?v=yz5uaN0aCyw&feature=youtu.be'
            }
            style={{
              paddingBottom: '2rem',
              width: 'calc((100% - 4rem) / 2)',
              textDecoration: 'none',
            }}
          >
            <BtnCustom
              theme={theme}
              btnColor={theme.palette.grey.main}
              backgroundColor={theme.palette.green.shine}
              hoverBackground={theme.palette.green.shine}
              height={'5rem'}
              fontSize={'1.6rem'}
              btnWidth={'100%'}
              textTransform={'none'}
            >
              How to farm DCFI
            </BtnCustom>
          </a>
        </RowContainer>
      </RowContainer>
      <div
        style={{
          height: '70%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <Card theme={theme}>
          <RowContainer style={{ height: '50%' }}>
            <SvgIcon src={serum} width="13%" height="auto" />
          </RowContainer>
          <RowContainer
            justify={'space-around'}
            style={{
              height: '50%',
              flexDirection: 'column',
            }}
          >
            <Value theme={theme}>
              {getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey.usdTraded.toFixed(
                1
              )}{' '}
              USDT
            </Value>{' '}
            <CardText theme={theme} width={'auto'}>
              SRM traded in USDT
            </CardText>
            <Link
              to={'/chart/spot/SRM_USDT'}
              style={{
                width: '50%',
                textDecoration: 'none',
                paddingBottom: '1.5rem',
              }}
            >
              <BtnCustom
                theme={theme}
                btnColor={theme.palette.grey.main}
                backgroundColor={theme.palette.blue.serum}
                hoverBackground={theme.palette.blue.serum}
                padding={'1.5rem 0'}
                height={'5rem'}
                fontSize={'1.6rem'}
                btnWidth={'100%'}
                textTransform={'capitalize'}
              >
                trade
              </BtnCustom>
            </Link>
          </RowContainer>
        </Card>
        {/* <Card theme={theme}>
          <SvgIcon src={serum} width="11%" height="auto" />
          <Value theme={theme}>456.997</Value>{' '}
          <Text theme={theme} width={'auto'}>
            
          </Text>
          <Button></Button>
        </Card> */}
        <Card theme={theme}>
          <RowContainer style={{ height: '21%' }}>
            <SvgIcon
              src={isDarkTheme ? decefi : shape}
              width={isDarkTheme ? '30%' : '14%'}
              style={{ marginTop: isDarkTheme ? 'auto' : '4rem' }}
              height="auto"
            />
          </RowContainer>
          <RowContainer
            justify={'none'}
            style={{
              height: '55%',
              flexDirection: 'column',
            }}
          >
            <Value theme={theme}>{stripDigitPlaces(dcfiEarned, 3)}</Value>{' '}
            <CardText
              theme={theme}
              width={'auto'}
              style={{ paddingBottom: '1rem' }}
            >
              DCFI earned
            </CardText>
            <RowContainer>
              <HarvestPopup
                isHarvestPopupOpen={isHarvestPopupOpen}
                toggleIsOpen={toggleIsOpen}
              ></HarvestPopup>
              <a
                style={{
                  width: 'calc(50% - 2rem)',
                  textDecoration: 'none',
                  paddingBottom: '1rem',
                  margin: '0 1rem',
                }}
              >
                <BtnCustom
                  theme={theme}
                  btnColor={theme.palette.grey.main}
                  backgroundColor={theme.palette.green.acid}
                  hoverBackground={theme.palette.green.acid}
                  padding={'1.5rem 0'}
                  height={'5rem'}
                  fontSize={'1.6rem'}
                  btnWidth={'100%'}
                  textTransform={'none'}
                  onClick={() => {
                    toggleIsOpen()
                  }}
                >
                  Harvest
                </BtnCustom>
              </a>
              {/* <SharePopup
                theme={theme}
                dcfiEarnedForTwitter={dcfiEarnedForTwitter}
                isSharePopupOpen={isSharePopupOpen}
                toggleSharePopupIsOpen={toggleSharePopupIsOpen}
                publicKey={publicKey}
              /> */}
              <a
                style={{
                  width: 'calc(50% - 2rem)',
                  textDecoration: 'none',
                  paddingBottom: '1rem',
                  margin: '0 1rem',
                }}
                href={`https://twitter.com/intent/tweet?text=%E2%80%A2+%24BTC+another+ATH%2C+29k%0D%0A%E2%80%A2+The+amount+of+%24ETH+on+exchanges+is+at+a+yearly+low%0D%0A%E2%80%A2+VanEck+refiles+with+SEC+for+bitcoin+ETF%0D%0Ahttps%3A%2F%2Fcryptocurrencies.ai%2F+%E2%80%93+trade+spot+and+up+to+125x+leverage+futures+with+high+liquidity+and+advanced+trading+tools.%0D%0A%24CCAI+%24DCFI+%24SRM%0Apic.twitter.com/osR8gtV0Ce`}
                rel="noopener noreferrel"
                target={'_blank'}
                onClick={(e) => {
                  if (publicKey === '') {
                    e.preventDefault()
                    notify({
                      message: 'Connect your wallet first',
                      type: 'error',
                    })
                  }
                }}
              >
                <BtnCustom
                  theme={theme}
                  btnColor={theme.palette.grey.main}
                  backgroundColor={theme.palette.blue.serum}
                  hoverBackground={theme.palette.blue.serum}
                  padding={'1.5rem 0'}
                  height={'5rem'}
                  fontSize={'1.6rem'}
                  btnWidth={'100%'}
                  textTransform={'none'}
                  onClick={() => {
                    console.log('shrepopup')
                    // toggleSharePopupIsOpen()
                  }}
                >
                  <SvgIcon
                    src={isDarkTheme ? blackTwitter : lightBird}
                    width={'2.5rem'}
                    height={'2.5rem'}
                    style={{ marginRight: '1rem' }}
                  />{' '}
                  Share
                </BtnCustom>
              </a>
            </RowContainer>
            <RowContainer style={{ paddingBottom: '1rem' }}>
              <Form>
                <LinkInput
                  value={linkFromTwitter}
                  onChange={updateLink}
                  theme={theme}
                  type="text"
                  placeholder="Your retweet link..."
                />
                <BtnCustom
                  disabled={isLoading}
                  theme={theme}
                  btnColor={theme.palette.grey.main}
                  backgroundColor={
                    isLoading
                      ? theme.palette.grey.text
                      : theme.palette.blue.serum
                  }
                  height={'5rem'}
                  btnWidth={'calc((100% - 4rem) / 2)'}
                  fontSize={'1.6rem'}
                  textTransform={'none'}
                  btnHeight={'3rem'}
                  margin={'0 0 0 1rem'}
                  onClick={async (e) => {
                    if (publicKey === '') {
                      e.preventDefault()
                      notify({
                        message: 'Connect your wallet first',
                        type: 'error',
                      })
                      return
                    }

                    if (linkFromTwitter === '') {
                      e.preventDefault()
                      notify({
                        message: 'Your twitter link is empty',
                        type: 'error',
                      })

                      return
                    }

                    updateIsLoading(true)
                    const result = await addSerumTransactionMutation({
                      variables: {
                        fee: 0,
                        amount: 0,
                        dexId: linkFromTwitter,
                        publicKey: wallet.publicKey.toBase58(),
                        price: 0,
                        fromTwitter: true,
                      },
                    })
                    await updateIsLoading(false)
                    if (result.data.addSerumTransaction.status === 'ERR') {
                      notify({
                        message: result.data.addSerumTransaction.errorMessage,
                        type: 'error',
                      })
                    }

                    if (
                      result.data.addSerumTransaction.status === 'OK' ||
                      result.data.addSerumTransaction.status === 'SUCCESS'
                    ) {
                      notify({
                        message: 'Your tweet farmed successfully!',
                        type: 'success',
                      })

                      setTimeout(() => {
                        getTotalVolumeForSerumKeyQueryRefetch &&
                          getTotalVolumeForSerumKeyQueryRefetch()
                        getTotalSerumVolumeQueryRefetch &&
                          getTotalSerumVolumeQueryRefetch()
                        getTopTwitterFarmingQueryRefetch &&
                          getTopTwitterFarmingQueryRefetch()
                        getUserRetweetsHistoryQueryRefetch &&
                          getUserRetweetsHistoryQueryRefetch()
                        getAllRetweetsHistoryQueryRefetch &&
                          getAllRetweetsHistoryQueryRefetch()
                      }, 1000)
                    }

                    console.log('link', linkFromTwitter)
                  }}
                >
                  {isLoading ? (
                    <Loading
                      style={{ paddingTop: '0.7rem' }}
                      size={24}
                      color={'#C7FFD0'}
                    />
                  ) : (
                    'Farm $DCFI for tweet'
                  )}
                </BtnCustom>
              </Form>
            </RowContainer>
            <RowContainer style={{ position: 'absolute', top: '63rem' }}>
              <CardText color={theme.palette.green.descrip} theme={theme}>
                Twitter farming rules
                <div
                  className="twitterRules"
                  style={{ transform: 'translateX(-35.5%) translateY(52%)' }}
                >
                  <Card
                    style={{ width: '60rem', height: '40rem' }}
                    theme={theme}
                  >
                    <RowContainer
                      style={{
                        width: '90%',
                        borderBottom: '2px solid #424B68',
                        paddingBottom: '2rem',
                      }}
                    >
                      <CardText fontWeight={'400'} theme={theme}>
                        Share a tweet and earn $DCFI everyday
                      </CardText>
                    </RowContainer>

                    <RowContainer>
                      <CardText
                        theme={theme}
                        fontSize={'2rem'}
                        fontWeight={'400'}
                      >
                        Requirements
                      </CardText>
                    </RowContainer>
                    <RowContainer>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '50%',
                          alignItems: 'center',
                        }}
                      >
                        <SvgIcon
                          src={greenTweet}
                          width={'3rem'}
                          height={'3rem'}
                          style={{ marginBottom: '2rem' }}
                        />
                        <CardText theme={theme} fontSize={'2rem'}>
                          At least 200 DCFI
                        </CardText>
                        <CardText fontWeight={'400'} theme={theme}>
                          should be farmed by trading SRM{' '}
                        </CardText>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '50%',
                          alignItems: 'center',
                        }}
                      >
                        <SvgIcon
                          src={lightSub}
                          width={'3rem'}
                          height={'3rem'}
                          style={{ marginBottom: '2rem' }}
                        />
                        <CardText theme={theme} fontSize={'2rem'}>
                          At least 100 followers
                        </CardText>
                        <CardText fontWeight={'400'} theme={theme}>
                          should be on your Twitter account
                        </CardText>
                      </div>
                    </RowContainer>
                    <RowContainer
                      style={{
                        borderTop: '2px solid #424B68',
                        paddingTop: '2rem',
                        width: '90%',
                      }}
                    >
                      <CardText
                        fontWeight={'400'}
                        theme={theme}
                        style={{ width: '90%' }}
                      >
                        Every day 2000 $DCFI reward will be distributed between
                        Top-20 accounts that made $DCFI retweet, ranked by
                        followers count. If there were less than 20 retweets,
                        the reward will be distributed among all
                      </CardText>
                    </RowContainer>
                  </Card>
                </div>
              </CardText>
              <SvgIcon
                src={greenArrow}
                width={'1.3rem'}
                height={'1.3rem'}
                style={{ marginLeft: '1rem' }}
              />{' '}
            </RowContainer>
          </RowContainer>
        </Card>
        <Card theme={theme}>
          <RowContainer
            style={{ paddingTop: '3%', paddingBottom: '4%', height: '40%' }}
          >
            <SvgIcon
              src={isDarkTheme ? decefi : shape}
              width={isDarkTheme ? '30%' : '14%'}
              style={{ marginTop: isDarkTheme ? 'auto' : '4rem' }}
              height="auto"
            />
          </RowContainer>
          <RowContainer
            style={{
              height: '34%',
              position: 'relative',
            }}
          >
            <Circle
              styles={{
                root: { height: '100%' },
                path: {
                  stroke: theme.palette.green.shine,
                  filter:
                    'drop-shadow(0px 0px 24px rgba(199, 255, 208, 0.67));',
                },
                trail: { stroke: theme.palette.grey.circle },
                text: {
                  fill: theme.palette.green.shine,
                  fontWeight: 'bold',
                  transform: 'translateY(3%)',
                },
              }}
              value={percantangeTotalShareDcfi}
              strokeWidth={21}
              text={`${percantangeTotalShareDcfi.toFixed(0)} %`}
            />
          </RowContainer>
          <RowContainer
            justify={'space-around'}
            style={{
              height: '20%',
            }}
          >
            <CardText theme={theme}>of total share</CardText>
          </RowContainer>
        </Card>
      </div>

      <RowContainer style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <Card
          style={{
            width: 'calc(40% - 4rem)',
            height: '60rem',
            padding: '0 3rem',
          }}
          theme={theme}
        >
          <RowContainer
            style={{
              height: '60%',
              position: 'relative',
              borderBottom: '.1rem solid #61D8E6',
            }}
          >
            <Circle
              styles={{
                root: { height: '100%', padding: '7rem 0 3rem 0' },
                path: {
                  stroke: theme.palette.green.shine,
                  filter:
                    'drop-shadow(0px 0px 24px rgba(199, 255, 208, 0.67));',
                },
                trail: { stroke: theme.palette.grey.circle },
                text: {
                  fill: theme.palette.green.shine,
                  fontWeight: 'bold',
                  transform: 'translateY(3%)',
                },
              }}
              value={progressBarSerumValue}
              strokeWidth={16}
              text={`${progressBarSerumValue} %`}
            />
            {/* <Value theme={theme} style={{ position: 'relative', top: '2.5rem' }}>
              {formatNumberToUSFormat(
                +tradedSerumInUSDT.toFixed(1)
              )} / {currentPhaseMaxVolumeLabel}
            </Value> */}
            <CardText
              theme={theme}
              style={{
                position: 'absolute',
                left: '50%',
                top: '3.5rem',
                transform: 'translate(-50%, -50%)',
              }}
            >
              Phase {getPhaseFromTotal(tradedSerumInUSDT) + 1}
            </CardText>
          </RowContainer>
          <RowContainer style={{ height: '40%' }}>
            <Row
              direction={'column'}
              align={'flex-start'}
              justify={'flex-start'}
              wrap={'nowrap'}
              width={'50%'}
              height={'35%'}
              style={{ paddingLeft: '1rem' }}
            >
              <DarkTooltip
                delay={'50'}
                placement={'top'}
                title={'Farming Volume = Trade Volume + Twitter Points'}
              >
                <CardSubTitle>Total Volume</CardSubTitle>
              </DarkTooltip>
              <CardSubValueForVolume theme={theme}>
                <Row justify={'flex-start'} style={{ paddingBottom: '.5rem' }}>
                  <SvgIcon
                    src={greenDollar}
                    width={'2.5rem'}
                    height={'2.5rem'}
                    style={{ marginRight: '1rem' }}
                  />
                  <span>
                    {formatNumberToUSFormat(
                      +(
                        usdVolume -
                        (usdVolumeTwitter + usdVolumeBounty)
                      ).toFixed(0)
                    )}
                  </span>
                </Row>
                <DarkTooltip
                  delay={500}
                  title={`+ ${formatNumberToUSFormat(
                    usdVolumeBounty.toFixed(0)
                  )} bounty`}
                >
                  <Row>
                    <SvgIcon
                      src={greenTwitter}
                      width={'2.5rem'}
                      height={'2.5rem'}
                      style={{ marginRight: '1rem' }}
                    />
                    <span style={{ color: theme.palette.green.shine }}>
                      {formatNumberToUSFormat(
                        +(usdVolumeTwitter + usdVolumeBounty).toFixed(0)
                      )}
                    </span>
                  </Row>
                </DarkTooltip>
                {/* twitter + bounty */}
              </CardSubValueForVolume>
            </Row>
            <Row
              direction={'column'}
              align={'flex-start'}
              justify={'flex-start'}
              width={'50%'}
              height={'35%'}
            >
              <CardSubTitle>Volume until next phase</CardSubTitle>
              <CardSubValue theme={theme}>
                $
                {formatNumberToUSFormat(
                  +(currentPhaseMaxVolume - tradedSerumInUSDT).toFixed(0)
                )}
              </CardSubValue>
            </Row>
            <Row
              direction={'column'}
              align={'flex-start'}
              justify={'flex-start'}
              width={'50%'}
              height={'35%'}
              style={{ paddingLeft: '1rem' }}
            >
              <CardSubTitle>Total DCFI farmed</CardSubTitle>
              <CardSubValue theme={theme}>
                {formatNumberToUSFormat(+dcfiRewarded.toFixed(0))}
              </CardSubValue>
            </Row>
            <Row
              direction={'column'}
              align={'flex-start'}
              justify={'flex-start'}
              width={'50%'}
              height={'35%'}
            >
              <CardSubTitle>DCFI until next phase</CardSubTitle>
              <CardSubValue theme={theme}>
                {formatNumberToUSFormat(
                  +(dcfiVolumes[currentPhase] - dcfiRewarded).toFixed(0)
                )}
              </CardSubValue>
            </Row>
          </RowContainer>
        </Card>
        <Card
          style={{
            position: 'relative',
            width: 'calc(60% - 4rem)',
            height: '60rem',
            padding: '4rem 1rem 4rem 4rem',
          }}
          theme={theme}
        >
          <ChartTitle
            style={{ position: 'absolute', left: '4rem', top: '2rem' }}
          >
            Reward DCFI
          </ChartTitle>
          <Chart
            pointData={{ srmInUSDT: tradedSerumInUSDT, dcfi: dcfiRewarded }}
            theme={theme}
          />
          <ChartTitle
            style={{ position: 'absolute', bottom: '2rem', right: '1rem' }}
          >
            Volume of SRM market buy, $
          </ChartTitle>
        </Card>
        {/* <Card theme={theme}>
          <Canvas dcfiEarned={dcfiEarned} />
        </Card> */}
      </RowContainer>
      <RowContainer
        direction={'column'}
        align={'flex-start'}
        style={{ paddingBottom: '10rem' }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '69%',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            {' '}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: 'row',
                color: '#9f9f9f',
                paddingBottom: '3rem',
              }}
            >
              <Title style={{ color: theme.palette.text.black }} theme={theme}>
                Twitter Farming Leaderboard{' '}
              </Title>
              <a
                style={{
                  fontFamily: 'DM Sans',
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  paddingLeft: '.5rem',
                }}
              >
                Today
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CardSubTitle>Until next round: </CardSubTitle>
              <div
                style={{
                  color: theme.palette.green.shine,
                  fontSize: '2.5rem',
                  fontFamily: 'DM Sans',
                  fontWeight: 'bold',
                  marginLeft: '2rem',
                }}
              >
                <Timer
                  initialTime={
                    +dayjs
                      .utc()
                      .endOf('day')
                      .valueOf() - +dayjs.utc().valueOf()
                  }
                  formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
                  direction="backward"
                  startImmediately={true}
                  checkpoints={[
                    {
                      time: 0,
                      callback: () => {
                        console.log('funding rate finished')
                        // getFundingRateQueryRefetch()
                        // this.setState((prev) => ({ key: prev.key + 1 }))
                      },
                    },
                  ]}
                >
                  {() => (
                    <React.Fragment>
                      <Timer.Hours />
                      {':'}
                      <Timer.Minutes />
                      {':'}
                      <Timer.Seconds />
                    </React.Fragment>
                  )}
                </Timer>
              </div>
            </div>
          </div>

          <Card
            style={{
              width: '70%',
              height: 'auto',
              padding: '0 3rem',
            }}
            theme={theme}
          >
            <Table>
              <TableRow>
                <HeaderCell theme={theme}>#</HeaderCell>
                <HeaderCell theme={theme}>Name</HeaderCell>
                <HeaderCell theme={theme}>Twitter Id</HeaderCell>
                <HeaderCell theme={theme}>Followers</HeaderCell>
                <HeaderCell theme={theme}>Reward</HeaderCell>
              </TableRow>
              {getTopTwitterFarmingData.map((el, index) => {
                return (
                  <TableRow>
                    <Cell theme={theme}>{index + 1}</Cell>
                    <Cell theme={theme}>{el.tweetUsername}</Cell>
                    <Cell theme={theme}>
                      <a
                        style={{
                          color: theme.palette.green.shine,
                          textDecoration: 'none',
                        }}
                        href={'https://twitter.com/' + el.tweetUsername}
                      >
                        {'@' + el.tweetUsername}
                      </a>
                    </Cell>
                    <Cell theme={theme}>{el.userFollowersCount}</Cell>
                    <Cell theme={theme}>
                      {(2000 / getTopTwitterFarmingData.length).toFixed(0) +
                        ' DCFI'}
                    </Cell>
                  </TableRow>
                )
              })}
            </Table>
          </Card>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '69%',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingTop: '4rem',
            }}
          >
            <Title
              style={{ paddingBottom: '3rem', color: theme.palette.text.black }}
              theme={theme}
            >
              Your retweet history{' '}
            </Title>
            <CardSubTitle style={{ display: 'flex', alignItems: 'center' }}>
              Total farmed:{' '}
              <div
                style={{
                  color: theme.palette.green.shine,
                  fontSize: '2.5rem',
                  fontFamily: 'DM Sans',
                  fontWeight: 'bold',
                  marginLeft: '2rem',
                }}
              >
                {getUserRetweetsHistory
                  .reduce((acc, currentEl) => acc + currentEl.farmedDCFI, 0)
                  .toFixed(0)}{' '}
                {'DCFI'}
              </div>
            </CardSubTitle>
          </div>

          <Card
            style={{
              width: '70%',
              height: 'auto',
              padding: '0 3rem',
            }}
            theme={theme}
          >
            <Table>
              <TableRow>
                <HeaderCell theme={theme}>Date</HeaderCell>
                <HeaderCell theme={theme}>Tweet</HeaderCell>
                <HeaderCell theme={theme}>Reward</HeaderCell>
              </TableRow>
              {getUserRetweetsHistory.map((el, index) => {
                return (
                  <TableRow>
                    <Cell theme={theme}>
                      {dayjs.unix(el.timestamp).format('ll')}
                    </Cell>
                    <Cell
                      theme={theme}
                      style={{
                        color: theme.palette.green.shine,
                        textDecoration: 'none',
                      }}
                    >
                      {el.tweetLink}
                    </Cell>
                    <Cell theme={theme}>{el.farmedDCFI.toFixed(0)}</Cell>
                  </TableRow>
                )
              })}
            </Table>
          </Card>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '3rem',
          }}
        >
          <div
            style={{
              width: '69%',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            {' '}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: 'row',
                color: '#9f9f9f',
                paddingBottom: '3rem',
              }}
            >
              <Title style={{ color: theme.palette.text.black }} theme={theme}>
                Twitter Farming History{' '}
              </Title>
              <a
                style={{
                  fontFamily: 'DM Sans',
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  paddingLeft: '.5rem',
                }}
              >
                All time
              </a>
            </div>
            <CardSubTitle style={{ display: 'flex', alignItems: 'center' }}>
              Total farmed:{' '}
              <div
                style={{
                  color: theme.palette.green.shine,
                  fontSize: '2.5rem',
                  fontFamily: 'DM Sans',
                  fontWeight: 'bold',
                  marginLeft: '2rem',
                }}
              >
                {getAllRetweetsHistory
                  .reduce((acc, currentEl) => acc + currentEl.farmedDCFI, 0)
                  .toFixed(0)}{' '}
                {'DCFI'}
              </div>
            </CardSubTitle>
          </div>

          <Card
            style={{
              width: '70%',
              height: 'auto',
              padding: '0 3rem',
            }}
            theme={theme}
          >
            <Table>
              <TableRow>
                <HeaderCell theme={theme}>#</HeaderCell>
                <HeaderCell theme={theme}>Name</HeaderCell>
                <HeaderCell theme={theme}>Twitter Id</HeaderCell>
                <HeaderCell theme={theme}>Followers</HeaderCell>
                <HeaderCell theme={theme}>Reward</HeaderCell>
              </TableRow>
              {getAllRetweetsHistory.map((el, index) => {
                return (
                  <TableRow>
                    <Cell theme={theme}>{index + 1}</Cell>
                    <Cell theme={theme}>{el.tweetUsername}</Cell>
                    <Cell theme={theme}>
                      <a
                        style={{
                          color: theme.palette.green.shine,
                          textDecoration: 'none',
                        }}
                        href={'https://twitter.com/' + el.tweetUsername}
                      >
                        {'@' + el.tweetUsername}
                      </a>
                    </Cell>
                    <Cell theme={theme}>{el.userFollowersCount}</Cell>
                    <Cell theme={theme}>{el.farmedDCFI.toFixed(0)}</Cell>
                  </TableRow>
                )
              })}
            </Table>
          </Card>
        </div>
      </RowContainer>
    </div>
  )
}

export default compose(
  withTheme(),
  withPublicKey,
  graphql(addSerumTransaction, { name: 'addSerumTransactionMutation' }),
  queryRendererHoc({
    query: getTotalSerumVolume,
    name: 'getTotalSerumVolumeQuery',
    pollInterval: 10000,
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: getTopTwitterFarming,
    name: 'getTopTwitterFarmingQuery',
    pollInterval: 60000,
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: getUserRetweetsHistory,
    name: 'getUserRetweetsHistoryQuery',
    pollInterval: 60000,
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      publicKey: props.publicKey,
    }),
    skip: (props: any) => !props.publicKey,
  }),
  queryRendererHoc({
    query: getTotalVolumeForSerumKey,
    name: 'getTotalVolumeForSerumKeyQuery',
    pollInterval: 15000,
    fetchPolicy: 'network-only',
    variables: (props) => ({
      publicKey: props.publicKey,
    }),
    // skip: (props: any) => !props.publicKey,
  }),
  queryRendererHoc({
    query: getAllRetweetsHistory,
    name: 'getAllRetweetsHistoryQuery',
    pollInterval: 60000,
    fetchPolicy: 'cache-and-network',
  })
)(RewardsRoute)
