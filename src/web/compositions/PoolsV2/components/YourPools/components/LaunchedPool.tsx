import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import {
  Line,
  RootColumn,
  RootRow,
} from '@sb/compositions/PoolsV2/index.styles'

import { RIN_MINT } from '@core/solana'

import { TVLChart, VolumeChart } from '../../Charts'
import {
  ClockIcon,
  EditIcon,
  MailIcon,
  MinusIcon,
  PlusIcon,
  TooltipIcon,
} from '../../Icons'
import { Row } from '../../Popups/index.styles'
import { GrayBox, GrayContainer } from '../../Popups/PoolsDetails/index.styles'
import {
  LinkToCoinMarketcap,
  LinkToDiscord,
  LinkToTelegram,
  LinkToTwitter,
} from '../../Socials'
import { Container } from '../../TableRow/index.styles'
import { FarmingEndedBanner } from './FarmingEndedBanner'
import { PoolsCard } from './PoolCard'

export const LaunchedPool = ({
  poolInfo,
  setIsLaunchFarmingModalOpen,
  setIsBoostAPRModalOpen,
  setIsDepositModalOpen,
  setIsRescheduleFarmingModalOpen,
  setIsEditModalOpen,
  scheduleNewFarming,
}: {
  poolInfo: any
  setIsLaunchFarmingModalOpen: (a: boolean) => void
  setIsBoostAPRModalOpen: (a: boolean) => void
  setIsDepositModalOpen: (a: boolean) => void
  setIsRescheduleFarmingModalOpen: (a: boolean) => void
  setIsEditModalOpen: (a: boolean) => void
  scheduleNewFarming: (a: boolean) => void
}) => {
  return (
    <Container height="auto" margin="0" width="100%">
      <RootColumn>
        <RootRow align="center" margin="0" width="100%">
          <PoolsCard />
          <Row width="84.5%">
            <TVLChart chartHeight={170} background="white5" border="white4" />
            <VolumeChart
              chartHeight={175}
              background="white5"
              border="white4"
            />
          </Row>
        </RootRow>
        <RootRow align="center" margin="1em 0 0 0" width="100%">
          <Row width="32.5%">
            <GrayContainer height="17em">
              <RootRow margin="0" width="100%" height="100%">
                <RootColumn $justify="space-between" width="45%" height="100%">
                  <GrayBox align="flex-start" height="32%">
                    <Row width="100%">
                      <InlineText size="sm" weight={400} color="white2">
                        Your Liquidity
                      </InlineText>
                      <TooltipIcon color="white2" />
                    </Row>
                    <Row width="20%">
                      <InlineText size="xmd" weight={400} color="white3">
                        $
                      </InlineText>
                      &nbsp;
                      <InlineText size="xmd" weight={600} color="white1">
                        105.2k
                      </InlineText>
                    </Row>
                  </GrayBox>
                  <GrayBox height="25%">
                    <RootColumn width="100%" height="100%">
                      <Row width="100%">
                        <TokenIcon size={20} mint={RIN_MINT} />
                        <InlineText size="sm" weight={400} color="gray1">
                          124.42k
                        </InlineText>
                      </Row>

                      <Row width="100%">
                        <TokenIcon size={20} mint={RIN_MINT} />
                        <InlineText size="sm" weight={400} color="gray1">
                          124.42k
                        </InlineText>
                      </Row>
                    </RootColumn>
                  </GrayBox>
                  <Button
                    onClick={() => setIsDepositModalOpen(true)}
                    $width="xl"
                    $padding="xxxl"
                    $variant="violet"
                    $fontSize="sm"
                  >
                    <PlusIcon /> Deposit More
                  </Button>
                </RootColumn>
                <RootColumn height="100%" $justify="flex-start">
                  <Line $height="70%" />
                </RootColumn>
                <RootColumn $justify="space-between" width="45%" height="100%">
                  <GrayBox align="flex-start" height="32%">
                    <Row width="100%">
                      <InlineText size="sm" weight={400} color="white2">
                        Fees Earned
                      </InlineText>
                      <TooltipIcon color="white2" />
                    </Row>
                    <Row width="20%">
                      <InlineText size="xmd" weight={400} color="white3">
                        $
                      </InlineText>
                      &nbsp;
                      <InlineText size="xmd" weight={600} color="white1">
                        105.2k
                      </InlineText>
                    </Row>
                  </GrayBox>
                  <GrayBox height="25%">
                    <RootColumn width="100%" height="100%">
                      <Row width="100%">
                        <TokenIcon size={20} mint={RIN_MINT} />
                        <InlineText size="sm" weight={400} color="gray1">
                          124.42k
                        </InlineText>
                      </Row>

                      <Row width="100%">
                        <TokenIcon size={20} mint={RIN_MINT} />
                        <InlineText size="sm" weight={400} color="gray1">
                          124.42k
                        </InlineText>
                      </Row>
                    </RootColumn>
                  </GrayBox>
                  <Button
                    $width="xl"
                    $padding="xxxl"
                    $variant="violet"
                    $fontSize="sm"
                    disabled={!poolInfo.widthrawEnabled}
                  >
                    {poolInfo.widthrawEnabled ? (
                      <>
                        <MinusIcon /> Withdraw{' '}
                      </>
                    ) : (
                      <>Mar 28, 2022 18:00</>
                    )}
                  </Button>
                </RootColumn>
              </RootRow>
            </GrayContainer>
          </Row>
          <Row width="32.5%">
            <GrayContainer height="17em">
              {!poolInfo.isFarmingActive && !poolInfo.isNextFarmingScheduled ? (
                <RootRow margin="0" width="100%" height="100%">
                  <RootColumn width="100%" height="100%">
                    <FarmingEndedBanner />
                    <Button
                      onClick={() => setIsLaunchFarmingModalOpen(true)}
                      $width="xl"
                      $padding="xxxl"
                      $variant="green"
                      $fontSize="sm"
                    >
                      Launch New Farming
                    </Button>
                  </RootColumn>
                </RootRow>
              ) : (
                <RootRow margin="0" width="100%" height="100%">
                  <RootColumn
                    $justify="space-between"
                    width="45%"
                    height="100%"
                  >
                    <GrayBox align="flex-start" height="32%">
                      <Row width="100%">
                        <InlineText size="sm" weight={400} color="white2">
                          Farming Supply
                        </InlineText>
                        <TooltipIcon color="white2" />
                      </Row>
                      <Row width="20%">
                        <InlineText size="xmd" weight={400} color="white3">
                          $
                        </InlineText>
                        &nbsp;
                        <InlineText size="xmd" weight={600} color="white1">
                          105.2k
                        </InlineText>
                      </Row>
                    </GrayBox>
                    <GrayBox height="25%">
                      <RootColumn width="100%" height="100%">
                        <Row width="100%">
                          <TokenIcon size={20} mint={RIN_MINT} />
                          <InlineText size="sm" weight={400} color="gray1">
                            124.42k
                          </InlineText>
                        </Row>

                        <Row width="100%">
                          <TokenIcon size={20} mint={RIN_MINT} />
                          <InlineText size="sm" weight={400} color="gray1">
                            124.42k
                          </InlineText>
                        </Row>
                      </RootColumn>
                    </GrayBox>
                    <Button
                      onClick={() => {
                        setIsBoostAPRModalOpen(true)
                      }}
                      $width="xl"
                      $padding="xxxl"
                      $variant="green"
                      $fontSize="sm"
                    >
                      <PlusIcon color="green2" /> Boost APR
                    </Button>
                  </RootColumn>
                  <RootColumn height="100%" $justify="flex-start">
                    <Line $height="70%" />
                  </RootColumn>

                  <RootColumn
                    $justify="space-between"
                    width="45%"
                    height="100%"
                  >
                    {poolInfo.isFarmingActive &&
                      !poolInfo.isNextFarmingScheduled && (
                        <GrayBox align="flex-start" height="69%">
                          <RootColumn width="100%">
                            <RootRow margin="0" width="100%">
                              <InlineText size="sm" weight={400} color="white2">
                                Farming Till
                              </InlineText>
                              <TooltipIcon color="white2" />
                            </RootRow>
                            <Row>
                              <InlineText
                                size="xmd"
                                weight={500}
                                color="white1"
                              >
                                Jul 28, 2022
                              </InlineText>
                            </Row>
                          </RootColumn>

                          <InlineText size="md" weight={400} color="white2">
                            21:24
                          </InlineText>
                        </GrayBox>
                      )}
                    {!poolInfo.isFarmingActive &&
                      poolInfo.isNextFarmingScheduled && (
                        <GrayBox align="flex-start" height="69%">
                          <RootColumn width="100%">
                            <RootRow margin="0" width="100%">
                              <RootColumn width="100%">
                                <Row width="100%">
                                  <InlineText
                                    size="sm"
                                    weight={400}
                                    color="white2"
                                  >
                                    Farming
                                  </InlineText>{' '}
                                  <TooltipIcon color="white2" />
                                </Row>

                                <InlineText
                                  size="sm"
                                  weight={400}
                                  color="white2"
                                >
                                  Scheduled at
                                </InlineText>
                              </RootColumn>
                            </RootRow>
                            <Row width="100%">
                              <InlineText
                                size="xmd"
                                weight={500}
                                color="white1"
                              >
                                Jul 28, 2022
                              </InlineText>
                            </Row>
                          </RootColumn>

                          <InlineText size="md" weight={400} color="white2">
                            21:24
                          </InlineText>
                        </GrayBox>
                      )}
                    {poolInfo.isFarmingActive &&
                      poolInfo.isNextFarmingScheduled && (
                        <RootColumn height="69%">
                          <GrayBox align="flex-start" height="47%">
                            <Row width="100%">
                              <InlineText size="sm" weight={400} color="white2">
                                Farming Till
                              </InlineText>
                              <TooltipIcon color="white2" />
                            </Row>
                            <Row width="100%">
                              <InlineText size="sm" weight={600} color="white1">
                                Jul 28, 2022
                              </InlineText>
                            </Row>
                            <Row width="100%">
                              <InlineText size="sm" weight={400} color="white2">
                                21:24
                              </InlineText>
                            </Row>
                          </GrayBox>
                          <GrayBox height="47%">
                            <Row width="100%">
                              <InlineText size="sm" weight={400} color="white2">
                                Next Farming
                              </InlineText>
                              <TooltipIcon color="white2" />
                            </Row>
                            <Row width="100%">
                              <InlineText size="sm" weight={400} color="white2">
                                scheduled at{' '}
                              </InlineText>
                            </Row>
                            <Row width="100%">
                              <InlineText size="sm" weight={500} color="white1">
                                Jul 28, 2022 21:24
                              </InlineText>
                            </Row>
                          </GrayBox>
                        </RootColumn>
                      )}

                    <Button
                      $width="xl"
                      $padding="xxxl"
                      $variant="green"
                      $fontSize="sm"
                      onClick={() => {
                        if (poolInfo.isNextFarmingScheduled) {
                          setIsRescheduleFarmingModalOpen(true)
                        } else {
                          scheduleNewFarming(true)
                          setIsLaunchFarmingModalOpen(true)
                        }
                      }}
                    >
                      <ClockIcon color="green2" margin="0 0.5em 0 0" />{' '}
                      {poolInfo.isNextFarmingScheduled
                        ? 'Reschedule'
                        : 'Schedule'}
                    </Button>
                  </RootColumn>
                </RootRow>
              )}
            </GrayContainer>
          </Row>
          <Row width="32.5%">
            <GrayContainer height="17em">
              <RootColumn width="100%" height="100%">
                <RootRow margin="0" width="100%">
                  <Row>
                    <GrayBox
                      $padding="0.5em 1em 0.5em 0.5em"
                      $justify="center"
                      height="2.5em"
                    >
                      <RootRow margin="0" width="100%">
                        <LinkToTwitter $variant="withoutBack" margin="0" />
                        <InlineText size="sm">twitter.com/samvraiii</InlineText>
                      </RootRow>
                    </GrayBox>
                  </Row>
                  <Row width="2.5em">
                    <GrayBox
                      $cursor="pointer"
                      onClick={() => setIsEditModalOpen(true)}
                      $justify="center"
                      height="2.5em"
                    >
                      <EditIcon />
                    </GrayBox>
                  </Row>
                </RootRow>
                <RootRow margin="0" width="100%">
                  <Row>
                    <GrayBox
                      $padding="0.5em 1em 0.5em 0.5em"
                      $justify="center"
                      height="2.5em"
                    >
                      <RootRow margin="0" width="100%">
                        <LinkToCoinMarketcap
                          $variant="withoutBack"
                          margin="0"
                        />
                        <InlineText size="sm">
                          coinmarketcap.com/aldrin/RIN
                        </InlineText>
                      </RootRow>
                    </GrayBox>
                  </Row>
                  <Row width="2.5em">
                    <GrayBox
                      $cursor="pointer"
                      onClick={() => setIsEditModalOpen(true)}
                      $justify="center"
                      height="2.5em"
                    >
                      <EditIcon />
                    </GrayBox>
                  </Row>
                </RootRow>
                <RootRow margin="0" width="100%">
                  <Row>
                    <GrayBox
                      $padding="0.5em 1em 0.5em 0.5em"
                      $justify="center"
                      height="2.5em"
                    >
                      <RootRow margin="0" width="100%">
                        <LinkToDiscord $variant="withoutBack" margin="0" />
                        <InlineText size="sm">
                          https://discord.gg/SxQyZNZh
                        </InlineText>
                      </RootRow>
                    </GrayBox>
                  </Row>
                  <Row width="2.5em">
                    <GrayBox
                      $cursor="pointer"
                      onClick={() => setIsEditModalOpen(true)}
                      $justify="center"
                      height="2.5em"
                    >
                      <EditIcon />
                    </GrayBox>
                  </Row>
                </RootRow>
                <RootRow margin="0" width="100%">
                  <Row>
                    <GrayBox
                      $padding="0.5em 1em 0.5em 0.5em"
                      $justify="center"
                      height="2.5em"
                    >
                      <RootRow margin="0" width="100%">
                        <LinkToTelegram
                          width="30px"
                          $variant="withoutBack"
                          margin="0"
                          color="white2"
                        />
                        <InlineText size="sm" color="white2">
                          Not Specified
                        </InlineText>
                      </RootRow>
                    </GrayBox>
                  </Row>
                  <Row width="2.5em">
                    <GrayBox
                      $cursor="pointer"
                      onClick={() => setIsEditModalOpen(true)}
                      $justify="center"
                      height="2.5em"
                    >
                      <EditIcon />
                    </GrayBox>
                  </Row>
                </RootRow>
                <RootRow margin="0" width="100%">
                  <Row>
                    <GrayBox $justify="center" height="2.5em">
                      <RootRow margin="0" width="100%">
                        <MailIcon />
                        <InlineText size="sm" color="white2">
                          Not Specified
                        </InlineText>
                      </RootRow>
                    </GrayBox>
                  </Row>
                  <Row width="2.5em">
                    <GrayBox
                      $cursor="pointer"
                      onClick={() => setIsEditModalOpen(true)}
                      $justify="center"
                      height="2.5em"
                    >
                      <EditIcon />
                    </GrayBox>
                  </Row>
                </RootRow>
              </RootColumn>
            </GrayContainer>
          </Row>
        </RootRow>
      </RootColumn>
    </Container>
  )
}
