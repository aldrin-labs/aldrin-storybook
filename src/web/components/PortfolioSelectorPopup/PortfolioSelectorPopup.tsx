import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withTheme } from '@material-ui/styles'
import { Icon } from '@sb/styles/cssUtils'

import { RenameKeyDialog } from '@core/components/RenameDialog/RenameKeyDialog'
import { RenamePortfolioDialog } from '@core/components/RenameDialog/RenamePortfolioDialog'

import { DeleteKeyDialog } from '@core/components/DeleteDialog/DeleteKeyDialog'
import { DeletePortfolioDialog } from '@core/components/DeleteDialog/DeletePortfolioDialog'

import {
  PortfolioSelectorPopupWrapper,
  PortfolioSelectorPopupMain,
  PortfolioSelectorPopupMask,
} from './PortfolioSelectorPopup.styles'

@withTheme()
class PortfolioSelectorPopup extends Component {
  state = {
    isPopupOpen: false,
  }

  constructor(props) {
    super(props)

    this.popupRef = React.createRef()
  }

  render() {
    const { isPopupOpen } = this.state
    const {
      theme,
      data,
      dotsColor = '#fff',
      forceUpdateAccountContainer = () => {},
      baseCoin = 'USDT',
      isPortfolio = false,
      isSideNavOpen = true,
      needPortal = false,
      popupStyle = {},
    } = this.props

    return (
      <>
        <PortfolioSelectorPopupWrapper>
          <span onClick={() => this.openPopup()}>
            <Icon
              className="fa fa-ellipsis-h"
              style={{
                fontSize: '1.5rem',
                color: isPortfolio ? dotsColor : theme.palette.text.dark,
              }}
            />
          </span>
          {isPopupOpen && isSideNavOpen ? (
            //ReactDOM.createPortal(
            <PortfolioSelectorPopupMain
              className="popup"
              theme={theme}
              isPopupOpen={isPopupOpen}
              style={popupStyle}
              // ref={this.popupRef}
            >
              {isPortfolio ? (
                <>
                  <RenamePortfolioDialog
                    data={data}
                    isPortfolio={true}
                    baseCoin={baseCoin}
                    forceUpdateUserContainer={forceUpdateAccountContainer}
                    closeMainPopup={this.closePopup}
                  />
                  <DeletePortfolioDialog
                    data={data}
                    baseCoin={baseCoin}
                    isPortfolio={true}
                    disabled={true}
                    forceUpdateUserContainer={forceUpdateAccountContainer}
                    closeMainPopup={this.closePopup}
                  />
                </>
              ) : (
                <>
                  <RenameKeyDialog
                    data={data}
                    baseCoin={baseCoin}
                    forceUpdateUserContainer={forceUpdateAccountContainer}
                    closeMainPopup={this.closePopup}
                  />
                  <DeleteKeyDialog
                    data={data}
                    baseCoin={baseCoin}
                    forceUpdateUserContainer={forceUpdateAccountContainer}
                    closeMainPopup={this.closePopup}
                  />
                </>
              )}
            </PortfolioSelectorPopupMain>
          ) : //document.body

          null}
        </PortfolioSelectorPopupWrapper>
        {/* portal to backdrop */}
        {isPopupOpen && isSideNavOpen ? (
          needPortal ? (
            ReactDOM.createPortal(
              <PortfolioSelectorPopupMask
                visible={isPopupOpen}
                onClick={this.closePopup}
              />,
              document.getElementById('root')
            )
          ) : (
            <PortfolioSelectorPopupMask
              visible={isPopupOpen}
              onClick={this.closePopup}
            />
          )
        ) : null}
      </>
    )
  }

  openPopup = () => {
    this.setState({
      isPopupOpen: true,
    })
  }

  closePopup = () => {
    this.setState({
      isPopupOpen: false,
    })
  }
}

export default PortfolioSelectorPopup
