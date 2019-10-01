import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'

import PopupStart from '@sb/components/Onboarding/PopupStart/PopupStart'
import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import Congratulations from '@sb/components/Onboarding/Congratulations/Congratulations'

import { ICurrentStep, IProps } from './PortfolioOnboarding.types'
// import { portfolioMainSteps } from '@sb/config/joyrideSteps'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

const Onboarding = ({
  getTooltipSettingsQuery,
  updateTooltipSettings,
  portfolioId,
  baseCoin,
  theme,
}: IProps) => {
  const {
    getTooltipSettings: {
      onboarding: { instructions: onboarding },
    },
  } = getTooltipSettingsQuery

  if (!onboarding) return null

  const [currentStep, setCurrentStep] = useState<ICurrentStep>('start')
  const completeOnboarding = async () =>
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

  return (
    <>
      {currentStep === 'start' && (
        <PopupStart
          theme={theme}
          open={true}
          baseCoin={baseCoin}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 'createPortfolio' && (
        <CreatePortfolio
          open={true}
          onboarding={true}
          baseCoin={baseCoin}
          portfolioId={portfolioId}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 'addAccount' && (
        <AddAccountDialog
          open={true}
          onboarding={true}
          baseCoin={baseCoin}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 'congratulations' && (
        <Congratulations open={true} completeOnboarding={completeOnboarding} />
      )}
    </>
  )
}

export default compose(
  withTheme(),
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
    fetchPolicy: 'network-only',
    // refetchQueries: [
    //   {
    //     query: GET_TOOLTIP_SETTINGS,
    //   },
    // ],
  }),
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
