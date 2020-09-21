import React from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { NavLink as Link } from 'react-router-dom'
import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import copy from 'clipboard-copy'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import { selectProfileKey } from '@core/components/SelectKeyListDW/SelectKeyListDW'
import updateDepositSettings from '@core/components/SelectKeyListDW/SelectKeyListDW'
import styled from 'styled-components'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { TooltipCustom } from '@sb/components/index'
import ReimportKey from '@core/components/ReimportKey/ReimportKey'
import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import {
  PortfolioData,
  AccountData,
} from '@core/containers/Profile/ProfileAccounts/ProfileAccounts.types'

import { addMainSymbol } from '@sb/components'
import SvgIcon from '@sb/components/SvgIcon'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import {
  AddAccountButton,
  Typography,
  SmallAddIcon,
} from './ProfileAccounts.styles'
import { Button } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import { wrap } from 'lodash'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

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
const Deposit = (props: any) => <Link to="/profile/deposit" {...props} />
const Withdrawal = (props: any) => <Link to="/profile/withdrawal" {...props} />

export const transformData = (
  data: AccountData[],
  numberOfKeys: number,
  telegramUsernameConnected: boolean,
  setCreatingAdditionalAccount: () => void,
  portfolioAssetsMapFutures: [],
  portfolioAssetsMapSpot: [],
  setTransferFromSpotToFutures,
  togglePopup,
  setSelectedAccount,
  updateWithdrawalSettings,
  updateDepositSettings
) => {
  const transformedData = data.map((row, i) => {
    // console.log('updateDepositSettings', updateDepositSettings)

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
              whiteSpace: 'nowrap',
            }}
          />
        ),
      },
      name: row.name,
      spotWallet: {
        render:
          portfolioAssetsMapSpot.get(row.keyId) === undefined
            ? '$0'
            : `$${formatNumberToUSFormat(
                stripDigitPlaces(portfolioAssetsMapSpot.get(row.keyId).value, 2)
              )}`,
        style: {
          letterSpacing: '0.1rem',
          color: '#3A475C',
        },
      },
      spotWalletDeposit: {
        render: (
          <div>
            <NavLinkButton
              key="deposit"
              page={`deposit`}
              component={Deposit}
              style={{
                margin: '1rem auto',
                btnWidth: '100%',
                height: '2.2rem',
                borderRadiu: '.6rem',
                border: '.1rem solid #5BC9BB',
                backgroundColor: '#5BC9BB',
                color: '#fff',
                transition: 'all .4s ease-out',
                textTransform: 'capitalize',
                fontSize: '1.2rem',
                '&:hover': {
                  color: '#5bc9bb',
                  transition: 'all .4s ease-out',
                  backgroundColor: 'transparent',
                  border: '.1rem solid #5BC9BB',
                },
              }}
              onClick={() => {
                selectProfileKey({
                  keyId: row.keyId,
                  isDeposit: true,
                  mutation: updateDepositSettings,
                })
              }}
            >
              Deposit
            </NavLinkButton>
          </div>
        ),
      },

      spotWalletWithdrawal: {
        render: (
          <div style={{ paddingRight: '2rem' }}>
            {/* <StyledBtnLink
              to="/profile/withdrawal"
              onClick={() => {
                selectProfileKey({
                  keyId: row.keyId,
                  isDeposit: false,
                  mutation: updateWithdrawalSettings,
                })
              }}
            >
              Withdrawal
            </StyledBtnLink> */}
            <NavLinkButton
              key="withdrawal"
              page={`withdrawal`}
              component={Withdrawal}
              style={{
                margin: '1rem auto',
                btnWidth: '0rem',
                height: '2.2rem',
                borderRadius: '.6rem',
                border: '.1rem solid #5BC9BB',
                backgroundColor: 'transparant',
                color: '#5bc9bb',
                textTransform: 'capitalize',
                fontSize: '1.2rem',
                '&:hover': {
                  color: '#fff',
                  transition: 'all .4s ease-out',
                  backgroundColor: '#5bc9bb',
                  border: '.1rem solid #5BC9BB',
                },
              }}
              onClick={() => {
                selectProfileKey({
                  keyId: row.keyId,
                  isDeposit: false,
                  mutation: updateWithdrawalSettings,
                })
              }}
            >
              Withdrawal
            </NavLinkButton>
          </div>
        ),
      },
      futuresWallet: {
        render:
          portfolioAssetsMapFutures.get(row.keyId) === undefined
            ? '$0'
            : `$${formatNumberToUSFormat(
                stripDigitPlaces(
                  portfolioAssetsMapFutures.get(row.keyId).value,
                  2
                )
              )}`,
      },
      futuresWalletDeposit: {
        render: (
          <div>
            <BtnCustom
              btnWidth="100%"
              height="2.2rem"
              borderRadius=".6rem"
              borderColor="#5BC9BB"
              backgroundColor={'#5BC9BB'}
              btnColor={'#fff'}
              hoverColor="#5BC9BB"
              hoverBackground="transparant"
              transition={'all .4s ease-out'}
              textTransform="capitalize"
              fontSize="1.2rem"
              style={{
                whiteSpace: 'nowrap',
              }}
              onClick={() => {
                setTransferFromSpotToFutures(true)
                togglePopup(true)
                setSelectedAccount(row.keyId)
              }}
            >
              Transfer in
            </BtnCustom>
          </div>
        ),
      },

      futuresWalletWithdrawal: {
        render: (
          <div>
            <BtnCustom
              btnWidth="100%"
              height="2.2rem"
              borderRadius=".6rem"
              borderColor="#5BC9BB"
              btnColor={'#5BC9BB'}
              hoverColor="#fff"
              hoverBackground="#5BC9BB"
              transition={'all .4s ease-out'}
              textTransform="capitalize"
              fontSize="1.2rem"
              style={{
                whiteSpace: 'nowrap',
              }}
              onClick={() => {
                setTransferFromSpotToFutures(false)
                togglePopup(true)
                setSelectedAccount(row.keyId)
              }}
            >
              Transfer out
            </BtnCustom>
          </div>
        ),
      },
      // value: {
      //   render: row.value || '-',
      //   style: { textAlign: 'center' },
      // },
      // amount: {
      //   contentToSort: row.amount,
      //   contentToCSV: roundAndFormatNumber(row.amount, 2, true),
      //   render: addMainSymbol(roundAndFormatNumber(row.amount, 2, true), true),
      // },
      // added: {
      //   render: (
      //     <div>
      //       <span
      //         style={{
      //           display: 'block',
      //           marginBottom: '.2rem',
      //           fontSize: '1.3rem',
      //         }}
      //       >
      //         {String(
      //           dayjs.unix(row.date / 1000).format('MMM DD, YYYY')
      //         ).replace(/-/g, '.')}
      //       </span>
      //       <span style={{ color: '#ABBAD1' }}>
      //         {dayjs.unix(row.date / 1000).format('LT')}
      //       </span>
      //     </div>
      //   ),
      //   contentToSort: row.date,
      //   // isNumber: true,
      // },
      // lastUpdate: {
      //   render: (
      //     <div>
      //       <span
      //         style={{
      //           display: 'block',
      //           marginBottom: '.2rem',
      //           fontSize: '1.3rem',
      //         }}
      //       >
      //         {String(
      //           dayjs.unix(row.lastUpdate).format('MMM DD, YYYY')
      //         ).replace(/-/g, '.')}
      //       </span>
      //       <span style={{ color: '#ABBAD1' }}>
      //         {dayjs.unix(row.lastUpdate).format('LT')}
      //       </span>
      //     </div>
      //   ),
      //   contentToSort: row.lastUpdate,
      //   // isNumber: true,
      // },
      // status: {
      //   render: (
      //     <span style={row.valid ? { ...greenStyle } : { ...redStyle }}>
      //       {getKeyStatus(row.status, row.valid)}
      //     </span>
      //   ),
      // },
      // autoRebalance: {
      //   render: (
      //     <span style={{ color: '#DD6956', fontWeight: 'bold' }}>disabled</span>
      //   ),
      // },
      // edit: {
      //   render: (
      //     <PortfolioSelectorPopup
      //       popupStyle={{ transform: 'translateX(-95%)' }}
      //       needPortalMask={true}
      //       dotsColor={'#7284A0'}
      //       data={row}
      //     />
      //   ),
      // },
      copy: {
        render: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {
              copy(row._id)
            }}
          >
            <BtnCustom
              borderColor={'#7380EB'}
              borderRadius={'.6rem'}
              height="2.2rem"
              btnWidth="10rem"
              color=" #7380EB"
              textTransform="capitalize"
              fontWeight="bold"
            >
              Copy ID
            </BtnCustom>
          </div>
        ),
      },
      // refresh: {
      //   render: <ReimportKey keyId={row._id} />,
      // },
    }
  })

  transformedData.push({
    id: 'addKeyButton',
    colorDot: ' ',
    spotWallet: ' ',
    spotWalletDeposit: ' ',
    spotWalletWithdrawal: ' ',
    futuresWallet: ' ',
    futuresWalletDeposit: ' ',
    futuresWalletWithdrawal: {
      render: (
        <TooltipCustom
          title={`First, attach your telegram account via telegram tab on the left menu`}
          enterDelay={250}
          leaveDelay={200}
          disableHoverListener={telegramUsernameConnected}
          disableFocusListener={telegramUsernameConnected}
          disableTouchListener={telegramUsernameConnected}
          component={
            <div>
              <AddAccountDialog
                isFuturesWars={true}
                numberOfKeys={numberOfKeys}
                existCustomButton={true}
                CustomButton={({
                  handleClick,
                }: {
                  handleClick: () => void
                }) => (
                  <Button
                    onClick={handleClick}
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
                )}
              />
            </div>
          }
        />
      ),
      colspan: 2,
    },
    copy: {
      render: (
        <AddAccountButton
          onClick={() => {
            setCreatingAdditionalAccount(true)
          }}
        >
          <SmallAddIcon />
          <Typography style={{ whiteSpace: 'nowrap' }}>add new key</Typography>
        </AddAccountButton>
      ),
    },
  })

  return transformedData
}

export const putDataInTable = (
  tableData: any[],
  telegramUsernameConnected: boolean,
  setCreatingAdditionalAccount: () => void,
  portfolioAssetsMapFutures: [],
  portfolioAssetsMap: [],
  setTransferFromSpotToFutures: any,
  togglePopup: any,
  setSelectedAccount: string,
  updateWithdrawalSettings: any,
  updateDepositSettings: any
) => {
  const body = transformData(
    tableData,
    tableData.length,
    telegramUsernameConnected,
    setCreatingAdditionalAccount,
    portfolioAssetsMapFutures,
    portfolioAssetsMap,
    setTransferFromSpotToFutures,
    togglePopup,
    setSelectedAccount,
    updateWithdrawalSettings,
    updateDepositSettings
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
        id: 'name',
        label: 'name',
        isSortable: true,
        style: { width: '18rem', display: 'flex', flexWrap: 'nowrap' },
      },
      {
        id: 'spotWallet',
        label: 'spot',
        isSortable: true,
        style: { width: '90rem' },
      },
      {
        id: 'spotWalletDeposit',
        label: '',
        isSortable: true,
        style: { width: '90rem' },
      },
      {
        id: 'spotWalletWithdrawal',
        label: '',
        isSortable: true,
        style: { width: '90rem' },
      },
      {
        id: 'futuresWallet',
        label: 'futures',
        isSortable: true,
        style: { width: '90rem' },
      },
      {
        id: 'futuresWalletDeposit',
        label: '',
        isSortable: true,
        style: { width: '90rem' },
      },
      {
        id: 'futuresWalletWithdrawal',
        label: '',
        isSortable: true,
        style: { width: '90rem' },
      },
      // { id: 'value', label: 'value', isSortable: true },
      // {
      //   id: 'added',
      //   label: 'added',
      //   // isNumber: true,
      //   isSortable: true,
      // },
      // {
      //   id: 'lastUpdate',
      //   label: 'last update',
      //   // isNumber: true,
      //   isSortable: true,
      // },
      // { id: 'status', label: 'status', isSortable: true },
      // { id: 'autoRebalance', label: 'auto-rebalance', isSortable: true },
      // {
      //   id: 'edit',
      //   label: '',
      //   style: { borderTopRightRadius: '1.5rem' },
      //   isSortable: false,
      // },
      {
        id: 'copy',
        label: 'account id',

        style: {
          borderTopRightRadius: '1.5rem',
          textAlign: 'center',
          width: '20rem',
        },
        isSortable: false,
      },
      // {
      //   id: 'refresh',
      //   label: '',
      //   style: { borderTopRightRadius: '1.5rem' },
      //   isSortable: false,
      // },
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
