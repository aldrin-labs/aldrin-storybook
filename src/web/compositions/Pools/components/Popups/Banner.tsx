import React from 'react'
import LightLogo from '@icons/lightLogo.svg'
import Close from '@icons/closeIcon.svg'

import { Row, Cell } from '@sb/components/Layout'
import { RootRow } from '@sb/compositions/Pools/components/Charts/styles'

import { SvgIcon } from '@sb/components'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const Banner = ({ theme }) => {
  const [isWarningPopupOpen, openWarningPopup] = useLocalStorageState(
    'volumeChartUpdateBanner',
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
            Fee and volume data may not display correctly in UI for a couple of hours.
          </WhiteText>
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
