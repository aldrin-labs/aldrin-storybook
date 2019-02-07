import * as React from 'react'
import { Link } from 'react-router-dom'

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
} from './PortfolioSelector.styles'
import * as UTILS from '@core/utils/PortfolioSelectorUtils'
import { MASTER_BUILD } from '@core/utils/config'
import { IProps } from './PortfolioSelector.types'


const MyLinkToUserSettings = (props: any) => <Link to="/user" style={{ textDecoration: 'none' }} {...props}>{props.children} </Link>

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

  onKeyToggle = (toggledKeyID: string) => {
    const { portfolioId, newKeys } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        selectedKeys: UTILS.getArrayContainsOnlySelected(newKeys, toggledKeyID),
      },
    }

    this.updateSettings(objForQuery)
  }

  onWalletToggle = (toggledWalletID: string) => {
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

    this.updateSettings(objForQuery)
  }

  onToggleAll = () => {
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

    this.updateSettings(objForQuery)
  }

  onDustFilterChange = ({
    target: { value },
  }: {
    target: { value: number }
  }) => {
    const { portfolioId } = this.props
    this.updateSettings({
      settings: {
        portfolioId,
        dustFilter: value,
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
    } = this.props
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
              onToggleAll: this.onToggleAll,
              onKeyToggle: this.onKeyToggle,
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
              <AddIcon fontSize={`small`}/>
              Add account
            </Button>
            </MyLinkToUserSettings>
          </AddAccountBlock>
            {!MASTER_BUILD && (
            <>
              <Name color={color}>Dust</Name>
              <FilterValues>
                <FilterIcon
                  color={theme.palette.getContrastText(
                    theme.palette.background.paper
                  )}
                />
                <Dropdown
                  style={{ width: '100%' }}
                  value={dustFilter}
                  handleChange={this.onDustFilterChange}
                  name="filterValuesInMain"
                  options={[
                    { value: -100.0, label: 'No Filter' },
                    { value: 0, label: '0% <' },
                    { value: 0.1, label: '0.1% <' },
                    { value: 0.2, label: '0.2% <' },
                    { value: 0.3, label: '0.3% <' },
                    { value: 0.5, label: '0.5% <' },
                    { value: 1, label: '1% <' },
                    { value: 10, label: '10% <' },
                  ]}
                />
              </FilterValues>
            </>
          )}
        </AccountsWalletsBlock>
      </Slide>
    )
  }
}


export default withTheme()(PortfolioSelector)
