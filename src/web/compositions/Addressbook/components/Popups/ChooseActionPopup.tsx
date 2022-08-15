import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import {
  PortfolioSelectorPopupWrapper,
  PortfolioSelectorPopupMain,
  PortfolioSelectorPopupMask,
} from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup.styles'

import { OpenDeleteButton } from '@sb/components/DeleteKeyDialog/DeleteKeyDialog.styles'
import { OpenRenameButton } from '@sb/components/RenameKeyDialog/RenameKeyDialog.styles'

import EditContactPopup from './EditContactPopup'
import EditContactCoinPopup from './EditContactCoinPopup'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

const Popup = ({
  theme,
  isPopupOpen,
  popupStyle,
  top,
  left,
  isContact,
  data,
  closePopup,
  localPassword,
  getUserAddressbookQueryRefetch,
  publicKey,
  contactPublicKey
}) => {
  const [showEditPopup, changeShowEditPopup] = useState(false)
  const [showDeletePopup, changeShowDeletePopup] = useState(false)

  return (
    <PortfolioSelectorPopupMain
      className="popup"
      theme={theme}
      isPopupOpen={isPopupOpen}
      style={popupStyle}
      top={top}
      left={left}
    >
      <>
        <OpenRenameButton
          theme={theme}
          onClick={() => changeShowEditPopup(true)}
        >
          Edit
        </OpenRenameButton>
        <OpenDeleteButton
          theme={theme}
          onClick={() => changeShowDeletePopup(true)}
        >
          Delete
        </OpenDeleteButton>

        {showEditPopup && isContact && (
          <EditContactPopup
            open={showEditPopup && isContact}
            data={data}
            theme={theme}
            localPassword={localPassword}
            publicKey={publicKey}
            contactPublicKey={contactPublicKey}
            getUserAddressbookQueryRefetch={getUserAddressbookQueryRefetch}
            handleClose={() => {
              changeShowEditPopup(false)
              closePopup()
            }}
          />
        )}

        {showEditPopup && !isContact && (
          <EditContactCoinPopup
            open={showEditPopup && !isContact}
            data={data}
            theme={theme}
            localPassword={localPassword}
            publicKey={publicKey}
            contactPublicKey={contactPublicKey}
            getUserAddressbookQueryRefetch={getUserAddressbookQueryRefetch}
            handleClose={() => {
              changeShowEditPopup(false)
              closePopup()
            }}
          />
        )}

        <ConfirmDeleteDialog
          open={showDeletePopup}
          title={isContact ? 'Delete contact' : 'Delete coin'}
          data={data}
          theme={theme}
          localPassword={localPassword}
          publicKey={publicKey}
          contactPublicKey={contactPublicKey}
          getUserAddressbookQueryRefetch={getUserAddressbookQueryRefetch}
          isContact={isContact}
          handleClose={() => {
            changeShowDeletePopup(false)
            closePopup()
          }}
        />
      </>
    </PortfolioSelectorPopupMain>
  )
}

const ChooseActionPopup = ({
  theme,
  data,
  id,
  baseCoin = 'USDT',
  isContact = false,
  isSideNavOpen = true,
  needPortalPopup = false,
  needPortalMask = false,
  popupStyle = {},
  isPopupOpen = false,
  closePopup,
  top,
  left,
  publicKey,
  localPassword,
  contactPublicKey,
  getUserAddressbookQueryRefetch
}) => {
  return (
    <>
      <PortfolioSelectorPopupWrapper id={id}>
        {isPopupOpen && isSideNavOpen && (
          needPortalPopup ? (
            ReactDOM.createPortal(
              <Popup
                {...{
                  theme,
                  data,
                  baseCoin,
                  isPopupOpen,
                  isContact,
                  left,
                  popupStyle,
                  top,
                  publicKey,
                  closePopup,
                  localPassword,
                  contactPublicKey,
                  getUserAddressbookQueryRefetch
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
                isPopupOpen,
                isContact,
                left,
                popupStyle,
                top,
                publicKey,
                closePopup,
                localPassword,
                contactPublicKey,
                getUserAddressbookQueryRefetch
              }}
            />
          )
        )}
      </PortfolioSelectorPopupWrapper>
      {/* portal to backdrop */}
      {isPopupOpen && (
        needPortalMask ? (
          ReactDOM.createPortal(
            <PortfolioSelectorPopupMask
              visible={isPopupOpen}
              onClick={closePopup}
            />,
            document.getElementById('root')
          )
        ) : (
          <PortfolioSelectorPopupMask
            visible={isPopupOpen}
            onClick={closePopup}
          />
        )
      )}
    </>
  )
}

export default ChooseActionPopup
