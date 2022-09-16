import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { InlineText } from '@sb/components/Typography'
import { CustomTextInput } from '@sb/compositions/PoolsV2/components/Inputs'
import {
  LinkToCoinGecko,
  LinkToCoinMarketcap,
  LinkToTelegram,
  LinkToTwitter,
} from '@sb/compositions/PoolsV2/components/Socials'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'

import {
  Container as SwitcherContainer,
  SwitcherButton,
} from '../../../../TablesSwitcher/index.styles'
import { Column } from '../../../index.styles'
import { Header } from '../../components/Header'
import { InvisibleInput, SContainer } from '../../index.styles'

export const SetPreferences = ({
  creationStep,
  setCreationStep,
}: {
  creationStep: string
  setCreationStep: (a: string) => void
}) => {
  const [launchPoolValues, setLaunchPoolValues] = useState({
    launchPoolImmediately: true,
    lockUpLiquidity: false,
    notifyUser: false,
  })

  return (
    <>
      <Header
        creationStep={creationStep}
        header="Set Preferences"
        description="You will be able to update them later."
        onClose={() => setCreationStep('setupFarming')}
        arrow
      />
      <Column
        overflow="scroll"
        justify="center"
        height={
          !launchPoolValues.launchPoolImmediately ||
          launchPoolValues.lockUpLiquidity ||
          launchPoolValues.notifyUser
            ? 'auto'
            : '30em'
        }
        margin="2em 0"
        width="100%"
      >
        <SContainer
          padding="0.5em 1em"
          height={!launchPoolValues.launchPoolImmediately ? '8em' : '4em'}
          needBorder
          width="100%"
        >
          <Column
            justify={
              !launchPoolValues.launchPoolImmediately
                ? 'space-between'
                : 'center'
            }
            width="100%"
          >
            <RootRow margin="0" width="100%">
              <InlineText color="white2" size="sm">
                Launch Pool
              </InlineText>
              <SwitcherContainer $variant="saturated">
                <SwitcherButton
                  isActive={launchPoolValues.launchPoolImmediately}
                  onClick={() => {
                    setLaunchPoolValues({
                      ...launchPoolValues,
                      launchPoolImmediately: true,
                    })
                  }}
                  $variant="saturated"
                >
                  Immediately
                </SwitcherButton>
                <SwitcherButton
                  isActive={!launchPoolValues.launchPoolImmediately}
                  onClick={() => {
                    setLaunchPoolValues({
                      ...launchPoolValues,
                      launchPoolImmediately: false,
                    })
                  }}
                  $variant="saturated"
                >
                  Scheduled
                </SwitcherButton>
              </SwitcherContainer>
            </RootRow>
            {!launchPoolValues.launchPoolImmediately && (
              <RootRow margin="0" width="100%">
                <CustomTextInput
                  title="Launch Date"
                  placeholder="DD / MM / YYYY"
                  width="49%"
                />
                <CustomTextInput
                  title="Launch Time (24h format)"
                  placeholder="HH/MM"
                  width="49%"
                />
              </RootRow>
            )}
          </Column>
        </SContainer>
        <SContainer
          padding="0.5em 1em"
          height={launchPoolValues.lockUpLiquidity ? '8em' : '4em'}
          needBorder
          width="100%"
        >
          <Column
            justify={
              launchPoolValues.lockUpLiquidity ? 'space-between' : 'center'
            }
            width="100%"
          >
            <RootRow margin="0">
              <InlineText color="white2" size="sm">
                Lock up my liquidity
              </InlineText>
              <SwitcherContainer $variant="saturated">
                <SwitcherButton
                  isActive={!launchPoolValues.lockUpLiquidity}
                  onClick={() => {
                    setLaunchPoolValues({
                      ...launchPoolValues,
                      lockUpLiquidity: false,
                    })
                  }}
                  $variant="saturated"
                >
                  No
                </SwitcherButton>
                <SwitcherButton
                  isActive={launchPoolValues.lockUpLiquidity}
                  onClick={() =>
                    setLaunchPoolValues({
                      ...launchPoolValues,
                      lockUpLiquidity: true,
                    })
                  }
                  $variant="saturated"
                >
                  Yes
                </SwitcherButton>
              </SwitcherContainer>
            </RootRow>
            {launchPoolValues.lockUpLiquidity && (
              <RootRow margin="0" width="100%">
                <CustomTextInput
                  title="Lock For"
                  placeholder="0"
                  width="100%"
                />
              </RootRow>
            )}
          </Column>
        </SContainer>
        <SContainer
          padding="0.5em 1em"
          height={launchPoolValues.notifyUser ? '8em' : '4em'}
          needBorder
          width="100%"
        >
          <Column
            justify={launchPoolValues.notifyUser ? 'space-between' : 'center'}
            width="100%"
          >
            <RootRow margin="0">
              <InlineText color="white2" size="sm">
                Notify me 1 day before farming end
              </InlineText>
              <SwitcherContainer $variant="saturated">
                <SwitcherButton
                  isActive={!launchPoolValues.notifyUser}
                  onClick={() =>
                    setLaunchPoolValues({
                      ...launchPoolValues,
                      notifyUser: false,
                    })
                  }
                  $variant="saturated"
                >
                  No
                </SwitcherButton>
                <SwitcherButton
                  isActive={launchPoolValues.notifyUser}
                  onClick={() =>
                    setLaunchPoolValues({
                      ...launchPoolValues,
                      notifyUser: true,
                    })
                  }
                  $variant="saturated"
                >
                  Yes
                </SwitcherButton>
              </SwitcherContainer>
            </RootRow>{' '}
            {launchPoolValues.notifyUser && (
              <RootRow margin="0" width="100%">
                <CustomTextInput
                  title="Email"
                  placeholder="Paste Email here"
                  width="100%"
                />
              </RootRow>
            )}
          </Column>
        </SContainer>
        <RootRow margin="0" width="100%">
          <SContainer padding="0.5em 1em" height="4em" needBorder width="49%">
            <Column>
              <InlineText color="white2" size="sm">
                Twitter
              </InlineText>
              <InvisibleInput placeholder="Paste Link here" />
            </Column>
            <LinkToTelegram />
          </SContainer>
          <SContainer padding="0.5em 1em" height="4em" needBorder width="49%">
            <Column>
              <InlineText color="white2" size="sm">
                Telegram
              </InlineText>
              <InvisibleInput placeholder="Paste Link here" />
            </Column>
            <LinkToTwitter />
          </SContainer>
        </RootRow>
        <RootRow margin="0" width="100%">
          <SContainer padding="0.5em 1em" height="4em" needBorder width="49%">
            <Column>
              <InlineText color="white2" size="sm">
                Coinmarketcap
              </InlineText>
              <InvisibleInput placeholder="Paste Link here" />
            </Column>
            <LinkToCoinMarketcap />
          </SContainer>
          <SContainer padding="0.5em 1em" height="4em" needBorder width="49%">
            <Column>
              <InlineText color="white2" size="sm">
                Coingecko
              </InlineText>
              <InvisibleInput placeholder="Paste Link here" />
            </Column>
            <LinkToCoinGecko />
          </SContainer>
        </RootRow>
      </Column>
      <RootRow margin="0 0 2em 0">
        <Button
          onClick={() => {}}
          $variant="violet"
          $width="xl"
          $padding="xxxl"
          $fontSize="sm"
        >
          Create Pool
        </Button>
      </RootRow>
    </>
  )
}
