import * as React from 'react'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/styles'
import Joyride from 'react-joyride'
import { graphql } from 'react-apollo'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { withErrorFallback } from '@sb/components/hoc/withErrorFallback/withErrorFallback'
import { IProps, IState } from './types'
import { portfolioIndustrySteps } from '@sb/config/joyrideSteps'
import Template from './Template'
import IndustryTable from '@core/containers/IndustryTable'
import IndustryChart from '@core/containers/IndustryChart'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

@withTheme
class PortfolioTableIndustries extends React.Component<IProps, IState> {
  state: IState = {
    key: 0,
  }

  handleJoyrideCallback = async (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getTooltipSettingsQuery: { getTooltipSettings },
      } = this.props

      await updateTooltipSettingsMutation({
        variables: {
          settings: {
            ...removeTypenameFromObject(getTooltipSettings),
            portfolioIndustry: false,
          },
        },
      })
    }

    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const {
      theme,
      dustFilter,
      getTooltipSettingsQuery: { getTooltipSettings },
    } = this.props

    return (
      <>
        <Template
          Table={<IndustryTable dustFilter={dustFilter} />}
          Chart={<IndustryChart />}
        />
        {/* <Joyride
          steps={portfolioIndustrySteps}
          // run={getTooltipSettings.portfolioIndustry}
          run={false}
          callback={this.handleJoyrideCallback}
          key={this.state.key}
          styles={{
            options: {
              backgroundColor: theme.palette.getContrastText(
                theme.palette.primary.main
              ),
              primaryColor: theme.palette.secondary.main,
              textColor: theme.palette.primary.main,
            },
            tooltip: {
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
            },
          }}
        /> */}
      </>
    )
  }
}

export default compose(
  withErrorFallback,
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
    options: {
      update: updateTooltipMutation,
    },
  })
)(PortfolioTableIndustries)
