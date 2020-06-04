import React from 'react'
import styled from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'
import MediumIcon from '@icons/medium.svg'
import YoutubeIcon from '@icons/youtube.svg'
import Clear from '@material-ui/icons/Clear'
import BigRightArrow from '@icons/bigRightArrow.svg'

import CryptoCube from '@sb/images/Logo.png'
import SmartTerminal from '@sb/images/SmartTerminal.png'

import { finishJoyride } from '@core/utils/joyride'

const Container = styled.div`
  position: absolute;
  z-index: 300;
  top: 0;
  left: 0;
  width: 70rem;
  height: 45rem;
  margin: auto;
  text-transform: uppercase;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.05rem;
  transform: translate(-100%, calc(-100% + 9rem));
  border-radius: 1.2rem;
  color: #fff;
  box-shadow: 0px 0px 1.6rem rgba(8, 22, 58, 0.1);

  @media (max-width: 1440px) {
    width: 75rem;
    height: 50rem;
  }

  @media (max-width: 1400px) {
    transform: translate(-100%, calc(-100% + 10rem));
  }
`

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 0;
  margin-bottom: 1.5rem;
  border: 0.1rem solid #fff;
  border-radius: 2rem;
  cursor: pointer;
  color: #fff;
  text-decoration: none;
`

const CloseIcon = styled(Clear)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  color: #dd6956;
  cursor: pointer;
`

export default ({ closeChartPagePopup }) => {
  return (
    <Container>
      <div
        style={{
          display: 'flex',
          height: '50%',
          background: '#16253D',
          borderTopLeftRadius: '1.2rem',
          borderTopRightRadius: '1.2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '70%',
            padding: '1.5rem',
            margin: '2rem 0',
            borderRight: '.1rem solid #fff',
          }}
        >
          <p style={{ fontSize: '4rem', margin: '0', letterSpacing: '.1rem' }}>
            Have you tried our smart trading yet?
          </p>
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '30%',
            padding: '0 4.5%',
          }}
        >
          <span
            style={{
              fontSize: '1.4rem',
              margin: '0 0 1.5rem 0',
              paddingLeft: '.5rem',
            }}
          >
            learn more:
          </span>
          <StyledLink href={'https://medium.com/@cryptocurrenies_ai'}>
            <SvgIcon src={MediumIcon} width={'2rem'} />
            <span style={{ paddingLeft: '1rem' }}>medium</span>
          </StyledLink>
          <StyledLink
            href={'https://www.youtube.com/channel/UCyUM72zWism4-LdA2J4bwew'}
          >
            <SvgIcon src={YoutubeIcon} width={'2rem'} />
            <span style={{ paddingLeft: '1rem' }}>youtube</span>
          </StyledLink>
          <CloseIcon onClick={() => {
            closeChartPagePopup()
          }} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          height: '50%',
          background: '#fff',
          borderRadius: '0 0 1.2rem 1.2rem',
          position: 'relative',
        }}
      >
        <img
          src={CryptoCube}
          style={{ position: 'absolute', left: 0, bottom: 0, height: '80%' }}
        />
        <div
          style={{
            width: '70%',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <img
            src={SmartTerminal}
            style={{ width: '100%', paddingLeft: '2rem' }}
          />
        </div>
        <div
          style={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '1.4rem',
              margin: '0 0 1.5rem 0',
              color: '#16253D',
            }}
          >
            trade smartly now:
          </span>
          <SvgIcon src={BigRightArrow} width={'100%'} height={'5rem'} />
        </div>
      </div>
    </Container>
  )
}
