import React, { useState, useEffect } from 'react'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { createPortfolioMutation } from '@core/graphql/mutations/user/createPortfolioMutation'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'

import PopupStart from '@sb/components/Onboarding/PopupStart/PopupStart'
import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import Congratulations from '@sb/components/Onboarding/Congratulations/Congratulations'
import BinanceAccountCreated from '@sb/components/Onboarding/BinanceAccountCreated/BinanceAccountCreated'
import BinanceAccountCreatedLater from '@sb/components/Onboarding/BinanceAccountCreatedLater/BinanceAccountCreatedLater'

import { demoKeyId } from '@core/utils/config'

import { ICurrentStep, IProps } from './PortfolioOnboarding.types'
// import { portfolioMainSteps } from '@sb/config/joyrideSteps'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

const Onboarding = ({
  getTooltipSettingsQuery,
  updateTooltipSettings,
  portfolioKeys,
  numberOfKeys,
  createPortfolio,
  portfoliosNumber,
  portfolioId,
  baseCoin,
  theme,
}: IProps) => {
  const {
    getTooltipSettings: { onboarding },
  } = getTooltipSettingsQuery

  const { instructions: needOnboarding } = onboarding
    ? onboarding
    : { instructions: false }

  if (portfolioKeys.length > 1 || portfoliosNumber > 1) {
    return null
  }

  if (!needOnboarding) return null

  const [currentStep, setCurrentStep] = useState<ICurrentStep>('start')

  useEffect(() => {
    const variables = {
      inputPortfolio: {
        name: 'My portfolio',
      },
    }

    createPortfolio({
      variables,
    })
  }, [])
  
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
      {currentStep === 'start' && (
        <PopupStart
          theme={theme}
          open={true}
          baseCoin={baseCoin}
          setCurrentStep={setCurrentStep}
        />
      )}

      {/* {currentStep === 'createPortfolio' && (
        <CreatePortfolio
          open={true}
          onboarding={true}
          baseCoin={baseCoin}
          portfolioId={portfolioId}
          setCurrentStep={setCurrentStep}
        />
      )} */}

      {currentStep === 'addAccount' && (
        <AddAccountDialog
          open={true}
          numberOfKeys={numberOfKeys}
          onboarding={true}
          baseCoin={baseCoin}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 'congratulations' && (
        <Congratulations open={true} completeOnboarding={completeOnboarding} />
      )}

      {currentStep === 'binanceAccountCreated' && (
        <BinanceAccountCreated
          open={true}
          setCurrentStep={setCurrentStep}
          completeOnboarding={completeOnboarding}
        />
      )}

      {currentStep === 'binanceAccountCreatedLater' && (
        <BinanceAccountCreatedLater
          open={true}
          completeOnboarding={completeOnboarding}
        />
      )}
    </>
  )
}

export default compose(
  withTheme,
  graphql(createPortfolioMutation, {
    name: 'createPortfolio',
    options: ({ baseCoin }: { baseCoin: 'USDT' | 'BTC' }) => ({
      refetchQueries: [
        { query: getMyPortfoliosQuery, variables: { baseCoin } },
      ],
    }),
  }),
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
    fetchPolicy: 'network-only',
    withOutSpinner: true,
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
