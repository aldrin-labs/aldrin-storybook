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
  ReactSelectCustom,
  GridSectionDust,
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

import Slider from '@sb/components/Slider/Slider'

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
    })
  }

  handleChange = (event, value) => {
    this.setState({ valueSliderPercentage: value })
    this.setState({
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

  updateSettings = async (objectForMutation) => {
    const { updatePortfolioSettings } = this.props

    try {
      await updatePortfolioSettings({
        variables: objectForMutation,
      })
    } catch (error) {
      console.log(error)
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

  onDustFilterChange = (
    value: number,
    dustFilterParam: string
  ) => {
    const { portfolioId, dustFilter } = this.props
    const { usd, percentage } = dustFilter
    this.updateSettings({
      settings: {
        portfolioId,
        dustFilter: {
          ...{ usd, percentage },
          [dustFilterParam]:
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
        style={{ width: '410px' }}
        in={isSideNavOpen}
        direction="right"
        mountOnEnter={true}
        unmountOnExit={true}
      >
        {/* Portfolio Section */}

        <AccountsWalletsBlock
          isSideNavOpen={true}
          background={theme.palette.background.paper}
          hoverBackground={theme.palette.action.hover}
          fontFamily={theme.typography.fontFamily}
        >
          {/* <GridSection>
            <TypographyTitle>Portfolio</TypographyTitle>
            <CreatePortfolio />
          </GridSection>
          <GridSection>
            <TypographyTitle>Accounts</TypographyTitle>
            <GridRow
              container
              lg={12}
            >
              <GridCell item lg={10}>
                <TypographyTitle
                  lineHeight={'20px'}
                  fontSize={'0.94rem'}
                  textColor={'#7284A0'}
                >
                  Binance Trade Account
                </TypographyTitle>
                <TypographyTitle>$500,000.00</TypographyTitle>
              </GridCell>
              <GridCell item lg={1} justify="right">
                <Radio />
              </GridCell>
              <GridCell item lg={1} justify="right">
                ...
              </GridCell>
            </GridRow>
            <AddAccountDialog />
          </GridSection>
          <GridSection>
            <TypographyTitle>Dust Filter</TypographyTitle>

            <SliderContainer>
              <Grid>%</Grid>
              <Slider
                thumbWidth="25px"
                thumbHeight="25px"
                sliderWidth="290px"
                sliderHeight="17px"
                sliderHeightAfter="20px"
                borderRadius="30px"
                borderRadiusAfter="30px"
                thumbBackground="blue"
                borderThumb="2px solid white"
                trackAfterBackground="#E7ECF3"
                trackBeforeBackground={'blue'}
                value={'25'}
                //onChange={handleSlideChange}
                style={{ margin: 'auto 0' }}
                disabled
              />
              <Grid>{'< 0.4%'}</Grid>
            </SliderContainer>

          </GridSection> */}

          <GridSection>
            <TypographyTitle>Portfolio</TypographyTitle>
            <ReactSelectCustom
              //value={'55'}
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
                color: '#165BE0',
                fontSize: '11px',
                padding: '0',
              }}
              indicatorSeparatorStyles={{}}
              controlStyles={{
                background: 'transparent',
                border: 'none',
                width: 200,
              }}
              menuStyles={{
                width: 235,
                padding: '5px 8px',
                borderRadius: '14px',
                textAlign: 'center',
              }}
              optionStyles={{
                color: '#7284A0',
                background: 'transparent',
                textAlign: 'center',
                fontSize: '0.62rem',
                '&:hover': {
                  borderRadius: '14px',
                  color: '#16253D',
                  background: '#E7ECF3',
                },
              }}
            />
            <CreatePortfolio />
            {/*
            <BtnCustom
              btnWidth={'160px'}
              height={'24px'}
              btnColor={'#165BE0'}
              borderRadius={'10px'}
              color={'#165BE0'}
              margin={'8px'}
              padding={'0px'}
              fontSize={'0.65rem'}
            >
              + create portfolio
            </BtnCustom> */}
            {/* <CreatePortfolio /> */}
          </GridSection>

          <GridSection>
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
            />
            {/* //TODO: delete this
          <Wallets
            {...{
              color,
              login,
              isSideNavOpen,
              newWallets,
              onWalletToggle: this.onWalletToggle,
            }}
          />
          TODO: delete this
          {!login && (
            <Typography
              style={{
                textAlign: 'center',
              }}
            >
              Login to add <br /> or edit accounts
            </Typography>
          )} */}

            {!isRebalance && (
              <>
                <Name color={color}>Dust</Name>
                <FilterContainer>
                  <FilterValues>
                    <FilterIcon
                      color={theme.palette.getContrastText(
                        theme.palette.background.paper
                      )}
                    />
                    <Dropdown
                      style={{ width: '100%' }}
                      value={dustFilter.percentage}
                      handleChange={(e) =>
                        this.onDustFilterChange(e, 'percentage')
                      }
                      name="filterValuesInMain"
                      options={percentageDustFilterOptions}
                    />
                  </FilterValues>
                  <FilterValues>
                    <FilterIcon
                      color={theme.palette.getContrastText(
                        theme.palette.background.paper
                      )}
                    />
                    <Dropdown
                      style={{ width: '100%' }}
                      value={dustFilter.usd}
                      handleChange={(e) => this.onDustFilterChange(e, 'usd')}
                      name="filterValuesInMain"
                      options={usdDustFilterOptions}
                    />
                  </FilterValues>
                </FilterContainer>
              </>
            )}
          </GridSection>
          <GridSectionDust>
            <TypographyTitle>Dust Filter</TypographyTitle>

            <SliderContainer>
              <Grid>%</Grid>
              <Slider
                step={20}
                thumbWidth="25px"
                thumbHeight="25px"
                sliderWidth="250px"
                sliderHeight="17px"
                sliderHeightAfter="20px"
                borderRadius="30px"
                borderRadiusAfter="30px"
                thumbBackground="blue"
                borderThumb="2px solid white"
                trackAfterBackground="#E7ECF3"
                trackBeforeBackground={'blue'}
                // value={dustFilter.percentage}
                value={this.state.valueSliderPercentage}
                //onChange={handleSlideChange}
                onChange={this.handleChange} //TODO onDragEnd
                //handleChange={(e) => this.onDustFilterChange(e, 'percentage')}
                style={{ margin: 'auto 0' }}
                //disabled
              />
              <Grid>
                {this.state.valueSliderPercentageContainer === 0 ||
                this.state.valueSliderPercentageContainer === null
                  ? `No % Filter`
                  : `< ${this.state.valueSliderPercentageContainer} %`}
              </Grid>
            </SliderContainer>

            <SliderContainer>
              <Grid>$</Grid>
              <Slider
                thumbWidth="25px"
                thumbHeight="25px"
                sliderWidth="250px"
                sliderHeight="17px"
                sliderHeightAfter="20px"
                borderRadius="30px"
                borderRadiusAfter="30px"
                thumbBackground="blue"
                borderThumb="2px solid white"
                trackAfterBackground="#E7ECF3"
                trackBeforeBackground={'blue'}
                value={dustFilter.usd}
                //onChange={handleSlideChange}
                handleChange={(e) => this.onDustFilterChange(e, 'usd')}
                style={{ margin: 'auto 0' }}
                //disabled
              />
              <Grid>{`< ${dustFilter.usd} $`}</Grid>
            </SliderContainer>
          </GridSectionDust>
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

/*


export default withTheme()(PortfolioSelector)
*/

/*

.react-calendar-heatmap .color-scale-1 { fill: #E0E5EC; }
.react-calendar-heatmap .color-scale-2 { fill: #B3C8EE; }
.react-calendar-heatmap .color-scale-3 { fill: #7EA3EA; }
.react-calendar-heatmap .color-scale-4 { fill: #165BE0; }

*/
