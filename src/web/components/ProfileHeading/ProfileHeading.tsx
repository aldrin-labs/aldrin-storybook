import * as React from 'react'
import styled from 'styled-components'
import { ProfileQueryQuery } from '@core/types/ProfileTypes'

interface Props {
  coin: ProfileQueryQuery['assetById']
}

export default class ProfileHeading extends React.Component<Props, {}> {
  render() {
    const { coin } = this.props
    const { name = '', symbol = '' } = coin || {}

    return (
      <SProfileHeading>
        {/*TODO: need real image */}
        <CoinImage />
        <CoinProfileWrapper>
          <CoinName>
            {name}
            <CoinShortName>{symbol}</CoinShortName>
          </CoinName>
          {/*TODO: need real description */}
          <CoinDescription>
            Basic info lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt.
          </CoinDescription>
        </CoinProfileWrapper>
      </SProfileHeading>
    )
  }
}

const SProfileHeading = styled.div`
  display: flex;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);
  margin-top: 19px;
  max-width: 380px;
`

const CoinImage = styled.div`
  min-width: 120px;
  height: 120px;
  border-radius: 3px;
  background-color: #4c5055;
  margin: 16px;
`

const CoinProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const CoinName = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: left;
  color: #ffffff;
  margin: 16px 16px 16px 0;
`

const CoinShortName = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: left;
  margin-left: 8px;
`

const CoinDescription = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.4px;
  text-align: left;
  color: #ffffff;
  margin: 0 0 16px 0;
`
