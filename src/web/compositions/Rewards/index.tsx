import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Loading } from '@sb/components/Loading/Loading'

import SvgIcon from '@sb/components/SvgIcon'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { getTotalVolumeForSerumKey } from '@core/graphql/queries/chart/getTotalVolumeForSerumKey'
import { getTotalSerumVolume } from '@core/graphql/queries/chart/getTotalSerumVolume'

import { addSerumTransaction } from '@core/graphql/mutations/chart/addSerumTransaction'

import serum from '@icons/Serum.svg'
import decefi from '@icons/decefi.svg'
import blackTwitter from '@icons/blackTwitter.svg'

import { withTheme } from '@material-ui/styles'
import { useWallet } from '@sb/dexUtils/wallet'
import { notify } from '@sb/dexUtils/notifications'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Link } from 'react-router-dom'
// import { Circle } from 'rc-progress';
import { CircularProgressbar as Circle } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { useWallet } from '@sb/dexUtils/wallet'

import { Styles } from './index.styles'
import { Chart } from './components/Chart'
import { Canvas } from './components/Canvas'

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
  border-radius: 1.6rem;
  border: 1px solid ${(props) => props.border || props.theme.palette.grey.block};
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
  color: ${(props) => props.color || props.theme.palette.text.grey};
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

const CardText = styled(Text)`
  font-weight: bold;
`

export const Value = styled.div`
  color: ${(props) => props.color || props.theme.palette.text.grey};

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
  background: ${(props) => props.color || theme.palette.blue.serum};
  border-radius: 4px;
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
`

const CardSubValue = styled.span`
  color: #c7ffd0;
  font-family: DM Sans;
  font-weight: bold;
  font-size: 2rem;
  letter-spacing: 0.1rem;
`

const Form = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
`

const LinkInput = styled.input`
  padding-left: 1.5rem;
  border: 0.1rem solid #c7ffd0;
  border-radius: 0.8rem;
  background-color: transparent;
  height: 5rem;
  width: calc((100% - 4rem) / 2);
  margin-right: 1rem;
  color: ${(props) => props.color || theme.palette.grey.light};
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
  const [isLoading, updateIsLoading] = useState(false)
  const {
    theme,
    getTotalVolumeForSerumKeyQuery,
    getTotalVolumeForSerumKeyQueryRefetch,
    publicKey,
    addSerumTransactionMutation,
    getTotalSerumVolumeQueryRefetch,
  } = props

  const tradedSerumInUSDT =
    props.getTotalSerumVolumeQuery.getTotalSerumVolume.usdVolume
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
        <Title style={{ paddingBottom: '1rem' }} theme={theme}>
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
              backgroundColor={'#C7FFD0'}
              hoverBackground={'#C7FFD0'}
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
              backgroundColor={'#C7FFD0'}
              hoverBackground={'#C7FFD0'}
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
          <RowContainer style={{ height: '30%' }}>
            <SvgIcon src={decefi} width="30%" height="auto" />
          </RowContainer>
          <RowContainer
            justify={'space-around'}
            style={{
              height: '50%',
              flexDirection: 'column',
            }}
          >
            <Value theme={theme}>{stripDigitPlaces(dcfiEarned, 3)}</Value>{' '}
            <CardText
              theme={theme}
              width={'auto'}
              avernikoz
              style={{ paddingBottom: '1rem' }}
            >
              DCFI earned
            </CardText>
            <RowContainer>
              <Link
                to={'/chart'}
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
                  backgroundColor={theme.palette.blue.serum}
                  hoverBackground={theme.palette.blue.serum}
                  padding={'1.5rem 0'}
                  height={'5rem'}
                  fontSize={'1.6rem'}
                  btnWidth={'100%'}
                  textTransform={'none'}
                >
                  Harvest (coming soon)
                </BtnCustom>
              </Link>
              <a
                style={{
                  width: 'calc(50% - 2rem)',
                  textDecoration: 'none',
                  paddingBottom: '1rem',
                  margin: '0 1rem',
                }}
                href={`https://twitter.com/intent/tweet?text=I%20have%20already%20farmed%20${dcfiEarnedForTwitter}%20%24DCFI%20on%20dex.cryptocurrencies.ai%0A%0AHow%20to%20farm%20%24DCFI%20by%20%24SRM%20trading%3A%0Ahttps%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dyz5uaN0aCyw%26feature%3Dyoutu.be%0A%0A%40decefi_official%20%40CCAI_Official%0A%0Apic.twitter.com%2FJmNK1mE4vx%20`}
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
                >
                  <SvgIcon
                    src={blackTwitter}
                    width={'2.5rem'}
                    height={'2.5rem'}
                    style={{ marginRight: '1rem' }}
                  />{' '}
                  Share
                </BtnCustom>
              </a>
            </RowContainer>
            <RowContainer>
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
                    isLoading ? theme.palette.grey.text : '#C7FFD0'
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

                    if (result.data.addSerumTransaction.status === 'OK' || result.data.addSerumTransaction.status === 'SUCCESS') {
                      notify({
                        message: 'Your tweet farmed successfully!',
                        type: 'success',
                      })

                      setTimeout(() => {
                        getTotalVolumeForSerumKeyQueryRefetch && getTotalVolumeForSerumKeyQueryRefetch()
                        getTotalSerumVolumeQueryRefetch && getTotalSerumVolumeQueryRefetch()
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
          </RowContainer>
        </Card>
        <Card theme={theme}>
          <RowContainer
            style={{ paddingTop: '3%', paddingBottom: '4%', height: '40%' }}
          >
            <SvgIcon src={decefi} width="30%" height="auto" />
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
                  stroke: '#C7FFD0',
                  filter:
                    'drop-shadow(0px 0px 24px rgba(199, 255, 208, 0.67));',
                },
                trail: { stroke: '#0E1016' },
                text: {
                  fill: '#C7FFD0',
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

      <RowContainer style={{ paddingTop: '5rem', paddingBottom: '10rem' }}>
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
                  stroke: '#C7FFD0',
                  filter:
                    'drop-shadow(0px 0px 24px rgba(199, 255, 208, 0.67));',
                },
                trail: { stroke: '#0E1016' },
                text: {
                  fill: '#C7FFD0',
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
              justify={'space-around'}
              style={{ width: '50%', height: '30%', paddingLeft: '1rem' }}
            >
              <CardSubTitle>Total Volume</CardSubTitle>
              <CardSubValue>
                ${formatNumberToUSFormat(+tradedSerumInUSDT.toFixed(0))}
              </CardSubValue>
            </Row>
            <Row
              direction={'column'}
              align={'flex-start'}
              justify={'space-around'}
              style={{ width: '50%', height: '30%' }}
            >
              <CardSubTitle>Volume until next phase</CardSubTitle>
              <CardSubValue>
                $
                {formatNumberToUSFormat(
                  +(currentPhaseMaxVolume - tradedSerumInUSDT).toFixed(0)
                )}
              </CardSubValue>
            </Row>
            <Row
              direction={'column'}
              align={'flex-start'}
              justify={'space-around'}
              style={{ width: '50%', height: '30%', paddingLeft: '1rem' }}
            >
              <CardSubTitle>Total DCFI farmed</CardSubTitle>
              <CardSubValue>
                {formatNumberToUSFormat(+dcfiRewarded.toFixed(0))}
              </CardSubValue>
            </Row>
            <Row
              direction={'column'}
              align={'flex-start'}
              justify={'space-around'}
              style={{ width: '50%', height: '30%' }}
            >
              <CardSubTitle>DCFI until next phase</CardSubTitle>
              <CardSubValue>
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
    </div>
  )
}

const Wrapper = (props) => {
  const { wallet } = useWallet()
  const publicKey = wallet.publicKey ? wallet.publicKey.toBase58() : ''

  return (
    <QueryRenderer
      component={RewardsRoute}
      query={getTotalVolumeForSerumKey}
      name={'getTotalVolumeForSerumKeyQuery'}
      fetchPolicy={'network-only'}
      withOutSpinner={false}
      pollInterval={15000}
      variables={{
        publicKey,
      }}
      publicKey={publicKey}
      {...props}
    />
  )
}

export default compose(
  withTheme(),
  graphql(addSerumTransaction, { name: 'addSerumTransactionMutation' }),
  queryRendererHoc({
    query: getTotalSerumVolume,
    name: 'getTotalSerumVolumeQuery',
    pollInterval: 10000,
    fetchPolicy: 'cache-and-network',
  })
)(Wrapper)
