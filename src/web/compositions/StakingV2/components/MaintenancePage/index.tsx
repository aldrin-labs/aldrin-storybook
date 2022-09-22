import React from 'react'

import { Page } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'

import CoinsBg from '../Icons/coins.webp'
import { Column, TextColumn, WideContent } from './index.styles'

export const MaintenancePage = () => {
  return (
    <Page>
      <WideContent>
        <Column>
          <img width="130px" src={CoinsBg} alt="rin" />
          <InlineText className="maintenance-header" size="lg" weight={700}>
            Under Maintenance
          </InlineText>
          <TextColumn>
            <TextColumn>
              <InlineText size="sm">
                We are doing some updates to the staking that
              </InlineText>
              <InlineText size="sm">
                require a temporary UI shutdown.
              </InlineText>
            </TextColumn>

            <InlineText size="sm">
              Stay tuned, everything will be up soon!
            </InlineText>
          </TextColumn>
        </Column>
      </WideContent>
    </Page>
  )
}
