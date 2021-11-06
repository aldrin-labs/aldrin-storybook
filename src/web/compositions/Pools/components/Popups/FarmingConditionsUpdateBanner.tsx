import React from 'react'
import LightLogo from '@icons/lightLogo.svg'
import Close from '@icons/closeIcon.svg'

import { Row, Cell } from '@sb/components/Layout'
import { RootRow } from '@sb/compositions/Pools/components/Charts/styles'

import { SvgIcon } from '@sb/components'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const FarmingConditionsUpdateBanner = ({ theme }) => {
  const [isWarningPopupOpen, openWarningPopup] = useLocalStorageState(
    'farmingConditionsUpdateBanner',
    true
  )

  if (!isWarningPopupOpen) return null

  return (
    <RootRow>
      <Cell col={12}>
        <RowContainer
          padding={'2rem 5rem'}
          justify={'space-between'}
          style={{
            background: theme.palette.blue.serum,
            borderRadius: '.6rem',
          }}
        >
          <SvgIcon height={'4rem'} width={'auto'} src={LightLogo} />
          <WhiteText
            style={{ fontSize: '2rem', fontFamily: 'Avenir Next Demi' }}
          >
            Please, read the important announcement about the farming conditions
            update.
          </WhiteText>
          <BtnCustom
            color={'#fff'}
            target={'_blank'}
            height={'100%'}
            textTransform={'capitalize'}
            fontSize={'1.5rem'}
            href={
              'https://blog.aldrin.com/important-update-in-farming-terms-249e188e307a'
            }
          >
            Read
          </BtnCustom>
          <SvgIcon
            height={'2rem'}
            width={'auto'}
            src={Close}
            style={{ cursor: 'pointer' }}
            onClick={() => openWarningPopup(false)}
          />
        </RowContainer>
      </Cell>
    </RootRow>
  )
}
