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
                    <PortfolioSelectorPopupMain visible={this.state.isPopupOpen} theme={theme}>
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
        this.setState({
            isPopupOpen: true
        })
    }
    closePopup() {
        this.setState({
            isPopupOpen: false
        })
    }
}

export default PortfolioSelectorPopup
