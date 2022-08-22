import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { useFarmInfo } from '@sb/dexUtils/farming'

import { FARMING_V2_TEST_TOKEN } from '@core/solana'
import { stripToMillions } from '@core/utils/numberUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { STAKING_CARD_LABELS } from '../../config'
import { RootRow, RootColumn, SpacedColumn } from '../../index.styles'
import { LabelComponent } from '../FilterSection/Labels'
import { TooltipIcon } from '../Icons'
import { Row } from '../Popups/index.styles'
import { RinStaking } from '../Popups/RinStaking'
import { LinkToTwitter, LinkToDiscord, LinkToCoinMarketcap } from '../Socials'
import { TokenIconsContainer } from '../TokenIconsContainer'
import {
  DepositRow,
  LabelsRow,
  Container,
  StretchedRow,
  StyledLink,
  SRow,
} from './index.styles'
import { LabelsTooltips } from './Tooltips'

export const TableRow = ({
  token,
  setIsStSolStakingPopupOpen,
  setIsMSolStakingPopupOpen,
  dexTokensPricesMap,
  stakingDataMap,
  getStakingInfo,
}: {
  token: string
  setIsStSolStakingPopupOpen: (a: boolean) => void
  setIsMSolStakingPopupOpen: (a: boolean) => void
  dexTokensPricesMap: Map<string, DexTokensPrices>
  stakingDataMap: Map<string, any>
  getStakingInfo: any // TODO
}) => {
  const [isRinStakingPopupOpen, setIsRinStakingPopupOpen] = useState(false)
  const { data: farms } = useFarmInfo(stakingDataMap)
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  console.log(stakingDataMap)
  let HeaderRowText: string = ''

  switch (token) {
    case 'mSOL':
      HeaderRowText = 'Epoch'
      break
    case 'stSOL':
      HeaderRowText = 'Epoch'
      break
    case 'RIN':
      HeaderRowText = '% of circ. supply'
      break
    case 'PLD':
      HeaderRowText = 'PLD Price'
      break
    case 'RPC':
      HeaderRowText = 'RPC Price'
      break
    case 'PU238':
      HeaderRowText = 'PU238 Price'
      break
    default:
      HeaderRowText = 'Something went wrong'
  }

  let routes: string = ''

  switch (token) {
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

  const farm = farms?.get(FARMING_V2_TEST_TOKEN)

  const RINHarvest = farm?.harvests.find(
    (harvest) => harvest.mint === FARMING_V2_TEST_TOKEN
  )

  const stakedPercentage =
    (farm?.stakeVaultTokenAmount /
      (getStakingInfo?.supply || farm?.stakeVaultTokenAmount)) *
    100

  console.log({ RINHarvest })

  return (
    <RootRow margin="10px 0">
      <Container width="100%">
        <StretchedRow>
          <RootColumn width="15%" height="100%" className="iconColumn">
            <SRow>
              <TokenIconsContainer
                // mint="E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp"
                token={token}
              />
              <InlineText size="md" weight={600} color="gray0">
                Stake {token}
              </InlineText>
              <Row width="100%" className="smallLinksRow">
                <LinkToTwitter />
                <LinkToDiscord margin="0 0.5em" />
                <LinkToCoinMarketcap />
              </Row>
            </SRow>
            <LabelsRow>
              {token === 'RIN' && (
                <LabelComponent
                  tooltipText={<LabelsTooltips type="Test2" period="5 days" />}
                  variant={
                    STAKING_CARD_LABELS.find(
                      (el) => el.text === 'Auto-Compound'
                    ) || STAKING_CARD_LABELS[0]
                  }
                />
              )}
              {token === 'mSOL' && (
                <>
                  <LabelComponent
                    tooltipText={<LabelsTooltips type="Test" period="5 days" />}
                    variant={
                      STAKING_CARD_LABELS.find((el) => el.text === 'Liquid') ||
                      STAKING_CARD_LABELS[0]
                    }
                  />
                  <LabelComponent
                    variant={
                      STAKING_CARD_LABELS.find(
                        (el) => el.text === 'Marinade'
                      ) || STAKING_CARD_LABELS[0]
                    }
                  />
                </>
              )}
              {token === 'stSOL' && (
                <>
                  <LabelComponent
                    tooltipText={<LabelsTooltips type="Test" period="5 days" />}
                    variant={
                      STAKING_CARD_LABELS.find((el) => el.text === 'Liquid') ||
                      STAKING_CARD_LABELS[0]
                    }
                  />
                  <LabelComponent
                    variant={
                      STAKING_CARD_LABELS.find((el) => el.text === 'Lido') ||
                      STAKING_CARD_LABELS[0]
                    }
                  />
                </>
              )}
              {token === 'PLD' || token === 'RPC' || token === 'PU238' ? (
                <>
                  <LabelComponent
                    tooltipText={<LabelsTooltips type="Test" period="5 days" />}
                    variant={
                      STAKING_CARD_LABELS.find(
                        (el) => el.text === 'Plutonians'
                      ) || STAKING_CARD_LABELS[0]
                    }
                  />
                  <LabelComponent
                    variant={
                      STAKING_CARD_LABELS.find(
                        (el) => el.text === 'NFT Rewards'
                      ) || STAKING_CARD_LABELS[0]
                    }
                  />
                </>
              ) : null}
            </LabelsRow>
          </RootColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="white2">
              Total Staked
            </InlineText>
            <InlineText size="xmd" weight={600} color="gray0">
              <InlineText color="white2">$</InlineText>{' '}
              {token === 'RIN'
                ? stripToMillions(farm?.stakeVaultTokenAmount)
                : '10.42m'}
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="white2">
              {HeaderRowText}
            </InlineText>
            <InlineText size="xmd" weight={600} color="gray0">
              {token === 'RIN'
                ? `${stripDigitPlaces(stakedPercentage, 2)}%`
                : '147.86%'}
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="white2">
              <DarkTooltip
                title={
                  <InlineText color="gray0">
                    <p>
                      Estimation for growth of your deposit over a year
                      projected on current farming rewards and past 7d trading
                      activity.
                    </p>
                    <p>
                      Farming APR:
                      <InlineText weight={600} color="green4">
                        119.90%
                      </InlineText>
                      Trading APR:
                      <InlineText weight={600} color="green4">
                        5.34%
                      </InlineText>
                    </p>
                  </InlineText>
                }
              >
                <span>
                  <TooltipIcon margin="0" color="white2" /> APR
                </span>
              </DarkTooltip>
            </InlineText>
            <SpacedColumn>
              <InlineText size="xmd" weight={600} color="green1">
                {token === 'RIN'
                  ? `${stripDigitPlaces(RINHarvest?.apy, 2)}%`
                  : '125.24%'}
              </InlineText>
            </SpacedColumn>
          </SpacedColumn>
          <DepositRow>
            <Row width="100%" className="linksRow">
              <LinkToTwitter />
              <LinkToDiscord margin="0 0.5em" />
              <LinkToCoinMarketcap />
            </Row>

            {token === 'RPC' || token === 'PU238' || token === 'PLD' ? (
              <StyledLink to={stakingRoute}>View</StyledLink>
            ) : (
              <Button
                onClick={() => {
                  switch (token) {
                    case 'RIN':
                      setIsRinStakingPopupOpen(true)
                      break
                    case 'mSOL':
                      setIsMSolStakingPopupOpen(true)
                      break
                    case 'stSOL':
                      setIsStSolStakingPopupOpen(true)
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
          open={isRinStakingPopupOpen}
          onClose={() => setIsRinStakingPopupOpen(false)}
          farms={farms}
          dexTokensPricesMap={dexTokensPricesMap}
          setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
        />
      )}
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </RootRow>
  )
}
