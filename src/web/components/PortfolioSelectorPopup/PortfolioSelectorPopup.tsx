import React, { Component } from 'react'
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
      allKeys,
      allPortfolios = [],
      forceUpdateAccountContainer,
      baseCoin,
      isPortfolio = false,
    } = this.props

    return (
      <>
        <PortfolioSelectorPopupWrapper>
          <span onClick={() => this.openPopup()}>
            <Icon
              className="fa fa-ellipsis-h"
              style={{
                fontSize: '1.5rem',
                color: isPortfolio ? '#fff' : theme.palette.text.dark,
              }}
            />
          </span>
          <PortfolioSelectorPopupMain
            className="popup"
            theme={theme}
            ref={this.popupRef}
          >
            {isPortfolio ? (
              <>
                <RenamePortfolioDialog
                  data={data}
                  allKeys={allPortfolios}
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
                  allKeys={allKeys}
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
        </PortfolioSelectorPopupWrapper>
        <PortfolioSelectorPopupMask
          visible={isPopupOpen}
          onClick={this.closePopup}
        />
      </>
    )
  }

  openPopup = () => {
    const popups = Array.from(document.getElementsByClassName('popup'))

    popups.forEach((popup) => {
      popup.classList.remove('popup-visible')
    })

    this.popupRef.current.classList.add('popup-visible')
    this.setState({
      isPopupOpen: true,
    })
  }

  closePopup = () => {
    this.popupRef.current.classList.remove('popup-visible')
    this.setState({
      isPopupOpen: false,
    })
  }
}

export default PortfolioSelectorPopup
