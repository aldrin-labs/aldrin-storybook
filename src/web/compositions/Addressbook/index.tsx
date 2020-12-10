import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'
import styled from 'styled-components'
import { AES, enc, MD5 } from 'crypto-js'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import SubColumn from './SubColumn'
import { GlobalStyles } from '@sb/compositions/Chart/Chart.styles'

import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'
import {
  Card,
  HeaderCell,
  Cell,
  TableRow,
  Table,
} from '@sb/compositions/Rewards/index'
import dayjs from 'dayjs'
import { notify } from '@sb/dexUtils/notifications'
import { withTheme } from '@material-ui/styles'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { withAddressbookPassword } from '@core/hoc/withAddressbookPassword'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index'
import { compose } from 'recompose'
import { addressBookColumnNames } from '@sb/components/TradingTable/TradingTable.mocks'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { getUserAddressbook } from '@core/graphql/queries/chart/getUserAddressbook'
import { useWallet } from '@sb/dexUtils/wallet'
import { BlueSwitcherStyles } from '../Chart/components/SmartOrderTerminal/utils'
import CustomSwitcher from '@sb/components/SwitchOnOff/CustomSwitcher'
import NewCoinPopup from './NewCoinPopup'
import NewContactPopup from './NewContactPopup'

export const AddBtn = styled.button`
  background: ${(props) => props.background || '#1ba492'};
  width: ${(props) => props.width || '20rem'};
  padding: ${(props) => props.padding || '0'};
  font-family: Avenir Next Demi;
  font-size: 1.5rem;
  color: #fff;
  outline: none;
  text-transform: uppercase;
  border: none;
  border-radius: 0.4rem;
  box-shadow: 0px 0.4rem 0.6rem rgba(8, 22, 58, 0.3);
  height: 3rem;
  margin-right: 4rem;
  &:hover {
    cursor: pointer;
  }
`

const Text = styled.span`
  font-size: 1.5rem;
  padding-bottom: ${(props) => props.paddingBottom};
  text-transform: none;
  color: #ecf0f3;
`

export const Input = styled.input`
  width: 100%;
  height: 5rem;
  margin-bottom: 1rem;
  background: #303743;
  border: 0.1rem solid #424b68;
  border-radius: 0.4rem;
  padding-left: 1rem;
  color: #fff;

  &::placeholder {
    color: #abbad1;
  }
`

const onConfirmPassword = (
  addressbookPassword: string,
  addressbookConfirmPassword: string,
  isLoginStep: boolean,
  forceUpdatePassword: () => void
) => {
  // if (!isLoginStep && addressbookPassword !== addressbookConfirmPassword) {
  //   notify({
  //     type: 'error',
  //     message: 'Passwords should match',
  //   })

  //   return
  // }

  localStorage.setItem('addressbookPassword', addressbookPassword)
  localStorage.setItem('localPassword', addressbookConfirmPassword)
  forceUpdatePassword()
}

export const createHash = (value, password) => MD5(value + password).toString()
export const decrypt = (value, password) =>
  AES.decrypt(value, password).toString(enc.Utf8)
export const encrypt = (value, password) =>
  AES.encrypt(value, password).toString()

const combineContactsData = (
  data,
  setShowNewCoinPopup,
  setContactId,
  localPassword
) => {
  if (!data) {
    return []
  }
  // decrypt each field
  const proccesedData = data.map((el) => {
    return {
      id: `${el.name}${el.publicKey}`,
      name: decrypt(el.name, localPassword),
      dateAdded: {
        render: (
          <div>
            <span
              style={{
                display: 'block',
                color: '#F5F5FB',
                fontFamily: 'DM Sans Medium',
              }}
            >
              {String(dayjs.unix(el.timestamp).format('ll'))}
            </span>
            <span style={{ color: '#F5F5FB', fontFamily: 'DM Sans Medium' }}>
              {dayjs.unix(el.timestamp).format('LT')}
            </span>
          </div>
        ),
        style: {
          // opacity: needOpacity ? 0.6 : 1,
          textAlign: 'left',
        },
        // contentToSort: createdAt ? +new Date(createdAt) : -1,
      },
      contact: decrypt(el.email, localPassword) || '-',
      publicAddress: decrypt(el.publicKey, localPassword),
      expandableContent: [
        {
          row: {
            render: (
              <SubColumn
                setShowNewCoinPopup={setShowNewCoinPopup}
                coins={el.coins}
                setContactId={setContactId}
                contactId={el._id}
                localPassword={localPassword}
              />
            ),
            colspan: 5,
          },
        },
      ],
    }
  })

  return proccesedData
}

const AddressbookRoute = ({
  theme,
  getUserAddressbookQuery,
  getUserAddressbookQueryRefetch,
  publicKey,
  addressbookPassword,
  localPassword,
  forceUpdatePassword,
}) => {
  const [expandedRows, setExpandedRows] = useState([])
  const [step, updateStep] = useState('login')
  const [password, updatePassword] = useState('')
  const [confirmPassword, updateConfirmPassword] = useState('')
  const [showNewContactPopup, setShowNewContactPopup] = useState(false)
  const [showNewCoinPopup, setShowNewCoinPopup] = useState(false)
  const [contactId, setContactId] = useState('')

  const { wallet } = useWallet()

  const isNoPassword = !addressbookPassword || !localPassword

  const isPasswordStep = !publicKey || isNoPassword
  const isLoginStep = step === 'login'

  return (
    <RowContainer style={{ height: '100%' }}>
      {' '}
      <GlobalStyles />
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: isPasswordStep ? '40%' : '75%',
          height: isPasswordStep ? 'auto' : '80%',
          padding: isPasswordStep ? '8rem' : '0',
        }}
        theme={theme}
      >
        {!publicKey ? (
          <>
            <Text style={{ color: theme.palette.text.light }}>
              Connect your wallet to create or get addressbook
            </Text>
            {/* connect wallet */}
            <BtnCustom
              onClick={wallet.connect}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize="1.4rem"
              padding="1rem 2rem"
              borderRadius=".8rem"
              borderColor={'#7380EB'}
              btnColor={'#fff'}
              backgroundColor={'#7380EB'}
              textTransform={'none'}
              margin={'4rem 0 0 0'}
              transition={'all .4s ease-out'}
            >
              Connect wallet
            </BtnCustom>
          </>
        ) : isNoPassword ? (
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
              style={{ color: theme.palette.text.light }}
              paddingBottom={isLoginStep ? '2rem' : '4rem'}
            >
              {isLoginStep
                ? 'Enter your passwords to get addressbook'
                : 'Create passwords to protect your addressbook'}
            </Text>

            <Input
              style={{
                background: theme.palette.grey.input,
                color: theme.palette.text.light,
              }}
              value={password}
              type={'password'}
              onChange={(e) => updatePassword(e.target.value)}
              placeholder={'Auth password'}
            />

            <Input
              type={'password'}
              style={{
                background: theme.palette.grey.input,
                color: theme.palette.text.light,
              }}
              value={confirmPassword}
              onChange={(e) => updateConfirmPassword(e.target.value)}
              placeholder={'Encrypt password'}
            />

            <BtnCustom
              type="text"
              size="large"
              onClick={() =>
                onConfirmPassword(
                  password,
                  confirmPassword,
                  isLoginStep,
                  forceUpdatePassword
                )
              }
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
                <AddBtn
                  style={{ fontFamily: 'Avenir Next Demi' }}
                  onClick={() => setShowNewContactPopup(true)}
                >
                  + add new contact
                </AddBtn>
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
                  fontFamily: 'Avenir Next Demi',
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
                body: combineContactsData(
                  getUserAddressbookQuery.getUserAddressbook,
                  setShowNewCoinPopup,
                  setContactId,
                  localPassword
                ),
              }}
              columnNames={addressBookColumnNames}
            />
          </>
        )}
      </Card>
      <NewContactPopup
        theme={theme}
        open={showNewContactPopup}
        handleClose={() => setShowNewContactPopup(false)}
        publicKey={publicKey}
        password={addressbookPassword}
        localPassword={localPassword}
        getUserAddressbookQueryRefetch={getUserAddressbookQueryRefetch}
      />
      <NewCoinPopup
        theme={theme}
        open={showNewCoinPopup}
        handleClose={() => setShowNewCoinPopup(false)}
        publicKey={publicKey}
        password={addressbookPassword}
        localPassword={localPassword}
        getUserAddressbookQueryRefetch={getUserAddressbookQueryRefetch}
        contactId={contactId}
      />
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
      password: createHash(props.addressbookPassword, props.localPassword),
      publicKey: createHash(props.publicKey, props.localPassword),
    }),
    fetchPolicy: 'cache-and-network',
    skip: (props: any) =>
      !props.publicKey || !props.addressbookPassword || !props.localPassword,
  })
)(AddressbookRoute)
