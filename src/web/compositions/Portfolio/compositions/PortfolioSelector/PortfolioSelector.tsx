import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'

import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import { withTheme } from '@material-ui/styles'
import { Slide, Typography, Button } from '@material-ui/core'

import Dropdown from '@sb/components/SimpleDropDownSelector'
import Accounts from '@sb/components/Accounts/Accounts'
import Wallets from '@sb/components/Wallets/Wallets'
import {
  AccountsWalletsBlock,
  FilterIcon,
  FilterValues,
  Name,
  FilterContainer,
  TypographyTitle,
  AddAccountBlock,
  GridRow,
  GridCell,
  SliderContainer,
  GridSection,
  GridSectionAccounts,
  GridSectionDust,
  ReactSelectCustom,
  GridSymbolContainer,
  GridSymbolValue,
  TypographySpan,
  SliderDustFilter,
} from './PortfolioSelector.styles'
import * as UTILS from '@core/utils/PortfolioSelectorUtils'
import { MASTER_BUILD } from '@core/utils/config'
import { IProps } from './PortfolioSelector.types'
import {
  percentageDustFilterOptions,
  usdDustFilterOptions,
} from './PortfolioSelector.options'
import { Grid } from '@material-ui/core'

import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { RadioGroup, Radio } from '@material-ui/core'

import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'

const MyLinkToUserSettings = (props: any) => (
  <Link to="/user" style={{ textDecoration: 'none' }} {...props}>
    {props.children}{' '}
  </Link>
)

@withRouter
@withTheme()
class PortfolioSelector extends React.Component<IProps> {
  state = {
    valueSliderPercentage: 0,
    valueSliderPercentageContainer: 0,
    valueSliderUsd: 0,
    valueSliderUsdContainer: 0,
  }

  componentDidMount() {
    const value =
      this.props.dustFilter.percentage === 0.1
        ? 20
        : this.props.dustFilter.percentage === 0.3
        ? 40
        : this.props.dustFilter.percentage === 0.5
        ? 60
        : this.props.dustFilter.percentage === 1
        ? 80
        : this.props.dustFilter.percentage === 10
        ? 100
        : 0

    this.setState({
      valueSliderPercentage: value,
      valueSliderPercentageContainer: this.props.dustFilter.percentage,
      valueSliderUsd: this.props.dustFilter.usd,
      valueSliderUsdContainer: this.props.dustFilter.usd,
    })
  }

  handleChangePercentage = (event, value) => {
    this.setState({
      valueSliderPercentage: value,
      valueSliderPercentageContainer:
        value === 0
          ? 0
          : value === 20
          ? 0.1
          : value === 40
          ? 0.3
          : value === 60
          ? 0.5
          : value === 80
          ? 1
          : 10,
    })
    this.onDustFilterChange(value, 'percentage')
  }

  handleChangeUsd = (event, value) => {
    console.log('slider change: ', value)
    this.setState({
      valueSliderUsd: value,
    })
    this.onDustFilterChange(value, 'usd')
  }

  updateSettings = async (objectForMutation) => {
    const { updatePortfolioSettings } = this.props

    try {
      await updatePortfolioSettings({
        variables: objectForMutation,
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  onKeyToggle = async (toggledKeyID: string) => {
    const { portfolioId, newKeys } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        selectedKeys: UTILS.getArrayContainsOnlySelected(newKeys, toggledKeyID),
      },
    }

    await this.updateSettings(objForQuery)
  }

  onKeySelectOnlyOne = async (toggledKeyID: string) => {
    const { portfolioId } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        selectedKeys: [toggledKeyID],
      },
    }

    await this.updateSettings(objForQuery)
  }

  onWalletToggle = async (toggledWalletID: string) => {
    const { portfolioId, newWallets } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        selectedWallets: UTILS.getArrayContainsOnlySelected(
          newWallets,
          toggledWalletID
        ),
      },
    }

    await this.updateSettings(objForQuery)
  }

  onToggleAll = async () => {
    const {
      newKeys,
      activeKeys,
      newWallets,
      activeWallets,
      portfolioId,
    } = this.props
    let objForQuery

    if (
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length
    ) {
      objForQuery = {
        settings: {
          portfolioId,
          selectedKeys: [],
          selectedWallets: [],
        },
      }
    } else {
      objForQuery = {
        settings: {
          portfolioId,
          selectedKeys: newKeys.map((el) => el._id),
          selectedWallets: newWallets.map((el) => el._id),
        },
      }
    }

    await this.updateSettings(objForQuery)
  }

  onDustFilterChange = (value: number, dustFilterParam: string) => {
    const { portfolioId, dustFilter } = this.props
    const { usd, percentage } = dustFilter
    console.log('dustFilterParam: ', dustFilterParam)
    const dustFilterParamValue =
      dustFilterParam === 'percentage'
        ? value === 0
          ? '0'
          : value === 20
          ? '0.1'
          : value === 40
          ? '0.3'
          : value === 60
          ? '0.5'
          : value === 80
          ? '1'
          : '10'
        : value

    this.updateSettings({
      settings: {
        portfolioId,
        dustFilter: {
          ...{ usd, percentage },
          [dustFilterParam]: dustFilterParamValue,
        }, //TODO
        // dustFilter: { ...{ usd, percentage }, [dustFilterParam]: value }, //TODO
      },
    })
  }

  render() {
    const {
      isSideNavOpen,
      theme,
      newWallets,
      newKeys,
      activeKeys,
      activeWallets,
      dustFilter,
      location: { pathname },
      theme: {
        palette: { blue },
      },
      getMyPortfoliosQuery,
    } = this.props

    const MyPortfoliosOptions = getMyPortfoliosQuery.myPortfolios.map(
      (item: { _id: string; name: string }) => {
        return {
          label: item.name,
          value: item._id,
        }
      }
    )

    const isRebalance = pathname === '/portfolio/rebalance'

    const login = true

    const isCheckedAll =
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length

    const color = theme.palette.secondary.main

    const relations = ['first', 'second']
    return (
      <Slide
        style={{ width: '41rem' }}
        in={isSideNavOpen}
        direction="right"
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <AccountsWalletsBlock
          isSideNavOpen={true}
          background={theme.palette.background.paper}
          hoverBackground={theme.palette.action.hover}
          fontFamily={theme.typography.fontFamily}
        >
          <GridSection>
            <TypographyTitle>Portfolio</TypographyTitle>
            <ReactSelectCustom
              value={MyPortfoliosOptions[0]}
              // onChange={(
              //   optionSelected: {
              //     label: string
              //     value: string
              //   } | null
              // ) => onRebalanceTimerChange(optionSelected)}
              isSearchable={false}
              options={MyPortfoliosOptions}
              singleValueStyles={{
                color: theme.palette.text.subPrimary,
                fontSize: '1.488rem',
                padding: '0',
              }}
              indicatorSeparatorStyles={{}}
              controlStyles={{
                background: 'transparent',
                border: 'none',
                width: 150,
              }}
              menuStyles={{
                width: 235,
                padding: '5px 8px',
                borderRadius: '14px',
                textAlign: 'center',
              }}
              optionStyles={{
                color: theme.palette.text.primary, //'#7284A0',
                background: 'transparent',
                textAlign: 'center',
                fontSize: '0.992rem',
                '&:hover': {
                  borderRadius: '14px',
                  color: theme.palette.text.subPrimary,
                  background: theme.palette.hover[theme.palette.type],
                },
              }}
            />
            <TypographyTitle lineHeight={'22px'}>$500,000.00</TypographyTitle>
            <CreatePortfolio />
          </GridSection>

          <GridSectionAccounts>
            <Accounts
              {...{
                color,
                login,
                isSideNavOpen,
                isCheckedAll,
                newKeys,
                isRebalance,
                onToggleAll: this.onToggleAll,
                onKeyToggle: this.onKeyToggle,
                onKeySelectOnlyOne: this.onKeySelectOnlyOne,
              }}
              isSidebar={true}
            />
          </GridSectionAccounts>
          {!isRebalance && (
            <GridSectionDust lg={12}>
              <TypographyTitle>Dust Filter</TypographyTitle>
              <>
                <SliderContainer>
                  <GridSymbolContainer>%</GridSymbolContainer>
                  <SliderDustFilter
                    step={20}
                    thumbWidth="25px"
                    thumbHeight="25px"
                    sliderWidth="250px"
                    sliderHeight="17px"
                    sliderHeightAfter="20px"
                    borderRadius="30px"
                    borderRadiusAfter="30px"
                    thumbBackground="#165BE0"
                    borderThumb="2px solid white"
                    trackAfterBackground="#E7ECF3"
                    trackBeforeBackground={'#165BE0'}
                    value={this.state.valueSliderPercentage}
                    onChange={this.handleChangePercentage} //TODO onDragEnd
                  />
                  <GridSymbolValue>
                    {this.state.valueSliderPercentageContainer === 0 ||
                    this.state.valueSliderPercentageContainer === null
                      ? `No % Filter`
                      : `< ${this.state.valueSliderPercentageContainer} %`}
                  </GridSymbolValue>
                </SliderContainer>

                <SliderContainer>
                  <GridSymbolContainer>$</GridSymbolContainer>
                  <SliderDustFilter
                    step={1}
                    thumbWidth="25px"
                    thumbHeight="25px"
                    sliderWidth="250px"
                    sliderHeight="17px"
                    sliderHeightAfter="20px"
                    borderRadius="30px"
                    borderRadiusAfter="30px"
                    thumbBackground="#165BE0"
                    borderThumb="2px solid white"
                    trackAfterBackground="#E7ECF3"
                    trackBeforeBackground={'#165BE0'}
                    value={this.state.valueSliderUsd}
                    onChange={this.handleChangeUsd} //TODO onDragEnd
                  />
                  <GridSymbolValue>{`< ${dustFilter.usd} $`}</GridSymbolValue>
                </SliderContainer>
              </>
            </GridSectionDust>
          )}
        </AccountsWalletsBlock>
      </Slide>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: getMyPortfoliosQuery,
    name: 'getMyPortfoliosQuery',
  }),
  withTheme()
)(PortfolioSelector)
