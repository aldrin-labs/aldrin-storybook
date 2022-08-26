import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { MarinadeStats } from '@sb/dexUtils/staking/hooks/types'
import { RefreshFunction } from '@sb/dexUtils/types'

import { Farm } from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/numberUtils'

import { STAKING_CARD_LABELS } from '../../config'
import { RootColumn, RootRow, SpacedColumn } from '../../index.styles'
import { StakingRowType } from '../../types'
import { LabelComponent } from '../FilterSection/Labels'
import { TooltipIcon } from '../Icons'
import { Row } from '../Popups/index.styles'
import { MarinadeStaking } from '../Popups/MarinadeStaking'
import RinStaking from '../Popups/RinStaking'
import { LinkToCoinMarketcap, LinkToDiscord, LinkToTwitter } from '../Socials'
import { TokenIconsContainer } from '../TokenIconsContainer'
import {
  Container,
  DepositRow,
  LabelsRow,
  SRow,
  StretchedRow,
  StyledLink,
} from './index.styles'

export const TableRow = ({
  farms,
  dexTokensPricesMap,
  mSolInfo,
  staking,
  refreshStakingInfo,
}: {
  farms: Farm[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  mSolInfo: MarinadeStats
  staking: StakingRowType
  refreshStakingInfo: RefreshFunction
}) => {
  const [isRinStakingPopupOpen, setIsRinStakingPopupOpen] = useState(false)
  const [isMSolStakingPopupOpen, setIsMSolStakingPopupOpen] = useState(false)
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)

  let routes: string = ''

  switch (staking.token) {
    case 'PLD':
      routes = 'PLD'
      break
    case 'RPC':
      routes = 'RPC'
      break
    case 'PU238':
      routes = 'PU238'
      break
    default:
      routes = ''
  }

  const stakingRoute = `staking/plutonians/${routes}`

  const isPlutoniansToken =
    staking.token === 'RPC' ||
    staking.token === 'PU238' ||
    staking.token === 'PLD'

  return (
    <RootRow margin="10px 0">
      <Container width="100%">
        <StretchedRow>
          <RootColumn
            margin="0 0 2em 0"
            width="15%"
            height="100%"
            className="iconColumn"
          >
            <SRow>
              <TokenIconsContainer token={staking.token} />
              <InlineText size="md" weight={600} color="white2">
                Stake {staking.token}
              </InlineText>
              <Row width="100%" className="smallLinksRow">
                <LinkToTwitter link={staking.socials.twitter} />
                <LinkToDiscord
                  link={staking.socials.discord}
                  margin="0 0.5em"
                />
                {!!staking.socials.coinmarketcap && (
                  <LinkToCoinMarketcap link={staking.socials.coinmarketcap} />
                )}
              </Row>
            </SRow>
            <LabelsRow>
              {staking.labels.map((label: string) => (
                <LabelComponent
                  variant={
                    STAKING_CARD_LABELS.find((el) => el.text === label) ||
                    STAKING_CARD_LABELS[0]
                  }
                />
              ))}
            </LabelsRow>
          </RootColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="white2">
              Total Staked
            </InlineText>
            <InlineText size="xmd" weight={600} color="white1">
              <InlineText color="white2">$</InlineText>{' '}
              {stripByAmountAndFormat(staking.totalStaked)}{' '}
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="white2">
              {staking.columnName}
            </InlineText>
            <InlineText size="xmd" weight={600} color="white1">
              {staking.additionalInfo}
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="white2">
              <DarkTooltip
                title={
                  <InlineText color="white2">
                    <p>
                      Estimation for growth of your deposit over a year
                      projected on current farming rewards and past 7d trading
                      activity.
                    </p>
                  </InlineText>
                }
              >
                <span>
                  <TooltipIcon margin="0" color="white2" /> APY{' '}
                  {isPlutoniansToken && 'up to'}
                </span>
              </DarkTooltip>
            </InlineText>
            <InlineText size="xmd" weight={600} color="green3">
              {staking.apy}%
            </InlineText>
          </SpacedColumn>
          <DepositRow>
            <Row width="100%" className="linksRow">
              <LinkToTwitter link={staking.socials.twitter} />
              <LinkToDiscord link={staking.socials.discord} margin="0 0.5em" />
              <LinkToCoinMarketcap link={staking.socials.coinmarketcap} />
            </Row>

            {isPlutoniansToken ? (
              <StyledLink to={stakingRoute}>View</StyledLink>
            ) : (
              <Button
                onClick={() => {
                  switch (staking.token) {
                    case 'RIN':
                      setIsRinStakingPopupOpen(true)
                      break
                    case 'mSOL':
                      setIsMSolStakingPopupOpen(true)
                      break
                    default:
                      break
                  }
                }}
                $width="xl"
                $borderRadius="md"
                $padding="xxl"
                $variant="green"
                $fontSize="sm"
              >
                View
              </Button>
            )}
          </DepositRow>
        </StretchedRow>
      </Container>
      {isRinStakingPopupOpen && (
        <RinStaking
          socials={staking.socials}
          open={isRinStakingPopupOpen}
          onClose={() => setIsRinStakingPopupOpen(false)}
          farms={farms}
          dexTokensPricesMap={dexTokensPricesMap}
          setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
        />
      )}
      {isMSolStakingPopupOpen && (
        <MarinadeStaking
          socials={staking.socials}
          open={isMSolStakingPopupOpen}
          onClose={() => setIsMSolStakingPopupOpen(false)}
          setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
          dexTokensPricesMap={dexTokensPricesMap}
          mSolInfo={mSolInfo}
          refreshStakingInfo={refreshStakingInfo}
        />
      )}
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </RootRow>
  )
}
