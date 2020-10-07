import React, { useEffect } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'

import serum from '@icons/Serum.svg'

import { withTheme } from '@material-ui/styles'

export const BlockContainer = styled.div``

export const Card = styled.div`
  width: 31%;
  height: 59%;
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
  width: ${(props) => props.width || '31%'};
  color: ${(props) => props.color || props.theme.palette.white.main};
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  line-height: 31px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 1px;
  text-transform: none;
`
export const Value = styled.div`
  color: ${(props) => props.color || props.theme.palette.white.main};

  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 7rem;
  line-height: 125px;
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
      <Title theme={theme}>Buy SRM and farm DCFI token</Title>
      <Text theme={theme}>
        New farming algorithm designed by Cryptocurrencies.ai allows you to farm
        DCFI – token of our upcoming project. Stay tuned for news
      </Text>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Card theme={theme}>
          <div
            style={{
              height: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SvgIcon src={serum} width="60%" height="auto" />
          </div>
          <div
            style={{
              height: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {' '}
            <Value theme={theme}>456.799</Value>{' '}
            <Text theme={theme} width={'auto'}>
              SRM traded
            </Text>
            <Button>trade</Button>
          </div>
        </Card>
        <Card theme={theme}>
          <SvgIcon src={serum} width="11%" height="auto" />
          <Value theme={theme}>456.997</Value>{' '}
          <Text theme={theme} width={'auto'}>
            DCFI earned
          </Text>
          <Button>Harvest (coming soon)</Button>
        </Card>
      </div>
    </div>
  )
}

export default compose(withTheme())(RewardsRoute)
