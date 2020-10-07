import React, { useEffect } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'

import serum from '@icons/Serum.svg'

import { withTheme } from '@material-ui/styles'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Link } from 'react-router-dom'

export const BlockContainer = styled.div``

export const Card = styled.div`
  width: 40%;
  height: 70%;
  background-color: ${(props) =>
    props.backgroundColor || props.theme.palette.white.block};
  margin: 0.7rem;
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
  color: ${(props) => props.color || props.theme.palette.white.main};
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 2.5rem;
  line-height: 47px;
`
export const Text = styled.div`
  color: ${(props) => props.color || props.theme.palette.white.main};
  width: 31%;

  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  line-height: 2rem;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 1px;
`
export const Value = styled.div`
  color: ${(props) => props.color || props.theme.palette.white.main};

  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 8rem;
  line-height: 125px;
`
export const Button = styled.button`
  width: 35%;
  height: 10%;
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  text-transform: capitalize;
  background: ${(props) => props.color || theme.palette.blue.serum};
  border-radius: 4px;
  border: none;
`

const RewardsRoute = (props) => {
  const { theme } = props
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
        <Title theme={theme}>Buy SRM and farm DCFI token</Title>
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
          <SvgIcon src={serum} width="13%" height="auto" />
          <Value theme={theme}>4567</Value>
          <Link to={'/chart'} style={{ width: '50%', textDecoration: 'none' }}>
            <BtnCustom
              theme={theme}
              btnColor={theme.palette.grey.main}
              backgroundColor={'#61D8E6'}
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
        </Card>
        <Card theme={theme} />
      </div>
    </div>
  )
}

export default compose(withTheme())(RewardsRoute)
