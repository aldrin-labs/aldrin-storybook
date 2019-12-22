import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { client } from '@core/graphql/apolloClient'
import { cloneDeep } from 'lodash-es'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'

import { Link, withRouter } from 'react-router-dom'

import { withTheme } from '@material-ui/styles'
// import { Slide } from '@material-ui/core'

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
  Slide,
} from './PortfolioSelector.styles'
import * as UTILS from '@core/utils/PortfolioSelectorUtils'
// import { MASTER_BUILD } from '@core/utils/config'
import { IProps } from './PortfolioSelector.types'
// import {
//   percentageDustFilterOptions,
//   usdDustFilterOptions,
// } from './PortfolioSelector.options'
import { Grid } from '@material-ui/core'
import { createGlobalStyle } from 'styled-components'

//import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'

// import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
// import { RadioGroup, Radio } from '@material-ui/core'

// import { Icon } from '@sb/styles/cssUtils'
import SvgIcon from '@sb/components/SvgIcon'
import PortfolioSidebarBack from '@icons/PortfolioSidebarBack.svg'

import AccountsSlick from '@sb/compositions/Transaction/AccountsSlick/AccountsSlick'

import { getPortfolioAssetsData } from '@core/utils/Overview.utils'
import Loader from '@sb/components/TablePlaceholderLoader/newLoader'

import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import { combineTableData } from '@core/utils/PortfolioTableUtils.ts'
import { updateSettingsMutation } from '@core/utils/PortfolioSelectorUtils.ts'
import { getPortfolioMainQuery } from '@core/graphql/queries/portfolio/main/serverPortfolioQueries/getPortfolioMainQuery'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { updateDustFilter } from '@core/graphql/mutations/portfolio/updateDustFilter'
import { updatePortfolioSettingsMutation } from '@core/graphql/mutations/portfolio/updatePortfolioSettingsMutation'
// const MyLinkToUserSettings = (props: any) => (
//   <Link to="/user" style={{ textDecoration: 'none' }} {...props}>
//     {props.children}{' '}
//   </Link>
// )

// On this value we divide slider percentage to get btc filter value (100% = 0.01 btc)
const BTC_PART_DIVIDER = 10000

const RebalanceMediaQuery = createGlobalStyle`
  @media only screen and (min-width: 2560px) {
    html {
      font-size: 15px;
    }
  }
`

@withRouter
@withTheme
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
    const {
      dustFilter = { usd: 0, percentage: 0, btc: 0 },
      keys,
      portfolioId,
      activeKeys,
    } = this.props

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

    if (keys.length > 0 && activeKeys.length === 0) {
      const objForQuery = {
        settings: {
          portfolioId,
          selectedKeys: UTILS.getArrayContainsOnlySelected(keys, keys[0]._id),
          selectedRebalanceKeys: UTILS.getArrayContainsOnlySelected(
            keys,
            keys[0]._id
          ),
        },
      }

      this.updateSettings(objForQuery)
    }

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

  updateSettings = async (
    objectForMutation: any,
    type: string,
    toggledKeyID: string
  ) => {
    const { updatePortfolioSettings } = this.props
    const {
      portfolio: { baseCoin },
    } = client.readQuery({
      query: GET_BASE_COIN,
    })
    const data = client.readQuery({
      query: portfolioKeyAndWalletsQuery,
      variables: { baseCoin },
    })

    const clonedData = cloneDeep(data)

    const { keys, rebalanceKeys } = UTILS.updateDataSettings(
      clonedData,
      type,
      toggledKeyID
    )

    UTILS.updateSettingsLocalCache(clonedData, keys, rebalanceKeys) // Для того, чтобы писать в кэш напрямую до мутации

    try {
      await updatePortfolioSettings({
        variables: objectForMutation,
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  onKeyToggle = async (toggledKeyID: string) => {
    const { portfolioId } = this.props

    const type = 'keyCheckboxes'
    const {
      portfolio: { baseCoin },
    } = client.readQuery({
      query: GET_BASE_COIN,
    })
    const { myPortfolios } = client.readQuery({
      query: portfolioKeyAndWalletsQuery,
      variables: { baseCoin },
    })

    const keys = myPortfolios[0].userSettings.keys

    const objForQuery = {
      settings: {
        portfolioId,
        selectedKeys: UTILS.getArrayContainsOnlySelected(keys, toggledKeyID),
      },
    }

    await this.updateSettings(objForQuery, type, toggledKeyID)
  }

  onKeysSelectAll = async () => {
    const { portfolioId, keys } = this.props
    const type = 'keyAll'

    const objForQuery = {
      settings: {
        portfolioId,
        selectedKeys: UTILS.getArrayContainsAllSelected(keys),
      },
    }

    await this.updateSettings(objForQuery, type)
  }

  onKeySelectOnlyOne = async (toggledKeyID: string) => {
    const { portfolioId, isRebalance, updatePortfolioSettings } = this.props
    const type = 'keyOnlyOne'

    const objForQuery = {
      settings: {
        portfolioId,
        [isRebalance ? 'selectedRebalanceKeys' : 'selectedKeys']: [
          toggledKeyID,
        ],
      },
    }

    try {
      await updatePortfolioSettings({
        variables: objForQuery,
      })
    } catch (error) {
      console.log('error', error)
    }
    await this.updateSettings(objForQuery, type, toggledKeyID)
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

  onDustFilterChange = async (value: number, dustFilterParam: string) => {
    const {
      portfolioId,
      dustFilter: { usd, percentage, btc },
      updateDustFilter,
    } = this.props
    const dustFilterParamValue =
      dustFilterParam === 'percentage'
        ? value === 0
          ? 0
          : value === 20
          ? 0.1
          : value === 40
          ? 0.3
          : value === 60
          ? 0.5
          : value === 80
          ? 1
          : 10
        : dustFilterParam === 'btc'
        ? value / BTC_PART_DIVIDER
        : value

    await updateDustFilter({
      variables: {
        settings: {
          ...{ usd, percentage, btc },
          [dustFilterParam]: +dustFilterParamValue,
        },
      },
    })
  }

  render() {
    const {
      isSideNavOpen,
      theme,
      newWallets,
      keys,
      activeKeys,
      activeWallets,
      dustFilter,
      portfolioKeys = {
        myPortfolios: [{ portfolioAssets: {}, name: 'Loading...', _id: 1 }],
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

    if (!portfolioKeys || !portfolioKeys.myPortfolios || !dustFilter) {
      return null
    }

    // TODO: separate dust filter

    const login = true
    const isTransactions =
      this.props.location.pathname === '/portfolio/transactions'

    const isCheckedAll =
      activeKeys.length + activeWallets.length ===
      keys.length + newWallets.length

    const color = theme.palette.secondary.main

    const assets = portfolioKeys.myPortfolios[0]
      ? portfolioKeys.myPortfolios[0].portfolioAssets
      : []

    const activeKeyNames = activeKeys.map((key) => key.name)

    const sumOfEnabledAccounts = assets
      .filter((asset) => activeKeyNames.includes(asset.name))
      .reduce((acc, cur) => acc + cur.price * cur.quantity, 0)

    const filteredData = !isRebalance
      ? combineTableData(
          assets,
          dustFilter,
          isUSDCurrently,
          true,
          sumOfEnabledAccounts
        )
      : assets

    const { totalKeyAssetsData, portfolioAssetsData, portfolioAssetsMap } = getPortfolioAssetsData(
      filteredData,
      isTransactions ? 'USDT' : baseCoin
    )

    const { name, _id } = portfolioKeys.myPortfolios[0]

    const updatePercentageSlider = () =>
      this.onDustFilterChange(valueSliderPercentage, 'percentage')

    const updateUSDSlider = () => this.onDustFilterChange(valueSliderUsd, 'usd')
    const updateBTCSlider = () => this.onDustFilterChange(valueSliderBtc, 'btc')

    const styleForContainer = !isSideNavOpen
      ? {
          transition: '.2s all ease-out',
          transform: 'translateX(-41rem)',
        }
      : { transition: '.375s all ease-out', transform: 'translateX(0)' }

    return (
      <Slide
        style={{
          width: '41rem',
          ...styleForContainer,
        }}
        id="porfolioSelector"
        // in={isSideNavOpen}
        direction="right"
        timeout={{ enter: 375, exit: 250 }}
        mountOnEnter={false}
        unmountOnExit={false}
      >
        {isRebalance && <RebalanceMediaQuery />}
        <AccountsWalletsBlock
          isSideNavOpen={true}
          background={theme.palette.background.paper}
          hoverBackground={theme.palette.action.hover}
          fontFamily={theme.typography.fontFamily}
        >
          <GridSection style={{ height: '18vh' }}>
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
                  baseCoin={baseCoin}
                  id={'renamePortfolio'}
                  isSideNavOpen={isSideNavOpen}
                  isPortfolio={true}
                  needPortalMask={true}
                  needPortalPopup={true}
                  forceUpdateAccountContainer={() => this.forceUpdate()}
                />
              </Grid>

              <AccountsSlick
                totalKeyAssetsData={totalKeyAssetsData}
                currentName={name}
                currentId={_id}
                baseCoin={baseCoin}
              />

              <CreatePortfolio baseCoin={baseCoin} />
            </Grid>
          </GridSection>

          <GridSectionAccounts>
            <Accounts
              {...{
                color,
                login,
                isCheckedAll,
                keys,
                isRebalance,
                isTransactions,
                baseCoin,
                isSideNavOpen,
                portfolioAssetsData,
                portfolioAssetsMap,
                onKeyToggle: this.onKeyToggle,
                onKeySelectOnlyOne: this.onKeySelectOnlyOne,
                onKeysSelectAll: this.onKeysSelectAll,
              }}
              isSidebar={true}
            />
          </GridSectionAccounts>
          {!isRebalance && (
            <GridSectionDust>
              <TypographyTitle style={{ color: '#7284a0' }}>
                Dust Filter
              </TypographyTitle>
              <>
                <SliderContainer>
                  <GridSymbolContainer>%</GridSymbolContainer>
                  <SliderDustFilter
                    step={20}
                    key={'percentage'}
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
                      key={'usd'}
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
                      key={'btc'}
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

const PortfolioSelectorDataWrapper = (props) => {
  
  return (
    <QueryRenderer
      component={PortfolioSelector}
      withOutSpinner={true}
      withTableLoader={true}
      query={getPortfolioAssets}
      variables={{ baseCoin: props.baseCoin, innerSettings: true }}
      pollInterval={30000}
      name={`portfolioKeys`}
      fetchPolicy="cache-and-network"
      {...props}
    />
  )
}

export default compose(
  graphql(updateDustFilter, {
    name: 'updateDustFilter',
  }),
  graphql(updatePortfolioSettingsMutation, {
    name: 'updatePortfolioSettings',
    options: ({ baseCoin }) => ({
      refetchQueries: [
        // {
        //   query: portfolioKeyAndWalletsQuery,
        //   variables: { baseCoin, innerSettings: true },
        // },
        {
          query: getPortfolioAssets,
          variables: { baseCoin, innerSettings: true },
        },
        {
          query: getMyPortfoliosQuery,
          variables: { baseCoin },
        },
      ],
    }),
  })
)(PortfolioSelectorDataWrapper)


