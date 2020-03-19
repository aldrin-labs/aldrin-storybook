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

const Popup = ({
  theme,
  isPopupOpen,
  popupStyle,
  top,
  left,
  isPortfolio,
  data,
  baseCoin,
  forceUpdateAccountContainer,
  closePopup,
}) => {
  return (
    <PortfolioSelectorPopupMain
      className="popup"
      theme={theme}
      isPopupOpen={isPopupOpen}
      style={popupStyle}
      top={top}
      left={left}
      // ref={this.popupRef}
    >
      {isPortfolio ? (
        <>
          <RenamePortfolioDialog
            data={data}
            isPortfolio={true}
            baseCoin={baseCoin}
            forceUpdateUserContainer={forceUpdateAccountContainer}
            closeMainPopup={closePopup}
          />
          <DeletePortfolioDialog
            data={data}
            baseCoin={baseCoin}
            isPortfolio={true}
            disabled={true}
            forceUpdateUserContainer={forceUpdateAccountContainer}
            closeMainPopup={closePopup}
          />
        </>
      ) : (
        <>
          <RenameKeyDialog
            data={data}
            baseCoin={baseCoin}
            forceUpdateUserContainer={forceUpdateAccountContainer}
            closeMainPopup={closePopup}
          />
          <DeleteKeyDialog
            data={data}
            baseCoin={baseCoin}
            forceUpdateUserContainer={forceUpdateAccountContainer}
            closeMainPopup={closePopup}
          />
        </>
      )}
    </PortfolioSelectorPopupMain>
  )
}

@withTheme()
class PortfolioSelectorPopup extends Component {
  state = {
    top: 0,
    left: 0,
    isPopupOpen: false,
  }

  constructor(props) {
    super(props)

    this.popupRef = React.createRef()
  }

  openPopup = () => {
    if (this.props.needPortalPopup) {
      const buttonElem = document.getElementById(this.props.id)
      const position = buttonElem.getBoundingClientRect()

      this.setState({
        top: Math.floor(position.top),
        left: Math.floor(position.left),
      })
    }

    this.setState({ isPopupOpen: true })
  }

  closePopup = () => {
    this.setState({
      isPopupOpen: false,
    })
  }

  render() {
    const { isPopupOpen, top, left } = this.state
    const {
      theme,
      data,
      id,
      dotsColor = '#fff',
      forceUpdateAccountContainer = () => {},
      baseCoin = 'USDT',
      isPortfolio = false,
      isSideNavOpen = true,
      needPortalPopup = false,
      needPortalMask = false,
      popupStyle = {},
    } = this.props

    return (
      <>
        <PortfolioSelectorPopupWrapper id={id}>
          <span onClick={(e) => this.openPopup(e)}>
            <Icon
              className="fa fa-ellipsis-h"
              style={{
                fontSize: '1.5rem',
                color: isPortfolio ? dotsColor : theme.palette.text.dark,
              }}
            />
          </span>
          {isPopupOpen && isSideNavOpen ? (
            needPortalPopup ? (
              ReactDOM.createPortal(
                <Popup
                  {...{
                    theme,
                    data,
                    baseCoin,
                    forceUpdateAccountContainer,
                    isPopupOpen,
                    isPortfolio,
                    left,
                    popupStyle,
                    top,
                    closePopup: this.closePopup,
                  }}
                />,
                document.body
              )
            ) : (
              <Popup
                {...{
                  theme,
                  data,
                  baseCoin,
                  forceUpdateAccountContainer,
                  isPopupOpen,
                  isPortfolio,
                  left,
                  popupStyle,
                  top,
                  closePopup: this.closePopup,
                }}
              />
            )
          ) : null}
        </PortfolioSelectorPopupWrapper>
        {/* portal to backdrop */}
        {isPopupOpen && isSideNavOpen ? (
          needPortalMask ? (
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
}

export default PortfolioSelectorPopup
