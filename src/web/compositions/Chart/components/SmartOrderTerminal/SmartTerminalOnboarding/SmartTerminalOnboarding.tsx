import React from 'react';
import { compose } from 'recompose';
import Tour from 'reactour';
import { graphql } from 'react-apollo';

import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings';
import { queryRendererHoc } from '@core/components/QueryRenderer';
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings';
import { finishJoyride } from '@core/utils/joyride';

import { FinishBtn, smartTerminal } from '@sb/components/ReactourOnboarding/ReactourOnboarding';

const accentColor = '#1BA492';

const closeSmartTerminalOnboarding = ({ updateTooltipSettingsMutation, getTooltipSettings }) => {
	finishJoyride({
		updateTooltipSettingsMutation: updateTooltipSettingsMutation,
		getTooltipSettings: getTooltipSettings,
		name: 'smartTerminal'
	});
};

const SmartOrderOnboarding = ({ updateTooltipSettingsMutation, getTooltipSettingsQuery }) => {
	const {
		getTooltipSettings = {
			__typename: 'AccountSettingsTooltipSettings',
			portfolioMain: false,
			portfolioIndustry: false,
			portfolioRebalance: false,
			portfolioCorrelation: false,
			portfolioOptimization: false,
			chartPage: false,
			chartPagePopup: false,
			multiChartPage: false,
			transactionPage: false,
			smartTerminal: false,
			onboarding: {
				__typename: 'AccountSettingsTooltipSettingsOnboarding',
				instructions: false,
				portfolioName: false,
				exchangeKey: false,
				congratulations: false
			}
		}
	} = getTooltipSettingsQuery || {
		getTooltipSettings: {
			__typename: 'AccountSettingsTooltipSettings',
			portfolioMain: false,
			portfolioIndustry: false,
			portfolioRebalance: false,
			portfolioCorrelation: false,
			portfolioOptimization: false,
			chartPage: false,
			chartPagePopup: false,
			multiChartPage: false,
			transactionPage: false,
			smartTerminal: false,
			onboarding: {
				__typename: 'AccountSettingsTooltipSettingsOnboarding',
				instructions: false,
				portfolioName: false,
				exchangeKey: false,
				congratulations: false
			}
		}
  };
  
  const shouldRunOnboarding = getTooltipSettings.smartTerminalOnboarding

	return shouldRunOnboarding && (
		<Tour
			showCloseButton={false}
			nextButton={<FinishBtn>Next</FinishBtn>}
			prevButton={<a />}
			showNavigationNumber={true}
			showNavigation={true}
			lastStepNextButton={<FinishBtn>Finish</FinishBtn>}
			steps={smartTerminal}
			accentColor={accentColor}
      isOpen={shouldRunOnboarding}
      onRequestClose={() => {
				closeSmartTerminalOnboarding({ getTooltipSettings, updateTooltipSettingsMutation });
			}}
		/>
	);
};

const MemoizedSmartOrderOnboarding = React.memo(SmartOrderOnboarding);

const SmartOrderOnboardingDataWrapper = compose(
	queryRendererHoc({
		skip: (props: any) => !props.authenticated,
		query: GET_TOOLTIP_SETTINGS,
		name: 'getTooltipSettingsQuery',
		fetchPolicy: 'cache-only'
	}),
	graphql(updateTooltipSettings, {
		name: 'updateTooltipSettingsMutation'
	})
)(MemoizedSmartOrderOnboarding);

const MemoizedSmartOrderOnboardingDataWrapper = React.memo(SmartOrderOnboardingDataWrapper);

export default MemoizedSmartOrderOnboardingDataWrapper;
