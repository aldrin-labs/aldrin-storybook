import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { getTotalVolumeForSerumKey } from '@core/graphql/queries/chart/getTotalVolumeForSerumKey'
import { getTotalSerumVolume } from '@core/graphql/queries/chart/getTotalSerumVolume'

import serum from '@icons/usdt.svg'
import decefi from '@icons/decefi.svg'

import { withTheme } from '@material-ui/styles'
import { useWallet } from '@sb/dexUtils/wallet'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Link } from 'react-router-dom'
import { Line } from 'rc-progress';

import { Styles } from './index.styles'
import { Chart } from './components/Chart'
import { Canvas } from './components/Canvas'

import { formatNumberToUSFormat, stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

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

export const srmVolumesInUSDT = [100000, 500000, 1000000, 5000000]
export const dcfiVolumes = [200000, 400000, 600000, 800000]
const volumeLabels = ['100k', '500k', '1m', '5m']

const getPhaseFromTotal = (total) => {  
  let phase = 0

  srmVolumesInUSDT.forEach(volume => {
    if (total > volume) {
      phase++
    }
  })

  return phase
}

const RewardsRoute = (props) => {
  const {
    theme,
    getTotalVolumeForSerumKeyQuery,
    getTotalVolumeForSerumKeyQueryRefetch,
    publicKey,
  } = props

  const tradedSerumInUSDT = props.getTotalSerumVolumeQuery.getTotalSerumVolume.usdVolume
  const currentPhase = getPhaseFromTotal(tradedSerumInUSDT)
  const currentPhaseMaxVolume = srmVolumesInUSDT[currentPhase]
  const currentPhaseMaxVolumeLabel = volumeLabels[currentPhase]

  const prevPhaseMaxVolume = currentPhase >= 1 ? srmVolumesInUSDT[currentPhase - 1] : 0
  const prevPhaseDCFIRewarded = currentPhase >= 1 ? dcfiVolumes[currentPhase - 1] : 0
  const dcfiRewarded = ((tradedSerumInUSDT - prevPhaseMaxVolume) / (currentPhaseMaxVolume - prevPhaseMaxVolume) * (dcfiVolumes[currentPhase] - prevPhaseDCFIRewarded)) + prevPhaseDCFIRewarded

  const dcfiEarned = +getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey.dcfiEarned + +getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey.dcfiCurrentRoundEst
  const dcfiEarnedForTwitter = formatNumberToUSFormat(dcfiEarned).replace(',', '%2C')

  useEffect(() => {
    getTotalVolumeForSerumKeyQueryRefetch({ publicKey: publicKey || '' })
  }, [publicKey])
  // console.log('getTotalVolumeForSerumKeyQuery', getTotalVolumeForSerumKeyQuery)
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
      <RowContainer style={{ padding: '10rem 0' }} direction={'column'}>
        <Title style={{ paddingBottom: '1rem' }} theme={theme}>
          Buy SRM and farm DCFI token
        </Title>
        {/* <Text theme={theme}>
          New farming algorithm designed by Cryptocurrencies.ai allows you
        </Text>
        <Text theme={theme}>
          to farm DCFI – token of our upcoming project. Stay tuned for news
        </Text> */}
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
            <SvgIcon src={serum} width="20%" height="auto" />
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
              )}
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
          <RowContainer style={{ height: '50%' }}>
            <SvgIcon src={decefi} width="30%" height="auto" />
          </RowContainer>
          <RowContainer
            justify={'space-around'}
            style={{
              height: '50%',
              flexDirection: 'column',
            }}
          >
            <Value theme={theme}>
              {stripDigitPlaces(
                dcfiEarned, 3
              )}
            </Value>{' '}
            <CardText theme={theme} width={'auto'}>
              DCFI earned
            </CardText>
            <RowContainer>
            <Link
              to={'/chart'}
              style={{
                width: 'calc(50% - 2rem)',
                textDecoration: 'none',
                paddingBottom: '1.5rem',
                margin: '0 1rem'
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
                paddingBottom: '1.5rem',
                margin: '0 1rem'
              }}
              href={`https://twitter.com/intent/tweet?text=I%20have%20already%20farmed%20${dcfiEarnedForTwitter}%20%24DCFI%20on%20dex.cryptocurrencies.ai%0A%0A%40decefi_official%20%40CCAI_Official%20%40ProjectSerum%20`} rel="noopener noreferrel" target={'_blank'}> 
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
                Share in Twitter
              </BtnCustom>
            </a>
            </RowContainer>
          </RowContainer>
        </Card>
      </div>
      <RowContainer style={{ paddingTop: '5rem', paddingBottom: '10rem' }}>
        <Card
          style={{ width: 'calc(40% - 4rem)', height: '50rem' }}
          theme={theme}
        >
          <RowContainer style={{ height: '40%' }}>
            <SvgIcon src={serum} width="20%" height="auto" />
          </RowContainer>
          <RowContainer style={{ height: '40%', position: 'relative', }}>
            <Line style={{ height: '50%', padding: '0 20% 4rem' }} gapDegree={90} percent={(tradedSerumInUSDT / currentPhaseMaxVolume * 100).toFixed(0)} strokeWidth="3" trailWidth="3" strokeColor="#C7FFD0" trailColor="#0E1016" />
            <Value theme={theme} style={{ position: 'relative', top: '2.5rem' }}>
              {formatNumberToUSFormat(
                +tradedSerumInUSDT.toFixed(1)
              )} / {currentPhaseMaxVolumeLabel}
            </Value>
            <CardText theme={theme} style={{ position: 'absolute', left: '20%' }}>
              Phase {getPhaseFromTotal(tradedSerumInUSDT)}
            </CardText>
            <CardText theme={theme} style={{ position: 'absolute', right: '20%' }}>
              Phase {getPhaseFromTotal(tradedSerumInUSDT) + 1}
            </CardText>
          </RowContainer>
          <RowContainer style={{ height: '20%' }}>
            <CardText theme={theme} >was already traded in USDT</CardText>
          </RowContainer>
        </Card>
        <Card
          style={{
            position: 'relative',
            width: 'calc(60% - 4rem)',
            height: '50rem',
            padding: '4rem 1rem 4rem 4rem',
          }}
          theme={theme}
        >
          <ChartTitle
            style={{ position: 'absolute', left: '4rem', top: '2rem' }}
          >
            Reward DCFI
          </ChartTitle>
          <Chart pointData={{ srmInUSDT: tradedSerumInUSDT, dcfi: dcfiRewarded }} theme={theme} />
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
  console.log('wallet.publicKey', publicKey)

  return (
    <QueryRenderer
      component={RewardsRoute}
      query={getTotalVolumeForSerumKey}
      name={'getTotalVolumeForSerumKeyQuery'}
      fetchPolicy={'network-only'}
      withOutSpinner={false}
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
  queryRendererHoc({
    query: getTotalSerumVolume,
    name: 'getTotalSerumVolumeQuery',
    fetchPolicy: 'cache-and-network'
  })
)(Wrapper)
