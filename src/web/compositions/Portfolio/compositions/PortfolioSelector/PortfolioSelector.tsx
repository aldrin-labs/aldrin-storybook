import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'

import { withTheme } from '@material-ui/styles'
import AddIcon from '@material-ui/icons/Add'
import { Slide, Typography, Button } from '@material-ui/core'

import Dropdown from '@sb/components/SimpleDropDownSelector'
import Accounts from '@sb/components/Accounts/Accounts'
import Wallets from '@sb/components/Wallets/Wallets'
import {
  AccountsWalletsBlock,
  FilterIcon,
  FilterValues,
  Name,
  AddAccountBlock,
  FilterContainer,
} from './PortfolioSelector.styles'
import * as UTILS from '@core/utils/PortfolioSelectorUtils'
import { MASTER_BUILD } from '@core/utils/config'
import { IProps } from './PortfolioSelector.types'
import {
  percentageDustFilterOptions,
  usdDustFilterOptions,
} from './PortfolioSelector.options'

const MyLinkToUserSettings = (props: any) => (
  <Link to="/user" style={{ textDecoration: 'none' }} {...props}>
    {props.children}{' '}
  </Link>
)

@withRouter
class PortfolioSelector extends React.Component<IProps> {
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
    {
      target: { value },
    }: {
      target: { value: number }
    },
    dustFilterParam: string
  ) => {
    const { portfolioId, dustFilter } = this.props
    const { usd, percentage } = dustFilter
    this.updateSettings({
      settings: {
        portfolioId,
        dustFilter: { ...{ usd, percentage }, [dustFilterParam]: value },
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
    } = this.props

    const isRebalance = pathname === '/portfolio/rebalance'

    const login = true

    const isCheckedAll =
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length

    const color = theme.palette.secondary.main

    return (
      <Slide
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

          <Wallets
            {...{
              color,
              login,
              isSideNavOpen,
              newWallets,
              onWalletToggle: this.onWalletToggle,
            }}
          />
          {!login && (
            <Typography
              style={{
                textAlign: 'center',
              }}
            >
              Login to add <br /> or edit accounts
            </Typography>
          )}
          <AddAccountBlock>
            <MyLinkToUserSettings>
              <Button
                size="small"
                style={{
                  height: 36,
                }}
                variant="extendedFab"
                color="secondary"
              >
                <AddIcon fontSize={`small`} />
                Add account
              </Button>
            </MyLinkToUserSettings>
          </AddAccountBlock>
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
        </AccountsWalletsBlock>
      </Slide>
    )
  }
}

export default withTheme()(PortfolioSelector)
