import React from 'react'
import { SvgIcon } from '@sb/components'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import MediumIcon from '@icons/violetMedium.svg'
import TelegramIcon from '@icons/violetTelegram.svg'
import MarketcapIcon from '@icons/violetMarketcap.svg'
import DiscordIcon from '@icons/violetDiscord.svg'
import TwitterIcon from '@icons/violetTwitter.svg'
import KudelskiLogo from '@icons/kudelski.svg'
import ComingSoonCircle from '@icons/comingSoonCircle.png'
import AldrinLogo from '@icons/aldrinLogoWithShadow.svg'
import useMobileSize from '@webhooks/useMobileSize'
import {
  RotatedContainer,
  TransparentText,
  Header,
  LinkContainer,
  VioletButton,
  SpinAnimatedImage,
  AnimatedImage,
  GridContainer,
  MobileImageContainer,
} from './LiquidityPoolsMock.styles'
import AMMAudit from './AldrinAMMAuditReport.pdf'

export const LiquidityPoolsMock = ({}) => {
  const isMobile = useMobileSize()

  return (
    <RowContainer
      style={{
        background: 'rgb(14, 16, 22)',
        position: 'relative',
      }}
      height="100%"
    >
      <RotatedContainer>
        <TransparentText>AMM AMM AMM</TransparentText>
      </RotatedContainer>
      <Row
        width={isMobile ? '90%' : '50%'}
        align="flex-start"
        direction="column"
        style={{
          padding: isMobile ? '0' : '0 10rem',
          margin: isMobile ? '0' : '0 0 0 10%',
        }}
      >
        <Row width={isMobile ? '90%' : '60%'} justify="space-between">
          <LinkContainer
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/Aldrin_Exchange"
          >
            <SvgIcon width="100%" height="100%" src={TwitterIcon} />
          </LinkContainer>
          <LinkContainer
            target="_blank"
            rel="noopener noreferrer"
            href="https://t.me/Aldrin_Exchange"
          >
            <SvgIcon width="100%" height="100%" src={TelegramIcon} />
          </LinkContainer>
          <LinkContainer
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/4VZyNxT2WU"
          >
            <SvgIcon width="100%" height="100%" src={DiscordIcon} />
          </LinkContainer>
          <LinkContainer
            target="_blank"
            rel="noopener noreferrer"
            href="https://aldrin-rin.medium.com/"
          >
            <SvgIcon width="100%" height="100%" src={MediumIcon} />
          </LinkContainer>
          <LinkContainer
            target="_blank"
            rel="noopener noreferrer"
            href="https://coinmarketcap.com/currencies/aldrin/"
          >
            <SvgIcon width="100%" height="100%" src={MarketcapIcon} />
          </LinkContainer>
        </Row>
        <Header style={{ margin: '4rem 0' }}>
          Aldrin will be the first full 3rd party audited Automated Market Maker
          (AMM) on Solana.
        </Header>
        <VioletButton href={AMMAudit} target="_blank">
          VIEW AUDIT REPORT
        </VioletButton>
        <Row
          width="40%"
          direction="column"
          align="flex-start"
          margin="5rem 0 0 0"
        >
          <Text fontSize={isMobile ? '2.5rem' : '1.5rem'}>Audited by</Text>
          <SvgIcon
            width={isMobile ? '70%' : '40%'}
            height="auto"
            style={{ marginTop: '1rem' }}
            src={KudelskiLogo}
          />
        </Row>
        <MobileImageContainer top="4rem" left="4rem">
          <AnimatedImage src={AldrinLogo} />
        </MobileImageContainer>
        <MobileImageContainer bottom="5rem" left="31rem">
          <SpinAnimatedImage src={ComingSoonCircle} />
        </MobileImageContainer>
      </Row>
      <GridContainer height="100%" width="40%" direction="column">
        <Row width="100%" height="65%" justify="flex-start">
          <AnimatedImage src={AldrinLogo} />
        </Row>
        <Row
          width="100%"
          height="35%"
          justify="flex-end"
          style={{ padding: '0 10rem' }}
        >
          <SpinAnimatedImage src={ComingSoonCircle} />
        </Row>
      </GridContainer>
    </RowContainer>
  )
}
