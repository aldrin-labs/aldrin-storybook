import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import SubColumn from './SubColumn'
import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'
import {
  Card,
  HeaderCell,
  Cell,
  TableRow,
  Table,
} from '@sb/compositions/Rewards/index'
import { notify } from '@sb/dexUtils/notifications'
import { withTheme } from '@material-ui/styles'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { withAddressbookPassword } from '@core/hoc/withAddressbookPassword'



import SvgIcon from '@sb/components/SvgIcon'
import { importCoinIcon, onErrorImportCoinUrl } from '@core/utils/MarketCapUtils'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index'
import { compose } from 'recompose'
import { addressBookColumnNames } from '@sb/components/TradingTable/TradingTable.mocks'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { getUserAddressbook } from '@core/graphql/queries/chart/getUserAddressbook'
import { useWallet } from '@sb/dexUtils/wallet'
import { BlueSwitcherStyles } from '../Chart/components/SmartOrderTerminal/utils'
import CustomSwitcher from '@sb/components/SwitchOnOff/CustomSwitcher'

export const AddBtn = styled.button`
  background: ${props => props.background || '#1ba492'};
  width: ${props => props.width || '20rem'};
  padding: ${props => props.padding || '0'};
  font-samily: Avenir Next Demi;
  font-size: 1.5rem;
  color: #fff;
  text-transform: uppercase;
  border: none;
  border-radius: 0.4rem;
  box-shadow: 0px .4rem .6rem rgba(8, 22, 58, 0.3);
  height: 3rem;
  margin-right: 4rem;
  &:hover {
    cursor: pointer;
  }
`

const Text = styled.span`
  font-size: 1.5rem;
  padding-bottom: ${props => props.paddingBottom};
  text-transform: none;
  color: #ECF0F3;
`

const Input = styled.input`
  width: 100%;
  height: 5rem;
  margin-bottom: 1rem;
  background: #303743;
  border: .1rem solid #424b68;
  border-radius: .4rem;
  padding-left: 1rem;
  color: #fff;
`

const onConfirmPassword = (addressbookPassword: string, addressbookConfirmPassword: string, isLoginStep: boolean, forceUpdatePassword: () => void) => {
  if (!isLoginStep && addressbookPassword !== addressbookConfirmPassword) {
    notify({
      type: 'error',
      message: 'Passwords should match'
    })

    return
  }

  localStorage.setItem('addressbookPassword', addressbookPassword)
  forceUpdatePassword()
}

const AddressbookRoute = ({
  theme,
  getUserAddressbookQuery,
  publicKey,
  addressbookPassword,
  forceUpdatePassword,
}) => {
  const [expandedRows, setExpandedRows] = useState([])
  const [step, updateStep] = useState('login')
  const [password, updatePassword] = useState('')
  const [confirmPassword, updateConfirmPassword] = useState('')

  const { wallet } = useWallet()

  const isPasswordStep = !publicKey || !addressbookPassword
  const isLoginStep = step === 'login'

  return (
    <RowContainer style={{ height: '100%' }}>
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: isPasswordStep ? '40%' : '70%',
          height: isPasswordStep ? 'auto' : '80%',
          padding: isPasswordStep ? '8rem' : '0',
        }}
        theme={theme}
      >
        {!publicKey ? (
          <>
            <Text>Connect your wallet to create or get addressbook</Text>
            {/* connect wallet */}
            <BtnCustom
              type="text"
              size="large"
              onClick={wallet.connect}
              btnColor={theme.palette.blue.serum}
              btnWidth={'14rem'}
              height={'4rem'}
              margin={'4rem 0 0 0'}
            >
              Connect wallet
            </BtnCustom>
          </>
        ) : !addressbookPassword ? (
          <>
            <CustomSwitcher
              theme={theme}
              firstHalfText={'login'}
              secondHalfText={'create'}
              buttonHeight={'3rem'}
              containerStyles={{
                width: '70%',
                padding: '0 0 2rem 0',
              }}
              firstHalfStyleProperties={BlueSwitcherStyles(theme)}
              secondHalfStyleProperties={BlueSwitcherStyles(theme)}
              firstHalfIsActive={isLoginStep}
              changeHalf={() => updateStep(isLoginStep ? 'sign_up' : 'login')}
            />
            <Text
              paddingBottom={isLoginStep ? '2rem' : '4rem'}
            >
              {isLoginStep
                ? 'Enter your password to get addressbook'
                : 'Create password to protect your addressbook'}
            </Text>

            <Input
              value={password}
              onChange={e => updatePassword(e.target.value)}
              placeholder={'Password'}
            />

            {!isLoginStep && <Input
              value={confirmPassword}
              onChange={e => updateConfirmPassword(e.target.value)}
              placeholder={'Confirm password'}
            />}

            <BtnCustom
              type="text"
              size="large"
              onClick={() => onConfirmPassword(password, confirmPassword, isLoginStep, forceUpdatePassword)}
              btnColor={theme.palette.blue.serum}
              btnWidth={isLoginStep ? '14rem' : '18rem'}
              height={'4rem'}
              margin={'1rem 0 0 0'}
            >
              {isLoginStep ? 'Confirm' : 'Create addressbook'}
            </BtnCustom>
          </>
        ) : (
              <>
                <AddBtn
                  background={'#7380EB'}
                  width={'auto'}
                  padding={'0 1rem'}
                >
                  copy
                </AddBtn>
                <AddBtn
                  background={'#7380EB'}
                  width={'auto'}
                  padding={'0 2rem'}
                >
                  send
                </AddBtn>
                <LazyLoad once height={`1.7rem`} >
                  <SvgIcon
                    style={{
                      marginRight: '.5rem',
                      position: 'relative',
                      top: '0.275rem',
                    }}
                    width={`1.7rem`}
                    height={`1.7rem`}
                    src={importCoinIcon("BTC")}
                    onError={onErrorImportCoinUrl}
                  />
                </LazyLoad>
                <div
                  style={{
                    width: '100%',
                    borderBottom: '0.1rem solid #424B68',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '100%',
                      height: '5rem',
                      fontFamily: 'Avenir Next Demi',
                      color: '#7284A0',
                      textTransform: 'capitalize',
                      fontSize: '1.5rem',
                      alignItems: 'center',
                      display: 'flex',
                      paddingLeft: '4rem',
                    }}
                  >
                    Addressbook
              </div>
                  <div>
                    <AddBtn>+ add new contact</AddBtn>
                  </div>
                </div>

                <TableWithSort
                  hideCommonCheckbox
                  expandableRows={true}
                  rowsWithHover={false}
                  expandedRows={expandedRows}
                  onChange={(id) =>
                    setExpandedRows(onCheckBoxClick(expandedRows, id))
                  }
                  style={{
                    borderRadius: 0,
                    height: 'calc(100% - 6rem)',
                    overflowX: 'hidden',
                    backgroundColor: theme.palette.white.background,
                  }}
                  stylesForTable={{
                    backgroundColor: theme.palette.white.background,
                  }}
                  defaultSort={{
                    sortColumn: 'date',
                    sortDirection: 'desc',
                  }}
                  withCheckboxes={false}
                  tableStyles={{
                    headRow: {
                      //   borderBottom: theme.palette.border.main,
                      boxShadow: 'none',
                      width: 'calc(100%)',
                    },
                    heading: {
                      height: '5rem',
                      color: '#ABBAD1',
                      fontWeight: 'bold',
                      letterSpacing: '.1rem',
                      fontFamily: 'Avenir Next Demi',
                      textTransform: 'capitalize',
                      fontSize: '1.5rem',
                      borderBottom: '0.1rem solid #424B68',
                      boxShadow: 'none',
                      background: 'none',
                      paddingLeft: '2rem',
                      alignItems: 'center',
                    },
                    cell: {
                      height: '5rem',
                      color: '#f5f5fb',
                      letterSpacing: '.1rem',
                      fontFamily: 'Avenir Next Medium',
                      textTransform: 'none',
                      fontSize: '1.5rem',
                      borderBottom: '0.1rem solid #424B68',
                      boxShadow: 'none',
                      background: 'none',
                      paddingLeft: '2rem',
                      alignItems: 'center',
                    },
                    tab: {
                      padding: 0,
                      boxShadow: 'none',
                    },
                  }}
                  //   emptyTableText={getEmptyTextPlaceholder(tab)}
                  data={{
                    body: [
                      {
                        Name: 'flosssolis',
                        DateAdded: '04 Dec 1903',
                        Contact: 'flosssolis@gmail.com',
                        PublicAddress: 'fkdjs4kjgha43rljsdfjlef',
                        Addresses: 'ghj',
                        expandableContent: [
                          { row: { render: <SubColumn></SubColumn>, colspan: 5 } },
                        ],
                      },
                    ],
                  }}
                  columnNames={addressBookColumnNames}
                />
              </>
            )}
      </Card>
    </RowContainer>
  )
}

export default compose(
  withTheme(),
  withPublicKey,
  withAddressbookPassword,
  queryRendererHoc({
    query: getUserAddressbook,
    name: 'getUserAddressbookQuery',
    variables: (props) => ({
      password: 'a',
      publicKey: 'a',
    }),
    fetchPolicy: 'cache-and-network',
    // skip: (props: any) => !props.publicKey || !props.addressbookPassword,
  })
)(AddressbookRoute)
