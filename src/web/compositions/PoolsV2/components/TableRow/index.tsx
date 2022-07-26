import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { POOL_CARD_LABELS } from '../../config'
import { RootRow, RootColumn, SpacedColumn } from '../../index.styles'
import { BalanceLine } from '../BalanceLine'
import { LabelComponent } from '../FiltersSection/Labels'
import { TooltipIcon, PlusIcon, ArrowsIcon } from '../Icons'
import { Row } from '../Popups/index.styles'
import { LinkToTwitter, LinkToDiscord, LinkToCoinMarketcap } from '../Socials'
import { TokenIconsContainer } from '../TokenIconsContainer'
import { DepositRow, LabelsRow, Container, StretchedRow } from './index.styles'
import { LabelsTooltips } from './Tooltips'

export const TableRow = ({
  isFiltersShown,
  setIsPoolsDetailsPopupOpen,
}: {
  isFiltersShown: boolean
  setIsPoolsDetailsPopupOpen: (a: boolean) => void
}) => {
  return (
    <RootRow margin={isFiltersShown ? 'auto' : '30px 0 0 0'}>
      <Container width="100%">
        <StretchedRow>
          <RootColumn height="100%">
            <TokenIconsContainer
              needElement
              mint="E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp"
            />
            <InlineText size="md" weight={600} color="gray0">
              RIN/USDC
            </InlineText>
            <LabelsRow>
              <LabelComponent
                tooltipText={
                  <LabelsTooltips
                    type="Locked"
                    period="72 May, 2022"
                    amount="1 300 330"
                  />
                }
                variant={
                  POOL_CARD_LABELS.find((el) => el.text === 'Locked') ||
                  POOL_CARD_LABELS[0]
                }
              />
              <LabelComponent
                tooltipText={<LabelsTooltips type="New" period="5 days" />}
                variant={
                  POOL_CARD_LABELS.find((el) => el.text === 'New') ||
                  POOL_CARD_LABELS[0]
                }
              />
            </LabelsRow>
          </RootColumn>
          <SpacedColumn height="100%">
            <Row>
              <ArrowsIcon />
              <InlineText size="sm" weight={400} color="gray3">
                Liquidity
              </InlineText>
            </Row>

            <InlineText size="xmd" weight={600} color="gray0">
              <InlineText color="gray1">$</InlineText> 10.42m
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="gray3">
              Volume 7d
            </InlineText>
            <InlineText size="xmd" weight={600} color="gray0">
              <InlineText color="gray1">$</InlineText> 102.24k
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="gray3">
              <DarkTooltip
                title={<InlineText color="gray0">tooltip</InlineText>}
              >
                <span>
                  <TooltipIcon margin="0" color="gray3" /> Rewards
                </span>
              </DarkTooltip>
            </InlineText>
            <Row width="75%" margin="0">
              <DarkTooltip
                title={
                  <>
                    <InlineText weight={600} color="gray0">
                      RIN
                    </InlineText>
                    <InlineText weight={400} color="gray0">
                      $0.54
                    </InlineText>
                  </>
                }
              >
                <span>
                  <TokenIcon mint={getTokenMintAddressByName('RIN')} />
                </span>
              </DarkTooltip>
              <DarkTooltip
                title={
                  <>
                    <InlineText weight={600} color="gray0">
                      mSOL
                    </InlineText>
                    <InlineText weight={400} color="gray0">
                      $0.54
                    </InlineText>
                  </>
                }
              >
                <span>
                  <TokenIcon mint={getTokenMintAddressByName('mSOL')} />
                </span>
              </DarkTooltip>
            </Row>
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
              <BalanceLine value1="30%" value2="70%" />
            </SpacedColumn>
          </SpacedColumn>
          <DepositRow>
            <Row width="100%">
              <LinkToTwitter />
              <LinkToDiscord margin="0 0.5em" />
              <LinkToCoinMarketcap />
            </Row>
            <Button
              onClick={() => {
                setIsPoolsDetailsPopupOpen(true)
              }}
              $width="xl"
              $borderRadius="md"
              $padding="xxl"
              $variant="green"
              $fontSize="sm"
            >
              <PlusIcon color="green1" /> Deposit
            </Button>
          </DepositRow>
        </StretchedRow>
      </Container>
    </RootRow>
  )
}
