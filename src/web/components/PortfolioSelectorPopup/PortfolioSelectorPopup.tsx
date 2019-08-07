import React, { Component } from 'react'
import { withTheme } from '@material-ui/styles'
import { Icon } from '@sb/styles/cssUtils'

import { DeleteKeyDialog } from '@sb/components/DeleteKeyDialog/DeleteKeyDialog'
import {
    PortfolioSelectorPopupWrapper,
    PortfolioSelectorPopupMain,
    PortfolioSelectorPopupMask
} from './PortfolioSelectorPopup.styles'

@withTheme()
class PortfolioSelectorPopup extends Component {
    state = {
        isPopupOpen: false
    }

    constructor(props) {
        super(props)

        this.popupRef = React.createRef()
    }

    render() {
        const {
            theme,
            accountName,
            forceUpdateAccountContainer
        } = this.props

        return (
            <>
                <PortfolioSelectorPopupWrapper>
                    <span onClick={() => this.openPopup()}>
                        <Icon className="fa fa-ellipsis-h" style={{
                            fontSize: '1.5rem',
                            color: theme.palette.text.dark
                        }}/>
                    </span>
                    <PortfolioSelectorPopupMain className="popup" theme={theme} ref={this.popupRef}>
                        <div className="renameAccount-toggler">Rename</div>
                        <DeleteKeyDialog
                            keyName={accountName}
                            forceUpdateUserContainer={forceUpdateAccountContainer}
                            customHandler={handleClick =>
                                <span className="deleteAccountDialog-toggler" onClick={handleClick}>Delete</span>
                            }
                        />
                    </PortfolioSelectorPopupMain>
                </PortfolioSelectorPopupWrapper>
                <PortfolioSelectorPopupMask
                    visible={this.state.isPopupOpen}
                    onClick={() => this.closePopup()}
                />
            </>
        )
    }

    openPopup() {
        const popups = Array.from(document.getElementsByClassName('popup'))
        popups.forEach(popup => {
            popup.classList.remove('popup-visible')
        })

        this.popupRef.current.classList.add('popup-visible')
        this.setState({
            isPopupOpen: true
        })
    }
    closePopup() {
        this.popupRef.current.classList.remove('popup-visible')
        this.setState({
            isPopupOpen: false
        })
    }
}

export default PortfolioSelectorPopup
