import React from 'react'
import { Link } from 'react-router-dom'
import AldrinLogo from '@icons/Aldrin.svg'
import StakeBtn from '@icons/stakeBtn.png'
import { Button } from '../Button'

import { Body } from '../Layout'
import {
  HeaderWrap,
  LogoLink,
  LinksBlock,
  LogoBlock,
  WalletBlock,
  Logo,
} from './styles'

export const Header = () => {
  return (
    <Body>
      <HeaderWrap>
        <LogoBlock>
          <LogoLink to={'/'}>
            <Logo src={AldrinLogo} />
          </LogoLink>
          <div>
            <Button
              backgroundImage={StakeBtn}
              as={Link}
              to="/staking"
            >
              Stake RIN
            </Button>
          </div>

        </LogoBlock>
        <LinksBlock>
          Links
      </LinksBlock>
        <WalletBlock>Wallet</WalletBlock>
      </HeaderWrap>
    </Body>
  )
}