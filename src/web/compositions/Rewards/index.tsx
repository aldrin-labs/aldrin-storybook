import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'
import QueryRenderer from '@core/components/QueryRenderer'
import { getTotalVolumeForSerumKey } from '@core/graphql/queries/chart/getTotalVolumeForSerumKey'

import serum from '@icons/Serum.svg'
import decefi from '@icons/decefi.svg'

import { withTheme } from '@material-ui/styles'
import { useWallet } from '@sb/dexUtils/wallet'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Link } from 'react-router-dom'

export const BlockContainer = styled.div``

export const Card = styled.div`
  width: 35%;
  height: 85%;
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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <RowContainer style={{ height: '30%' }} direction={'column'}>
        <Title style={{ paddingBottom: '1rem' }} theme={theme}>
          Buy SRM and farm DCFI token
        </Title>
        <Text theme={theme}>
          New farming algorithm designed by Cryptocurrencies.ai allows you
        </Text>
        <Text theme={theme}>
          to farm DCFI – token of our upcoming project. Stay tuned for news
        </Text>
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
              {getTotalVolumeForSerumKeyQuery.getTotalVolumeForSerumKey.dcfiEarned.toFixed(
                3
              )}
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
