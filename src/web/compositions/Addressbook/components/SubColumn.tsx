import React from 'react'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/styles'
import LazyLoad from 'react-lazyload'
import { Icon } from '@sb/styles/cssUtils'

import copy from 'clipboard-copy'
import SvgIcon from '@sb/components/SvgIcon'

import {
  importCoinIcon,
  onErrorImportCoinUrl,
} from '@core/utils/MarketCapUtils'

import { AddBtn, decrypt } from '@sb/compositions/Addressbook/index'

import {
  Card,
  HeaderCell,
  Cell,
  TableRow,
  Table,
} from '@sb/compositions/Rewards/index'
import { notify } from '@sb/dexUtils/notifications'
import { CCAIProviderURL } from '@sb/dexUtils/utils'

const SubColumn = ({
  theme,
  coins,
  contactPublicKey,
  setContactPublicKey,
  setShowNewCoinPopup,
  localPassword,
  changeUpdatePopupData,
}) => {
  return (
    <Card
      style={{
        width: '100%',
        height: 'auto',
        border: '0',
        borderRadius: '0.8rem',
      }}
      theme={theme}
    >
      <Table
        style={{
          width: '100%',
          height: 'auto',
          border: '0',
          borderRadius: '0.8rem',
          background: theme.palette.grey.input,
        }}
      >
        <TableRow>
          <HeaderCell
            theme={theme}
            style={{ paddingLeft: '2rem' }}
            borderBottom={theme.palette.text.white}
          >
            Coin
          </HeaderCell>
          <HeaderCell
            theme={theme}
            style={{ textAlign: 'left' }}
            borderBottom={theme.palette.text.white}
          >
            Address
          </HeaderCell>
          <HeaderCell
            theme={theme}
            style={{ textAlign: 'right' }}
            borderBottom={theme.palette.text.white}
          >
            <AddBtn
              style={{ fontFamily: 'Avenir Next Demi', marginRight: '2rem' }}
              onClick={() => {
                setContactPublicKey(contactPublicKey)
                setShowNewCoinPopup(true)
              }}
            >
              + add new address
            </AddBtn>
          </HeaderCell>
        </TableRow>
        {coins.map((el) => {
          return (
            <TableRow key={`${el.address}${el.symbol}`}>
              <Cell
                theme={theme}
                style={{ paddingLeft: '2rem', fontSize: '2rem' }}
                borderBottom={theme.palette.text.white}
              >
                <LazyLoad once height="1.7rem">
                  <SvgIcon
                    style={{
                      marginRight: '1rem',
                      position: 'relative',
                      top: '0.275rem',
                    }}
                    width="1.7rem"
                    height="1.7rem"
                    src={importCoinIcon(decrypt(el.symbol, localPassword))}
                    onError={onErrorImportCoinUrl}
                  />
                </LazyLoad>
                {el.symbol === 'SOL'
                  ? 'SOL'
                  : decrypt(el.symbol, localPassword)}
              </Cell>
              <Cell
                theme={theme}
                style={{ textAlign: 'left', fontSize: '2rem' }}
                borderBottom={theme.palette.text.white}
              >
                {decrypt(el.address, localPassword)}
                <AddBtn
                  background={theme.palette.blue.serum}
                  width="auto"
                  padding="0 1rem"
                  style={{ marginLeft: '2rem' }}
                  onClick={() => {
                    copy(decrypt(el.address, localPassword))
                    notify({
                      type: 'success',
                      message: 'Copied!',
                    })
                  }}
                >
                  copy
                </AddBtn>
                <AddBtn
                  background={theme.palette.blue.serum}
                  width="auto"
                  padding="0 2rem"
                >
                  <a
                    href={CCAIProviderURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: 'none',
                      color: 'fff',
                      fontFamily: 'Avenir Next Demi',
                      fontSize: '1.5rem',
                      color: '#fff',
                      outline: 'none',
                      textTransform: 'uppercase',
                    }}
                  >
                    send
                  </a>
                </AddBtn>
              </Cell>
              <Cell
                theme={theme}
                style={{ textAlign: 'right' }}
                borderBottom={theme.palette.text.white}
              >
                <span
                  style={{ paddingRight: '3rem', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation()

                    const buttonElem = document.getElementById(
                      `${el.address}${el.symbol}popup`
                    )
                    const position = buttonElem.getBoundingClientRect()

                    changeUpdatePopupData({
                      isPopupOpen: true,
                      isUpdateContact: false,
                      top: Math.floor(position.top),
                      left: Math.floor(position.left),
                      data: el,
                    })

                    setContactPublicKey(contactPublicKey)
                  }}
                >
                  <Icon
                    id={`${el.address}${el.symbol}popup`}
                    className="fa fa-ellipsis-h"
                    style={{
                      fontSize: '1.5rem',
                      color: theme.palette.text.dark,
                    }}
                  />
                </span>
              </Cell>
            </TableRow>
          )
        })}
      </Table>
    </Card>
  )
}

export default compose(withTheme())(SubColumn)
