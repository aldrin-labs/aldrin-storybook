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
            href={`https://twitter.com/intent/tweet?text=I%20have%20already%20farmed%20${dcfiEarnedForTwitter}%20%24DCFI%20on%20dex.cryptocurrencies.ai!%0A%0AFast%20DEX%20trading%20is%20here%20already%2C%20check%20it%20out%20at%20https%3A%2F%2Fdex.cryptocurrencies.ai%2F%0A%24DCFI%20%24SRM%20%24SOL%20%24UNI%20%24ETH%20%24DOT%20%24YFI%20%24BNB%20%24LINK%20%24EOS%20%24XTZ%20%24ADA%0A${choosenPic}`}
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
