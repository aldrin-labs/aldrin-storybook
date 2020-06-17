import React, { useState } from 'react'
import { graphql } from 'react-apollo'

import { compose } from 'recompose'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'

import PopupStart from '@sb/components/Onboarding/PopupStart/PopupStart'
// import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import Congratulations from '@sb/components/Onboarding/Congratulations/Congratulations'
import BinanceAccountCreated from '@sb/components/Onboarding/BinanceAccountCreated/BinanceAccountCreated'
// import BinanceAccountCreatedLater from '@sb/components/Onboarding/BinanceAccountCreatedLater/BinanceAccountCreatedLater'

import { ICurrentStep, IProps } from './PortfolioOnboarding.types'
// import { portfolioMainSteps } from '@sb/config/joyrideSteps'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

const Onboarding = ({
  getTooltipSettingsQuery,
  updateTooltipSettings,
  numberOfKeys,
  baseCoin,
}: IProps) => {
  const [currentStep, setCurrentStep] = useState<ICurrentStep>('start')

  console.log('Onboarding')
  const completeOnboarding = async () => {
    await updateTooltipSettings({
      variables: {
        settings: {
          ...removeTypenameFromObject(
            getTooltipSettingsQuery.getTooltipSettings
          ),
          onboarding: {
            ...removeTypenameFromObject(
              getTooltipSettingsQuery.getTooltipSettings.onboarding
            ),
            instructions: false,
          },
        },
      },
      update: updateTooltipMutation,
    })
  }

  return (
    <>
      {/* This is very important <div> below, even it doesn't look like that, do not erase it because it's create magic for us */}
      <div> </div>
      <PopupStart
        open={currentStep === 'start'}
        baseCoin={baseCoin}
        setCurrentStep={setCurrentStep}
        completeOnboarding={completeOnboarding}
      />
      {/* {currentStep === 'createPortfolio' && (
        <CreatePortfolio
          open={true}
          onboarding={true}
          baseCoin={baseCoin}
          portfolioId={portfolioId}
          setCurrentStep={setCurrentStep}
        />
      )} */}
      {/* <AddAccountDialog
        open={currentStep === 'addAccount'}
        numberOfKeys={numberOfKeys}
        onboarding={true}
        baseCoin={baseCoin}
        setCurrentStep={setCurrentStep}
        includeBrokerKey={false}
      />
      <Congratulations
        open={currentStep === 'congratulations'}
        completeOnboarding={completeOnboarding}
      />
      <BinanceAccountCreated
        open={currentStep === 'binanceAccountCreated'}
        completeOnboarding={completeOnboarding}
      /> */}
      {/* <BinanceAccountCreatedLater
          open={currentStep === 'binanceAccountCreatedLater'}
          completeOnboarding={completeOnboarding}
        /> */}
    </>
  )
}

export default compose(
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettings',
    options: ({ baseCoin }) => ({
      update: updateTooltipMutation,
      refetchQueries: [
        {
          query: GET_TOOLTIP_SETTINGS,
        },
        {
          query: portfolioKeyAndWalletsQuery,
          variables: { baseCoin },
        },
        {
          query: getPortfolioAssets,
          variables: { baseCoin, innerSettings: true },
        },
      ],
    }),
  })
)(Onboarding)
