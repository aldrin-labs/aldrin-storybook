import React from 'react'
import styled from 'styled-components'
import TechSvg from '@icons/tech.svg'
import TelegramSvg from '@icons/telegram.svg'
import DiscordSvg from '@icons/smallDiscord.svg'
import SvgIcon from '@sb/components/SvgIcon'

const ButtonLink = styled.a`
  display: flex;
  align-items: center;
  background: ${(props) => props.background || '#6E98E9'};
  padding: 1rem 2rem;
  cursor: pointer;
  border-radius: 0.6rem;
  text-decoration: none;
`

const TechIssues = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100% - 6rem)',
        flexDirection: 'column',
      }}
    >
      <SvgIcon src={TechSvg} width="6rem" height="6rem" />
      <h3
        style={{
          fontFamily: 'DM Sans',
          fontWeight: 'bold',
          fontSize: '2.5rem',
          color: '#fff',
          marginTop: '5rem',
        }}
      >
        Sorry, we support only Chrome and Chrome Canary browsers for now
      </h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '3rem',
        }}
      >
        <ButtonLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.google.com/chrome/"
          style={{ marginRight: '1.5rem' }}
        >
          <span
            style={{ fontFamily: 'DM Sans', fontSize: '2rem', color: '#fff' }}
          >
            Download Chrome browser
          </span>
        </ButtonLink>
      </div>
      <span
        style={{
          fontFamily: 'DM Sans',
          fontSize: '2rem',
          color: '#fff',
          marginTop: '8rem',
        }}
      >
        To keep posted or discuss something:
      </span>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '3rem',
        }}
      >
        <ButtonLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://t.me/Aldrin_Exchange"
          style={{ marginRight: '1.5rem' }}
        >
          <SvgIcon
            src={TelegramSvg}
            style={{ marginRight: '.5rem' }}
            width="1.5rem"
            height="1.5rem"
          />
          <span
            style={{ fontFamily: 'DM Sans', fontSize: '2rem', color: '#fff' }}
          >
            Telegram
          </span>
        </ButtonLink>
        <ButtonLink
          target="_blank"
          rel="noopener noreferrer"
          background="#886AED"
          href="https://discord.gg/4VZyNxT2WU"
          style={{ marginRight: '1.5rem' }}
        >
          <SvgIcon
            src={DiscordSvg}
            style={{ marginRight: '.5rem' }}
            width="1.5rem"
            height="1.5rem"
          />
          <span
            style={{ fontFamily: 'DM Sans', fontSize: '2rem', color: '#fff' }}
          >
            Discord
          </span>
        </ButtonLink>
      </div>
    </div>
  )
}

export default TechIssues
