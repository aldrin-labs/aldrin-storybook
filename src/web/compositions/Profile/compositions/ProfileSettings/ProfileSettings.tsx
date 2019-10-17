import React from 'react'

import {
  GridBlock,
  GridTitle,
  TextTitle,
  LogsGrid,
  SettingsLeftBlock,
  SettingsRightBlock,
} from './ProfileSettings.styles'
import { MainContainer } from '@sb/compositions/Profile/compositions/ProfileAccounts/ProfileAccounts.styles'

const ProfileSettingsGrid = ({
  title,
  height = '100%',
  width = '100%',
  needMarginTop = false,
  needMarginLeft = false,
  children,
}) => {
  return (
    <GridBlock
      height={height}
      width={width}
      needMarginTop={needMarginTop}
      needMarginLeft={needMarginLeft}
    >
      <GridTitle>
        <TextTitle>{title}</TextTitle>
      </GridTitle>
      {children}
    </GridBlock>
  )
}

const ProfileSettings = () => {
  return (
    <MainContainer>
      <SettingsLeftBlock>
        <ProfileSettingsGrid title={'settings'} height={'35%'} />
        <LogsGrid>
          <ProfileSettingsGrid title={'last login'} width={'33.3%'} />

          <ProfileSettingsGrid
            title={'activity logs'}
            width={'66.6%'}
            needMarginLeft={true}
          />
        </LogsGrid>
      </SettingsLeftBlock>
      {/*  */}
      <SettingsRightBlock>
        <ProfileSettingsGrid title={'2-factor authentication'} height={'41%'} />
        <ProfileSettingsGrid
          title={'password'}
          height={'45%'}
          needMarginTop={true}
        />
      </SettingsRightBlock>
    </MainContainer>
  )
}

export default ProfileSettings

// prod demo id "5bf4d8df5cdf80001dfa67a2"
// return add coin
