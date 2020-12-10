import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/styles'
import LazyLoad from 'react-lazyload'

import copy from 'clipboard-copy'
import SvgIcon from '@sb/components/SvgIcon'

import {
  importCoinIcon,
  onErrorImportCoinUrl,
} from '@core/utils/MarketCapUtils'

import { AddBtn } from '@sb/compositions/Addressbook/index'

import {
  Card,
  HeaderCell,
  Cell,
  TableRow,
  Table,
} from '@sb/compositions/Rewards/index'
import { notify } from '@sb/dexUtils/notifications'
import { decrypt } from './index'

const SubColumn = ({
  theme,
  coins,
  contactHash,
  setContactHash,
  setShowNewCoinPopup,
  localPassword
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
          background: '#303743',
        }}
      >
        <TableRow>
          <HeaderCell style={{ paddingLeft: '2rem' }} borderBottom={'#424B68'}>
            Coin
          </HeaderCell>
          <HeaderCell style={{ textAlign: 'left' }} borderBottom={'#424B68'}>
            Address
          </HeaderCell>
          <HeaderCell style={{ textAlign: 'right' }} borderBottom={'#424B68'}>
            <AddBtn
              style={{ fontFamily: 'Avenir Next Demi' }}
              onClick={() => {
                setContactHash(contactHash)
                setShowNewCoinPopup(true)
              }}
            >
              + add new address
            </AddBtn>
          </HeaderCell>
        </TableRow>
        {coins.map((el) => {
          return (
            <TableRow>
              <Cell
                style={{ paddingLeft: '2rem', fontSize: '2rem' }}
                borderBottom={'#424B68'}
              >
                <LazyLoad once height={`1.7rem`}>
                  <SvgIcon
                    style={{
                      marginRight: '1rem',
                      position: 'relative',
                      top: '0.275rem',
                    }}
                    width={`1.7rem`}
                    height={`1.7rem`}
                    src={importCoinIcon(decrypt(el.symbol, localPassword))}
                    onError={onErrorImportCoinUrl}
                  />
                </LazyLoad>
                {el.symbol === 'SOL' ? 'SOL' : decrypt(el.symbol, localPassword)}
              </Cell>
              <Cell
                style={{ textAlign: 'left', fontSize: '2rem' }}
                borderBottom={'#424B68'}
              >
                {decrypt(el.address, localPassword)}
                <AddBtn
                  background={'#7380EB'}
                  width={'auto'}
                  padding={'0 1rem'}
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
              </Cell>
              <Cell style={{ textAlign: 'right' }} borderBottom={'#424B68'}>
                <AddBtn
                  background={'#7380EB'}
                  width={'auto'}
                  padding={'0 2rem'}
                >
                  <a
                    href={'https://www.sollet.io/'}
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
            </TableRow>
          )
        })}
      </Table>
    </Card>
  )
}

export default compose(withTheme())(SubColumn)
