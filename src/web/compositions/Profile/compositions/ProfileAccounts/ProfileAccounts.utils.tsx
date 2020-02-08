import React from 'react'
import moment from 'moment'

import { TooltipCustom } from '@sb/components/index'
import ReimportKey from '@core/components/ReimportKey/ReimportKey'
import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import {
  PortfolioData,
  AccountData,
} from '@core/containers/Profile/ProfileAccounts/ProfileAccounts.types'

import { addMainSymbol } from '@sb/components'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import {
  AddAccountButton,
  Typography,
  SmallAddIcon,
} from './ProfileAccounts.styles'
import { Button } from '@material-ui/core'

export const accountsColors = [
  '#9A77F7',
  '#F29C38',
  '#4152AF',
  '#DEDB8E',
  '#ED6337',
  '#ABBAD1',
]

const typographyStyle = {
  fontFamily: 'DM Sans',
  textTransform: 'uppercase',
}

export const headingStyle = {
  ...typographyStyle,
  color: '#7284A0',
  fontSize: '1.2rem',
  fontWeight: 500,
  letterSpacing: '0.1rem',
  paddingTop: '1.2rem',
  paddingBottom: '1.2rem',
  borderBottom: '.1rem solid #e0e5ec',
}

export const cellStyle = {
  ...typographyStyle,
  color: '#7284A0',
  fontSize: '1.4rem',
  borderBottom: '.1rem solid #e0e5ec',
  paddingTop: '.4rem',
  paddingBottom: '.4rem',
}

const colorfulStyle = {
  fontWeight: 'bold',
  letterSpacing: '.5px',
}

const greenStyle = {
  ...colorfulStyle,
  color: '#29AC80',
}

const redStyle = {
  ...colorfulStyle,
  color: '#DD6956',
}

const getKeyStatus = (status: string, valid: boolean) => {
  if (!valid) return 'invalid'
  return status.includes('initialized')
    ? 'initialized'
    : status.includes('%')
    ? 'initializing'
    : status
}

export const transformData = (
  data: AccountData[],
  numberOfKeys: number,
  telegramUsernameConnected: boolean
) => {
  const transformedData = data.map((row, i) => {
    return {
      id: row._id,
      colorDot: {
        render: (
          <div
            key={row._id}
            style={{
              position: 'relative',
              left: '50%',
              backgroundColor:
                accountsColors[
                  i > accountsColors.length - 1 ? accountsColors.length - 1 : i
                ],
              borderRadius: '50%',
              width: '.8rem',
              height: '.8rem',
            }}
          />
        ),
      },
      exchange: {
        render: row.exchange,
        // isNumber: true,
      },
      name: row.name,
      value: {
        render: row.value || '-',
        style: { textAlign: 'center' },
      },
      // amount: {
      //   contentToSort: row.amount,
      //   contentToCSV: roundAndFormatNumber(row.amount, 2, true),
      //   render: addMainSymbol(roundAndFormatNumber(row.amount, 2, true), true),
      // },
      added: {
        render: (
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: '.2rem',
                fontSize: '1.3rem',
              }}
            >
              {String(
                moment.unix(row.date / 1000).format('MMM, DD, YYYY')
              ).replace(/-/g, '.')}
            </span>
            <span style={{ color: '#ABBAD1' }}>
              {moment.unix(row.date / 1000).format('LT')}
            </span>
          </div>
        ),
        contentToSort: row.date,
        // isNumber: true,
      },
      lastUpdate: {
        render: (
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: '.2rem',
                fontSize: '1.3rem',
              }}
            >
              {String(
                moment.unix(row.lastUpdate).format('MMM, DD, YYYY')
              ).replace(/-/g, '.')}
            </span>
            <span style={{ color: '#ABBAD1' }}>
              {moment.unix(row.lastUpdate).format('LT')}
            </span>
          </div>
        ),
        contentToSort: row.lastUpdate,
        // isNumber: true,
      },
      status: {
        render: (
          <span style={row.valid ? { ...greenStyle } : { ...redStyle }}>
            {getKeyStatus(row.status, row.valid)}
          </span>
        ),
      },
      autoRebalance: {
        render: (
          <span style={{ color: '#DD6956', fontWeight: 'bold' }}>disabled</span>
        ),
      },
      edit: {
        render: (
          <PortfolioSelectorPopup
            popupStyle={{ transform: 'translateX(-95%)' }}
            needPortalMask={true}
            dotsColor={'#7284A0'}
            data={row}
          />
        ),
      },
      refresh: {
        render: <ReimportKey keyId={row._id} />,
      },
    }
  })

  transformedData.push({
    id: 'addKeyButton',
    colorDot: ' ',
    exchange: ' ',
    name: ' ',
    value: ' ',
    added: ' ',
    lastUpdate: {
      render: (
        <TooltipCustom
          title={`First, attach your telegram account via telegram tab on the left menu`}
          enterDelay={250}
          leaveDelay={200}
          component={
            <div>
              <Button
                disabled={!telegramUsernameConnected}
                style={{
                  width: '100%',
                  color: telegramUsernameConnected ? '#0B1FD1' : '#7284A0',
                  fontWeight: 'bold',
                  fontFamily: 'DM Sans',
                  border: telegramUsernameConnected
                    ? '.1rem solid #0B1FD1'
                    : '.1rem solid #7284A0',
                  borderRadius: '1.6rem',
                }}
              >
                join futures wars
              </Button>
            </div>
          }
        />
      ),
      colspan: 2,
    },
    autoRebalance: {
      render: (
        <AddAccountDialog
          numberOfKeys={numberOfKeys}
          existCustomButton={true}
          CustomButton={({ handleClick }: { handleClick: () => void }) => (
            <AddAccountButton onClick={handleClick}>
              <SmallAddIcon />
              <Typography>add new key</Typography>
            </AddAccountButton>
          )}
        />
      ),
    },
    edit: ' ',
    refresh: ' ',
  })

  return transformedData
}

export const putDataInTable = (
  tableData: any[],
  telegramUsernameConnected: boolean
) => {
  const body = transformData(
    tableData,
    tableData.length,
    telegramUsernameConnected
  )

  return {
    head: [
      {
        id: 'colorDot',
        label: ' ',
        style: { borderTopLeftRadius: '1.5rem' },
        isSortable: false,
      },
      {
        id: 'exchange',
        label: 'exchange',
        // isNumber: true,
        isSortable: true,
      },
      { id: 'name', label: 'name', isSortable: true },
      { id: 'value', label: 'value', isSortable: true },
      {
        id: 'added',
        label: 'added',
        // isNumber: true,
        isSortable: true,
      },
      {
        id: 'lastUpdate',
        label: 'last update',
        // isNumber: true,
        isSortable: true,
      },
      { id: 'status', label: 'status', isSortable: true },
      { id: 'autoRebalance', label: 'auto-rebalance', isSortable: true },
      {
        id: 'edit',
        label: '',
        style: { borderTopRightRadius: '1.5rem' },
        isSortable: false,
      },
      {
        id: 'refresh',
        label: '',
        style: { borderTopRightRadius: '1.5rem' },
        isSortable: false,
      },
    ],
    body,
  }
}

export const formatValue = (value: number) => {
  return addMainSymbol(roundAndFormatNumber(value, true), true)
}

export const countAllPortfoliosValue = (allPortfolios: PortfolioData[]) => {
  return allPortfolios.reduce(
    (acc, portfolio) => portfolio.portfolioValue + acc,
    0
  )
}
