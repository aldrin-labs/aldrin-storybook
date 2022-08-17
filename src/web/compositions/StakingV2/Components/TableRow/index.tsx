import React from 'react'

import { Button } from '@sb/components/Button'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'

import { POOL_CARD_LABELS } from '../../config'
import { RootRow, RootColumn, SpacedColumn } from '../../index.styles'
import { LabelComponent } from '../FilterSection/Labels'
import { TooltipIcon } from '../Icons'
import { Row } from '../Popups/index.styles'
import { LinkToTwitter, LinkToDiscord, LinkToCoinMarketcap } from '../Socials'
import { TokenIconsContainer } from '../TokenIconsContainer'
import {
  DepositRow,
  LabelsRow,
  Container,
  StretchedRow,
  StyledLink,
} from './index.styles'
import { LabelsTooltips } from './Tooltips'

export const TableRow = ({
  token,
  setIsRinStakingPopupOpen,
  setIsSolStakingPopupOpen,
  setPLDPopup,
  setRPCPopup,
  setPU238Popup,
}: {
  token: string
  setIsRinStakingPopupOpen: (a: boolean) => void
  setIsSolStakingPopupOpen: (a: boolean) => void
  setRPCPopup: (a: boolean) => void
  setPLDPopup: (a: boolean) => void
  setPU238Popup: (a: boolean) => void
}) => {
  let HeaderRowText: string = ''

  switch (token) {
    case 'SOL':
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
      'Something went wrong'
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

  return (
    <RootRow margin="10px 0">
      <Container width="100%">
        <StretchedRow>
          <RootColumn width="15%" height="100%">
            <Row>
              <TokenIconsContainer
                // mint="E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp"
                token={token}
              />
              <InlineText size="md" weight={600} color="gray0">
                Stake {token}
              </InlineText>
            </Row>
            <LabelsRow>
              {token === 'RIN' && (
                <LabelComponent
                  tooltipText={<LabelsTooltips type="New" period="5 days" />}
                  variant={
                    POOL_CARD_LABELS.find(
                      (el) => el.text === 'Auto-Compound'
                    ) || POOL_CARD_LABELS[0]
                  }
                />
              )}
              {token === 'SOL' && (
                <LabelComponent
                  tooltipText={<LabelsTooltips type="New" period="5 days" />}
                  variant={
                    POOL_CARD_LABELS.find((el) => el.text === 'Liquid') ||
                    POOL_CARD_LABELS[0]
                  }
                />
              )}
              {token === 'PLD' || token === 'RPC' || token === 'PU238' ? (
                <>
                  <LabelComponent
                    tooltipText={<LabelsTooltips type="New" period="5 days" />}
                    variant={
                      POOL_CARD_LABELS.find((el) => el.text === 'Plutonians') ||
                      POOL_CARD_LABELS[0]
                    }
                  />
                  <LabelComponent
                    tooltipText={<LabelsTooltips type="New" period="5 days" />}
                    NFT
                    variant={
                      POOL_CARD_LABELS.find(
                        (el) => el.text === 'NFT Rewards'
                      ) || POOL_CARD_LABELS[0]
                    }
                  />
                </>
              ) : null}
            </LabelsRow>
          </RootColumn>
          <SpacedColumn height="100%">
            {/* <Row> */}
            {/* <ArrowsIcon /> */}
            <InlineText size="sm" weight={400} color="gray3">
              Total Staked
            </InlineText>
            {/* </Row> */}

            <InlineText size="xmd" weight={600} color="gray0">
              <InlineText color="gray1">$</InlineText> 10.42m
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="gray3">
              {HeaderRowText}
            </InlineText>
            <InlineText size="xmd" weight={600} color="gray0">
              <InlineText color="gray1">$</InlineText> 102.24k
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="gray3">
              <DarkTooltip
                title={
                  <InlineText color="gray0">
                    <p>
                      Estimation for growth of your deposit over a year
                      projected on current farming rewards and past 7d trading
                      activity.
                    </p>
                    <p>
                      Farming APR:{' '}
                      <InlineText weight={600} color="green4">
                        119.90%
                      </InlineText>{' '}
                      Trading APR:{' '}
                      <InlineText weight={600} color="green4">
                        5.34%
                      </InlineText>
                    </p>
                  </InlineText>
                }
              >
                <span>
                  <TooltipIcon margin="0" color="gray3" /> APR
                </span>
              </DarkTooltip>
            </InlineText>
            <SpacedColumn>
              <InlineText size="xmd" weight={600} color="green1">
                125.24%
              </InlineText>
            </SpacedColumn>
          </SpacedColumn>
          <DepositRow>
            <Row width="100%">
              <LinkToTwitter />
              <LinkToDiscord margin="0 0.5em" />
              <LinkToCoinMarketcap />
            </Row>

            {token === 'RPC' || token === 'PU238' || token === 'PLD' ? (
              <StyledLink to={stakingRoute}>View</StyledLink>
            ) : (
              <Button
                onClick={() => {
                  token === 'SOL'
                    ? setIsSolStakingPopupOpen(true)
                    : setIsRinStakingPopupOpen(true)
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
    </RootRow>
  )
}
