import React, { useState } from 'react'
import { CardText, Card } from '@sb/compositions/Rewards/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index'
import styled from 'styled-components'
import { compose } from 'recompose'
import { notify } from '@sb/dexUtils/notifications'

import Clear from '@material-ui/icons/Clear'
import { ClearButton } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import { withTheme } from '@material-ui/styles'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'
import blackTwitter from '@icons/blackTwitter.svg'

import connectDefiCefi from '@icons/conectDefiCefi.gif'
import Chart from '@icons/chart.png'
import { Paper } from '@material-ui/core'
import farmDistrub from '@icons/farmDistrub.png'
import speedGif from '@icons/speedGif.gif'
import Subtract from '@icons/subtract.gif'
import TwitterPost from '@icons/TwitterPost4.png'
import Solana from '@icons/Solana.gif'

const SharePop = styled.div`
  height: 55rem;
  padding: 3rem 2rem;
`
const GifContainer = styled.div`
  padding: 0 0;
  width: 30%;
  height: 15.4rem;
  margin: 1rem 1.5%;
  border-radius: 0.2rem;
  border: 0.1rem solid
    ${(props) => (props.isChoosen ? '#c7ffd0' : props.theme.palette.grey.block)};
  &:hover {
    border: 0.1rem solid #c7ffd0;
  }
`
const Gif = styled.img`
  height: 15rem;
  border-radius: 0.2rem;
  width: 100%;
`

const StyledPaper = styled(Paper)`
  width: 90rem !important;
  max-width: 90rem !important;
`
const links = (dcfiEarnedForTwitter: number) => ({
  ['pic.twitter.com/Q3f4242Zrb']: `Sealevel%20parallel%20smart%20contracts%20run-time%20allows%20%40solana%20to%20execute%20transactions%20at%20lightning%20fast%20speed%2C%20checkout%20details%20here%3A%20https%3A%2F%2Fmedium.com%2Fsolana-labs%2Fsealevel-parallel-processing-thousands-of-smart-contracts-d814b378192%0A%24DCFI%20%24SRM%20%24SOL%20%24UNI%20%24ETH%20%24DOT%20%24BNB%20%24LINK%20%24ADA%0Apic.twitter.com/Q3f4242Zrb`,
  ['pic.twitter.com/kxICFUi5qs']: `What+is+%40Decefi_official%0D%0A%0D%0ADecefi+is+up+to+125x+leverage+perpetual+futures+with+deepest+in+industry+liquidity+with+%40Solana+self-custody.%0D%0A%0D%0ADecefi+is+https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKlGXPYJYq10%0D%0A%0D%0A%24DCFI%20%24SRM%20%24SOL%20%24UNI%20%24ETH%20%24DOT%20%24BNB%20%24LINK%20%24ADA%0Apic.twitter.com/kxICFUi5qs`,
  ['pic.twitter.com/k7LIQlAI3w']: `%24DCFI+Farming+distribution+visibly%0D%0A%0D%0AFarm+%24DCFI+by+%24SRM+market+buy+on+https%3A%2F%2Fdex.cryptocurrencies.ai%2F%0D%0A%24DCFI%20%24SRM%20%24SOL%20%24UNI%20%24ETH%20%24DOT%20%24BNB%20%24LINK%20%24ADA%0Apic.twitter.com/k7LIQlAI3w`,
  ['pic.twitter.com/lDKbpqSqk9']: `First+ever+%23NFT+by+%24DCFI+placed+at+price+420+%24SRM+to+celebrate+our+expected+public+release+in+Q4%2F20+%F0%9F%9A%80+%F0%9F%91%A8%E2%80%8D%F0%9F%8C%BE+%0D%0A%0D%0Ahttps%3A%2F%2Fsolible.com%2F%23%2Fsearch%2Fdecefi%2F%0D%0A%24DCFI%20%24SRM%20%24SOL%20%24UNI%20%24ETH%20%24DOT%20%24BNB%20%24LINK%20%24ADA%0Apic.twitter.com/lDKbpqSqk9`,
  ['pic.twitter.com/1eTKx8xVv6']: `Farm+tokens+by+trading.%0D%0A%0D%0AHow+to+farm+%24DCFI+https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dyz5uaN0aCyw%0D%0A%0D%0AFarm+%24DCFI+by+%24SRM+market+buy+on+https%3A%2F%2Fdex.cryptocurrencies.ai%2F%0D%0A%24DCFI%20%24SRM%20%24SOL%20%24UNI%20%24ETH%20%24DOT%20%24BNB%20%24LINK%20%24ADA%0Apic.twitter.com/1eTKx8xVv6`,
  ['pic.twitter.com/lFmV3DbndY']: `Here%20are%20some%20real%20numbers%20about%20%40projectserum%20trading%20on%20%40solana%20via%20%40CCAI_Official%20interface.%0AFast%20DEX%20trading%20is%20here%20already%2C%20check%20it%20out%20at%20https%3A%2F%2Fdex.cryptocurrencies.ai%2F%0D%0A%24DCFI%20%24SRM%20%24SOL%20%24UNI%20%24ETH%20%24DOT%20%24BNB%20%24LINK%20%24ADA%0Apic.twitter.com/lFmV3DbndY`,
})

const getHrefFromGifLink = (
  gifLink: string,
  dcfiEarnedForTwitter: number
): string => links(dcfiEarnedForTwitter)[gifLink]

export const SharePopup = (props) => {
  const { theme, isSharePopupOpen, dcfiEarnedForTwitter, publicKey } = props
  const [choosenPic, setChoosenPic] = useState('pic.twitter.com/kxICFUi5qs')
  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      style={{ width: '100%' }}
      onClose={() => {
        props.toggleSharePopupIsOpen()
      }}
      open={isSharePopupOpen}
    >
      <SharePop>
        <RowContainer>
          <CardText
            style={{
              borderBottom: '.1rem solid #424B68',
              paddingBottom: '2rem',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
            theme={theme}
          >
            Select Illustration Design
            <ClearButton>
              <Clear
                style={{ fontSize: '3rem' }}
                color="inherit"
                onClick={() => {
                  props.toggleSharePopupIsOpen()
                }}
              />
            </ClearButton>
          </CardText>
        </RowContainer>
        <RowContainer style={{ marginTop: '2rem' }}>
          <GifContainer
            theme={theme}
            isChoosen={choosenPic === 'pic.twitter.com/kxICFUi5qs'}
            onClick={() => {
              setChoosenPic('pic.twitter.com/kxICFUi5qs')
            }}
          >
            <Gif src={connectDefiCefi}></Gif>
          </GifContainer>
          <GifContainer
            theme={theme}
            isChoosen={choosenPic === 'pic.twitter.com/Q3f4242Zrb'}
            onClick={() => {
              setChoosenPic('pic.twitter.com/Q3f4242Zrb')
            }}
          >
            <Gif src={Solana}></Gif>
          </GifContainer>
          <GifContainer
            theme={theme}
            isChoosen={choosenPic === 'pic.twitter.com/k7LIQlAI3w'}
            onClick={() => {
              setChoosenPic('pic.twitter.com/k7LIQlAI3w')
            }}
          >
            <Gif src={farmDistrub}></Gif>
          </GifContainer>
        </RowContainer>
        <RowContainer>
          {' '}
          <GifContainer
            theme={theme}
            isChoosen={choosenPic === 'pic.twitter.com/lFmV3DbndY'}
            onClick={() => {
              setChoosenPic('pic.twitter.com/lFmV3DbndY')
            }}
          >
            <Gif src={speedGif}></Gif>
          </GifContainer>
          <GifContainer
            theme={theme}
            isChoosen={choosenPic === 'pic.twitter.com/lDKbpqSqk9'}
            onClick={() => {
              setChoosenPic('pic.twitter.com/lDKbpqSqk9')
            }}
          >
            {' '}
            <Gif src={Subtract}></Gif>
          </GifContainer>
          <GifContainer
            theme={theme}
            isChoosen={choosenPic === 'pic.twitter.com/1eTKx8xVv6'}
            onClick={() => {
              setChoosenPic('pic.twitter.com/1eTKx8xVv6')
            }}
          >
            <Gif src={TwitterPost}></Gif>
          </GifContainer>
        </RowContainer>
        <RowContainer style={{ margin: '2rem auto' }}>
          <BtnCustom
            theme={theme}
            btnColor={theme.palette.grey.main}
            backgroundColor={theme.palette.blue.serum}
            hoverBackground={theme.palette.blue.serum}
            padding={'1.5rem 0'}
            height={'5rem'}
            fontSize={'1.6rem'}
            btnWidth={'34%'}
            textTransform={'none'}
            href={`https://twitter.com/intent/tweet?text=${getHrefFromGifLink(
              choosenPic,
              dcfiEarnedForTwitter
            )}`}
            rel="noopener noreferrel"
            target={'_blank'}
            onClick={(e) => {
              if (publicKey === '') {
                e.preventDefault()
                notify({
                  message: 'Connect your wallet first',
                  type: 'error',
                })
              }
            }}
          >
            <SvgIcon
              src={blackTwitter}
              width={'2.5rem'}
              height={'2.5rem'}
              style={{ marginRight: '1rem' }}
            />{' '}
            Share
          </BtnCustom>
        </RowContainer>
      </SharePop>
    </DialogWrapper>
  )
}

export default compose(withTheme())(SharePopup)
