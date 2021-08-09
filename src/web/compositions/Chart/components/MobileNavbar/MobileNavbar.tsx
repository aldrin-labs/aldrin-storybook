import React, { useState } from 'react'
import { withTheme } from '@material-ui/core/styles'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { useWallet } from '@sb/dexUtils/wallet'

import { Theme } from '@sb/types/materialUI'
import { NavBarForSmallScreens } from './styles'
import { Link } from 'react-router-dom'

import SvgIcon from '@sb/components/SvgIcon'
import {
  LinkToDiscord,
  LinkToTelegram,
  LinkToTwitter,
} from '@sb/compositions/Homepage/SocialsLinksComponents'
import serumCCAILogo from '@icons/serumCCAILogo.svg'

import {
  Row,
  ReusableTitle as Title,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { compose } from 'recompose'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import WalletIcon from '@icons/walletIcon.svg'

import { CCAIProviderURL } from '@sb/dexUtils/utils'

// import { MobileWalletDropdown } from './MobileWalletDropdown'

export const MobileNavBar = ({ theme }) => {
  return (
    <NavBarForSmallScreens theme={theme}>
      <Link style={{ width: '30%' }} to="/">
        <SvgIcon src={serumCCAILogo} width={'100%'} height={'auto'} />
      </Link>

      <Row justify={'space-between'} width={'45%'}>
        <LinkToTwitter />
        <LinkToTelegram />
        <LinkToDiscord />
      </Row>
    </NavBarForSmallScreens>
  )
}

export default compose(withTheme(), withPublicKey)(MobileNavBar)
