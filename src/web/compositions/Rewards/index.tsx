import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'
import QueryRenderer from '@core/components/QueryRenderer'
import { getTotalVolumeForSerumKey } from '@core/graphql/queries/chart/getTotalVolumeForSerumKey'

import './index'

import serum from '@icons/Serum.svg'
import decefi from '@icons/decefi.svg'

import { withTheme } from '@material-ui/styles'
import { useWallet } from '@sb/dexUtils/wallet'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Link } from 'react-router-dom'

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
} from 'react-vis'

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

const Example = (props) => {
  const axisStyle = {
    ticks: {
      fontSize: '7px',
      color: '#f65683',
      fontFamily: 'DM Sans',
    },
    title: {
      fontSize: '16px',
      color: '#333',
    },
    stroke: {
      background: '#f65683',
      color: '#f65683',
    },
    text: {
      fontSize: '7px',
    },
  }

  return (
    <FlexibleXYPlot
      style={{ stroke: props.theme.palette.dark.main, fontSize: '9px' }}
    >
      <VerticalGridLines style={{ stroke: '#f65683', color: '#f65683' }} />
      <HorizontalGridLines style={{ stroke: '#f65683', color: '#f65683' }} />
      <XAxis
        hideLine
        // title="Volume of SRM market buy, $"
        labelFormat={(v) => `Value is ${v}`}
        labelValues={[2]}
        // tickValues={[0, 200000, 1000000, 2000000, 10000000, 20000000, 50000000, 100000000, 150000000, 200000000, 400000000]}
        tickValues={[0, 200000, 1000000, 2000000, 10000000]}
        tickFormat={(v) => {
          if (v >= 1000000) {
            return `${v / 1000000} m`
          } else {
            return `${v / 1000} k`
          }
        }}
        style={axisStyle}
      />
      <YAxis
        // title="Reward DCFI"
        hideLine
        labelValues={[2]}
        tickFormat={(v) => {
          if (v >= 1000000) {
            return `${v / 1000000} m`
          } else {
            return `${v / 1000} k`
          }
        }}
        style={axisStyle}
        tickValues={[0, 200000, 400000, 600000, 800000]}
        // tickValues={[0, 200000, 400000, 600000, 800000, 1000000, 1200000, 1400000, 1600000, 1800000, 2000000, ]}
      />
      <MarkSeries
        size={10}
        fill={props.theme.palette.red.chart}
        data={[{ x: 0, y: 0 }]}
      />
      <LineSeries
        // curve={'curveMonotoneX'}
        style={{
          strokeLinejoin: 'round',
          stroke: props.theme.palette.red.chart,
          strokeWidth: '.4rem',
          boxShadow: '0px 0px 12px rgba(218, 255, 224, 0.65);',
        }}
        data={[
          { y: 0, x: 0 },
          { y: 200000, x: 200000 },
          { y: 400000, x: 1000000 },
          { y: 600000, x: 2000000 },
          { y: 800000, x: 10000000 },
        ]}
        // data={[{y: 0, x: 0}, {y: 200000, x: 200000}, {y: 400000, x: 1000000}, {y: 600000, x: 2000000}, {y: 800000, x: 10000000}, {y: 1000000, x: 20000000}, {y: 1200000, x: 50000000}, {y: 1400000, x: 100000000}, {y: 1600000, x: 150000000}, {y: 1800000, x: 200000000}, {y: 2000000, x: 400000000}]}
      />
    </FlexibleXYPlot>
  )
}

const RewardsRoute = (props) => {
  const {
    theme,
    getTotalVolumeForSerumKeyQuery,
    getTotalVolumeForSerumKeyQueryRefetch,
    publicKey,
  } = props

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
              {getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey.srmTraded.toFixed(
                1
              )}
            </Value>{' '}
            <CardText theme={theme} width={'auto'}>
              SRM traded
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
              {(
                +getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey
                  .dcfiEarned +
                +getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey
                  .dcfiCurrentRoundEst
              ).toFixed(3)}
            </Value>{' '}
            <CardText theme={theme} width={'auto'}>
              DCFI earned
            </CardText>
            <Link
              to={'/chart'}
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
                textTransform={'none'}
              >
                Harvest (coming soon)
              </BtnCustom>
            </Link>
          </RowContainer>
        </Card>
      </div>
      <RowContainer style={{ paddingTop: '5rem', paddingBottom: '10rem' }}>
        {/* <Card style={{ width: 'calc(40% - 4rem)' }} theme={theme}>
          <RowContainer style={{ height: '60%' }}>
            asfsafa
          </RowContainer>
          <RowContainer style={{ height: '40%' }}>
            saasf
          </RowContainer>
        </Card> */}
        <Card
          style={{
            position: 'relative',
            width: 'calc(100% - 4rem)',
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
          <Example theme={theme} />
          <ChartTitle
            style={{ position: 'absolute', bottom: '2rem', right: '1rem' }}
          >
            Volume of SRM market buy, $
          </ChartTitle>
        </Card>
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
      withOutSpinner={false}
      variables={{
        publicKey,
      }}
      publicKey={publicKey}
      {...props}
    />
  )
}

export default compose(withTheme())(Wrapper)
