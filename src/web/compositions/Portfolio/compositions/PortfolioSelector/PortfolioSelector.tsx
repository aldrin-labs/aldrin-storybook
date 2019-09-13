import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'

import { withTheme } from '@material-ui/styles'
import { Slide } from '@material-ui/core'

// import Dropdown from '@sb/components/SimpleDropDownSelector'
import Accounts from '@sb/components/Accounts/Accounts'
import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'
import { addMainSymbol } from '@sb/components/index'
// import Wallets from '@sb/components/Wallets/Wallets'
import {
  AccountsWalletsBlock,
  // FilterIcon,
  // FilterValues,
  // Name,
  // FilterContainer,
  TypographyTitle,
  // AddAccountBlock,
  // GridRow,
  // GridCell,
  SliderContainer,
  GridSection,
  GridSectionAccounts,
  GridSectionDust,
  // ReactSelectCustom,
  GridSymbolContainer,
  GridSymbolValue,
  // TypographySpan,
  SliderDustFilter,
} from './PortfolioSelector.styles'
import * as UTILS from '@core/utils/PortfolioSelectorUtils'
// import { MASTER_BUILD } from '@core/utils/config'
import { IProps } from './PortfolioSelector.types'
// import {
//   percentageDustFilterOptions,
//   usdDustFilterOptions,
// } from './PortfolioSelector.options'
import { Grid } from '@material-ui/core'

//import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'

// import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
// import { RadioGroup, Radio } from '@material-ui/core'

// import { Icon } from '@sb/styles/cssUtils'
import SvgIcon from '@sb/components/SvgIcon'
import PortfolioSidebarBack from '@icons/PortfolioSidebarBack.svg'

import AccountsSlick from '@sb/compositions/Transaction/AccountsSlick/AccountsSlick'

// import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'
import Loader from '@sb/components/TablePlaceholderLoader/newLoader'
// import { updateSettingsMutation } from '@core/utils/PortfolioSelectorUtils'

import { getPortfolioKeys } from '@core/graphql/queries/portfolio/getPortfolioKeys'
import { getPortfolioMainQuery } from '@core/graphql/queries/portfolio/main/serverPortfolioQueries/getPortfolioMainQuery'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { updatePortfolioSettingsMutation } from '@core/graphql/mutations/portfolio/updatePortfolioSettingsMutation'
// const MyLinkToUserSettings = (props: any) => (
//   <Link to="/user" style={{ textDecoration: 'none' }} {...props}>
//     {props.children}{' '}
//   </Link>
// )

// On this value we divide slider percentage to get btc filter value (100% = 0.01 btc)
const BTC_PART_DIVIDER = 10000

@withRouter
@withTheme()
class PortfolioSelector extends React.Component<IProps> {
  state = {
    valueSliderPercentage: 0,
    valueSliderPercentageContainer: 0,
    valueSliderUsd: 0,
    valueSliderUsdContainer: 0,
    valueSliderBtc: 0,
    valueSliderBtcContainer: 0,
  }

  componentDidMount() {
    const { dustFilter = { usd: 0, percentage: 0, btc: 0 } } = this.props

    const { percentage, usd, btc } = dustFilter

    const value =
      percentage === 0.1
        ? 20
        : percentage === 0.3
        ? 40
        : percentage === 0.5
        ? 60
        : percentage === 1
        ? 80
        : percentage === 10
        ? 100
        : 0

    this.setState({
      valueSliderPercentage: value,
      valueSliderPercentageContainer: percentage,
      valueSliderUsd: usd,
      valueSliderUsdContainer: usd,
      valueSliderBtc: btc * BTC_PART_DIVIDER,
      valueSliderBtcContainer: btc,
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
  }

  handleChangeUsd = (event, value) => {
    this.setState({
      valueSliderUsd: +value,
      valueSliderUsdContainer: +value,
    })
  }

  handleChangeBtc = (event, value) => {
    this.setState({
      valueSliderBtc: +value,
      valueSliderBtcContainer: value / BTC_PART_DIVIDER,
    })
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
    const { portfolioId, newKeys, isRebalance } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        [isRebalance
          ? 'selectedRebalanceKeys'
          : 'selectedKeys']: UTILS.getArrayContainsOnlySelected(
          newKeys,
          toggledKeyID
        ),
      },
    }

    await this.updateSettings(objForQuery)
  }

  onKeysSelectAll = async () => {
    const { portfolioId, newKeys, isRebalance } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        [isRebalance
          ? 'selectedRebalanceKeys'
          : 'selectedKeys']: UTILS.getArrayContainsAllSelected(newKeys),
      },
    }

    await this.updateSettings(objForQuery)
  }

  onKeySelectOnlyOne = async (toggledKeyID: string) => {
    const { portfolioId, isRebalance } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        [isRebalance ? 'selectedRebalanceKeys' : 'selectedKeys']: [
          toggledKeyID,
        ],
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
      isRebalance,
    } = this.props
    let objForQuery

    if (
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length
    ) {
      objForQuery = {
        settings: {
          portfolioId,
          [isRebalance ? 'selectedRebalanceKeys' : 'selectedKeys']: [],
          selectedWallets: [],
        },
      }
    } else {
      objForQuery = {
        settings: {
          portfolioId,
          [isRebalance
            ? 'selectedRebalanceKeys'
            : 'selectedKeys']: JSON.stringify(newKeys.map((el) => el._id)),
          selectedWallets: newWallets.map((el) => el._id),
        },
      }
    }

    await this.updateSettings(objForQuery)
  }

  onDustFilterChange = async (value: number, dustFilterParam: string) => {
    const {
      portfolioId,
      dustFilter: { usd, percentage, btc },
    } = this.props
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
        : dustFilterParam === 'btc'
        ? value / BTC_PART_DIVIDER
        : value

    await this.updateSettings({
      settings: {
        portfolioId,
        dustFilter: {
          ...{ usd, percentage, btc },
          [dustFilterParam]: +dustFilterParamValue,
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
      portfolioKeys = {
        myPortfolios: [{ portfolioAssets: {}, name: 'Loading...', _id: 1 }],
      },
      portfolioNames = {
        myPortfolios: [],
      },
      isRebalance,
      isUSDCurrently,
      data: { myPortfolios },
      baseCoin,
    } = this.props

    const {
      valueSliderBtc,
      valueSliderBtcContainer,
      valueSliderUsd,
      valueSliderUsdContainer,
      valueSliderPercentage,
      valueSliderPercentageContainer,
    } = this.state

    if (
      !portfolioKeys ||
      !portfolioKeys.myPortfolios ||
      !portfolioNames ||
      !portfolioNames.myPortfolios
    )
      return null

    const allPortfoliosNames = portfolioNames.myPortfolios.map((portfolio) =>
      portfolio.name.toLowerCase()
    )

    const login = true

    const isTransactions =
      this.props.location.pathname === '/portfolio/transactions'

    const isCheckedAll =
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length

    const color = theme.palette.secondary.main

    const { totalKeyAssetsData, portfolioAssetsData } = getPortfolioAssetsData(
      portfolioKeys.myPortfolios[0]
        ? portfolioKeys.myPortfolios[0].portfolioAssets
        : [],
      isTransactions ? 'USDT' : baseCoin
    )

    const { name, _id } = portfolioKeys.myPortfolios[0]

    const updatePercentageSlider = () =>
      this.onDustFilterChange(valueSliderPercentage, 'percentage')

    const updateUSDSlider = () => this.onDustFilterChange(valueSliderUsd, 'usd')
    const updateBTCSlider = () => this.onDustFilterChange(valueSliderBtc, 'btc')

    return (
      <Slide
        style={{
          width: '41rem',
        }}
        in={isSideNavOpen}
        direction="right"
        timeout={{ enter: 375, exit: 250 }}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <AccountsWalletsBlock
          isSideNavOpen={true}
          background={theme.palette.background.paper}
          hoverBackground={theme.palette.action.hover}
          fontFamily={theme.typography.fontFamily}
        >
          <GridSection style={{ height: '15rem' }}>
            <SvgIcon
              src={PortfolioSidebarBack}
              style={{
                position: 'absolute',
                top: '-4rem',
                left: 0,
              }}
              width="100%"
              height="20rem"
            />

            <Grid
              style={{
                position: 'relative',
                zIndex: 2,
                padding: '0 1.5rem',
                height: '15rem',
              }}
            >
              <Grid container justify="space-between" alignItems="center">
                <TypographyTitle>Portfolio</TypographyTitle>
                <PortfolioSelectorPopup
                  data={myPortfolios[0]}
                  allPortfoliosNames={allPortfoliosNames}
                  baseCoin={baseCoin}
                  isPortfolio={true}
                  forceUpdateAccountContainer={() => this.forceUpdate()}
                />
              </Grid>

              <AccountsSlick
                allPortfolios={portfolioNames.myPortfolios}
                totalKeyAssetsData={totalKeyAssetsData}
                currentName={name}
                currentId={_id}
                baseCoin={baseCoin}
              />

              <CreatePortfolio
                baseCoin={baseCoin}
                allPortfoliosNames={allPortfoliosNames}
              />
            </Grid>
          </GridSection>

          <GridSectionAccounts>
            <Accounts
              {...{
                color,
                login,
                isCheckedAll,
                newKeys,
                isRebalance,
                baseCoin,
                portfolioAssetsData,
                onToggleAll: this.onToggleAll,
                onKeyToggle: this.onKeyToggle,
                onKeySelectOnlyOne: this.onKeySelectOnlyOne,
                onKeysSelectAll: this.onKeysSelectAll,
              }}
              isSidebar={true}
            />
          </GridSectionAccounts>
          {!isRebalance && (
            <GridSectionDust lg={12}>
              <TypographyTitle style={{ color: '#7284a0' }}>
                Dust Filter
              </TypographyTitle>
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
                    onChange={this.handleChangePercentage}
                    onDragEnd={updatePercentageSlider}
                  />
                  <GridSymbolValue>
                    {valueSliderPercentageContainer === 0 ||
                    valueSliderPercentageContainer === null
                      ? `No % Filter`
                      : `< ${valueSliderPercentageContainer} %`}
                  </GridSymbolValue>
                </SliderContainer>

                {isUSDCurrently && (
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
                      onChange={this.handleChangeUsd}
                      onDragEnd={updateUSDSlider}
                    />
                    <GridSymbolValue>
                      {valueSliderUsd === 0 || dustFilter.usd === null
                        ? `No $ Filter`
                        : `< ${valueSliderUsdContainer} $`}
                    </GridSymbolValue>
                  </SliderContainer>
                )}

                {!isUSDCurrently && (
                  <SliderContainer>
                    <GridSymbolContainer>
                      {addMainSymbol('', false)}
                    </GridSymbolContainer>
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
                      value={this.state.valueSliderBtc}
                      onChange={this.handleChangeBtc}
                      onDragEnd={updateBTCSlider}
                    />
                    {valueSliderBtcContainer === 0 ||
                    dustFilter.btc === null ? (
                      <GridSymbolValue>
                        No {addMainSymbol('', false)} Filter
                      </GridSymbolValue>
                    ) : (
                      <GridSymbolValue>
                        {'< '} {addMainSymbol(valueSliderBtcContainer, false)}
                      </GridSymbolValue>
                    )}
                  </SliderContainer>
                )}
              </>
            </GridSectionDust>
          )}
        </AccountsWalletsBlock>
      </Slide>
    )
  }
}

export default compose(
  graphql(getPortfolioKeys, {
    name: 'portfolioKeys',
    options: ({ baseCoin }) => ({
      variables: { baseCoin, innerSettings: true },
      pollInterval: 30000,
    }),
  }),
  graphql(getMyPortfoliosQuery, {
    name: 'portfolioNames',
    options: ({ baseCoin }) => ({
      variables: { baseCoin, innerSettings: true },
    }),
  }),
  graphql(updatePortfolioSettingsMutation, {
    name: 'updatePortfolioSettings',
    options: ({ baseCoin }) => ({
      refetchQueries: [
        {
          query: portfolioKeyAndWalletsQuery,
          variables: { baseCoin },
        },
        {
          query: getPortfolioKeys,
          variables: { baseCoin, innerSettings: true },
        },
        {
          query: getPortfolioKeys,
          variables: { baseCoin, innerSettings: false },
        },
      ],
      // update: updateSettingsMutation,
    }),
  })
)(PortfolioSelector)
