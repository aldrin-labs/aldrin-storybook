import React, { useState } from 'react'
import styled from 'styled-components'

import { getAccountsFunds } from '@core/graphql/queries/chart/getAccountsFunds'
import { getPortfolioData } from '@core/graphql/queries/portfolio/main/getPortfolioData'
import { getSelectedPortfolio } from '@core/graphql/queries/portfolio/main/getSelectedPortfolio'
import { GET_TRADING_SETTINGS } from '@core/graphql/queries/user/getTradingSettings'
import { selectPortfolio } from '@core/graphql/mutations/portfolio/selectPortfolio'
import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'

import { compose } from 'recompose'
import { client } from '@core/graphql/apolloClient'
import { graphql } from 'react-apollo'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'

import SvgIcon from '@sb/components/SvgIcon'

import WhitePen from '@icons/pencil.svg'
import BluePen from '@icons/bluePencil.svg'

import {
  ExchangePair,
  SelectR,
} from '../AutoSuggestSelect/AutoSuggestSelect.styles'
import { Row } from '../PreferencesSelect/index.styles'
import {
  Container,
  PortfolioTitle,
  Stroke,
  Name,
  AddPortfolioBtn,
  CloseButton,
} from './index.styles'
import KeysComponent from './KeysComponent'
import { RenamePortfolioDialog } from '@core/components/RenameDialog/RenamePortfolioDialog'

const StyledRow = styled(Row)`
  display: none;
`
const PortfolioSelector = ({
  theme,
  id,
  selectStyles,
  value,
  marketType,
  getPortfolioDataQuery,
  getSelectedPortfolioQuery,
  getAccountsFundsQuery,
  getTradingSettingsQuery,
  selectPortfolioMutation,
}: {
  theme: Theme
  id: string
  selectStyles: () => void
  value: string
  marketType: number
}) => {
  const [portfolio, choosePortfolio] = useState(
    getSelectedPortfolioQuery.myPortfolios[0]._id
  )
  const [isEditPopupOpen, changePopupState] = useState(false)
  const [isAddPortfolioPopupOpen, changeAddPortfolioPopupState] = useState(
    false
  )
  const [portfolioToRename, choosePortfolioToRename] = useState({})
  const [isSelectorOpen, changeSelectorState] = useState(false)

  const isLoading = getAccountsFundsQuery.loading

  const accountName = (
    (getAccountsFundsQuery &&
      getAccountsFundsQuery.getAccountsFunds &&
      getAccountsFundsQuery.getAccountsFunds.find(
        (key) =>
          key.keyId ===
          getTradingSettingsQuery.getTradingSettings.selectedTradingKey
      )) || { keyName: 'Select Key' }
  ).keyName

  const portfolioName = getSelectedPortfolioQuery.myPortfolios[0].name

  const selectPortfolio = async (_id: string, name: string) => {
    client.writeQuery({
      query: getSelectedPortfolio,
      data: {
        myPortfolios: [
          {
            _id,
            name,
            __typename: 'getSelectedPortfolio',
          },
        ],
      },
    })
  }
  return (
    <>
      <ExchangePair
        style={{
          width: 'auto',
          minWidth: '25rem',
          marginLeft: '.8rem',
          borderRadius: '0.3rem',
          whiteSpace: 'nowrap',
        }}
        selectStyles={{
          ...selectStyles,
          '& div': {
            textTransform: 'capitalize',
            fontSize: '1.4rem',
          },
        }}
        fixed={isSelectorOpen}
      >
        {' '}
        <div
          onClick={() => {
            changeSelectorState(!isSelectorOpen)
          }}
          style={{ display: 'flex', width: '100%' }}
        >
          <SelectR
            theme={theme}
            id={id}
            style={{ width: '100%' }}
            value={{
              value: `${portfolioName} / ${accountName}`,
              label: `${portfolioName} / ${accountName}`,
            }}
            fullWidth={true}
            isDisabled={true}
          />
        </div>
        <StyledRow
          id={'preferences'}
          direction="column"
          style={{
            overflow: 'hidden',
            overflowX: 'hidden',
            top: '100%',
            left: '2.5rem',
            position: 'absolute',
            zIndex: 900,
            background: theme.palette.white.background,
            width: '65rem',
            height: '34rem',
            borderRadius: '1rem',
            border: theme.palette.border.main,
            boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
          }}
        >
          {' '}
          <Row
            width={'100%'}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              height: '80%',
              borderBottom: '0.1rem solid #e0e2e5',
            }}
          >
            <Container
              width={'40%'}
              theme={theme}
              isLoading={isLoading}
              style={{
                borderRight: theme.palette.border.main,
                paddingRight: '2rem',
              }}
            >
              {getPortfolioDataQuery?.myPortfolios?.map((el) => (
                <Stroke theme={theme}>
                  {' '}
                  <PortfolioTitle
                    onClick={() => {
                      choosePortfolio(el._id)
                      selectPortfolio(el._id, el.name)
                      selectPortfolioMutation({
                        variables: {
                          inputPortfolio: {
                            id: el._id,
                          },
                        },
                      })
                    }}
                    theme={theme}
                    isActive={portfolio === el._id}
                  >
                    {' '}
                    <Name>
                      {' '}
                      <input
                        type="radio"
                        value={el._id}
                        id={el._id}
                        checked={portfolio === el._id}
                        style={{ marginRight: '1rem' }}
                      ></input>
                      <label style={{ cursor: 'pointer' }} htmlFor={el._id}>
                        {el.name}
                      </label>
                    </Name>
                    <SvgIcon
                      src={portfolio === el._id ? WhitePen : BluePen}
                      onClick={() => {
                        changePopupState(true)
                        choosePortfolioToRename({
                          name: el.name,
                          _id: el._id,
                        })
                      }}
                    />
                  </PortfolioTitle>
                </Stroke>
              ))}
              <Stroke>
                <CreatePortfolio
                  baseCoin={'USDT'}
                  existCustomButton
                  CustomButton={({
                    handleClick,
                  }: {
                    handleClick: () => void
                  }) => (
                    <AddPortfolioBtn
                      width={'85%'}
                      onClick={() => {
                        changeAddPortfolioPopupState(!isAddPortfolioPopupOpen)
                        handleClick()
                        console.log('addportf', isAddPortfolioPopupOpen)
                      }}
                    >
                      + Add new portfolio
                    </AddPortfolioBtn>
                  )}
                />
              </Stroke>
            </Container>{' '}
            <KeysComponent
              theme={theme}
              marketType={marketType}
              portfolio={portfolio}
            />
          </Row>
          <Row style={{ height: '6rem' }}>
            <CloseButton
              onClick={() => {
                changeSelectorState(false)
              }}
            >
              Ok
            </CloseButton>
          </Row>
        </StyledRow>
      </ExchangePair>

      {isEditPopupOpen ? (
        <RenamePortfolioDialog
          theme={theme}
          needRenameButton={false}
          data={portfolioToRename}
          isPortfolio={true}
          baseCoin={'USDT'}
          forceUpdateUserContainer={() => {}}
          closeMainPopup={() => changePopupState(false)}
        />
      ) : null}
    </>
  )
}

export default compose(
  queryRendererHoc({
    query: getPortfolioData,
    name: 'getPortfolioDataQuery',
    withoutLoading: true,
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: getSelectedPortfolio,
    name: 'getSelectedPortfolioQuery',
    withoutLoading: false,
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: getAccountsFunds,
    name: 'getAccountsFundsQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    variables: (props) => ({
      input: {
        marketType: props.marketType,
        portfolioId: props.getSelectedPortfolioQuery.myPortfolios[0]._id,
      },
    }),
  }),
  queryRendererHoc({
    query: GET_TRADING_SETTINGS,
    name: 'getTradingSettingsQuery',
    // skip: (props: any) => !props.authenticated,
    withOutSpinner: true,
    fetchPolicy: 'cache-only',
  }),
  graphql(selectPortfolio, {
    name: 'selectPortfolioMutation',
    // options: {
    // refetchQueries: [{ query: getSelectedPortfolio }],
    // },
  })
)(PortfolioSelector)
