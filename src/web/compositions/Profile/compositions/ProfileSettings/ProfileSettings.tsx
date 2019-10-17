import React from 'react'

import {
  ProfileSettingsGrid,
  LogsGrid,
  SettingsLeftBlock,
  SettingsRightBlock,
  SettingsBlock,
} from './ProfileSettings.styles'

import {
  Line,
  StyledInput,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { MainContainer } from '@sb/compositions/Profile/compositions/ProfileAccounts/ProfileAccounts.styles'

const ProfileSettings = () => {
  return (
    <MainContainer>
      <SettingsLeftBlock>
        <ProfileSettingsGrid title={'settings'} height={'35%'}>
          <SettingsBlock>
            <div>
              <p>prikol</p>
              <StyledInput
                type="text"
                width="100"
                // value={marketName}
                // onChange={(e) => this.changeMarketName(e)}
                placeholder="Type name..."
                style={{ marginLeft: '0rem' }}
              />
            </div>
            <div>button</div>
          </SettingsBlock>
        </ProfileSettingsGrid>

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
