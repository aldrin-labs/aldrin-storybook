import React, { useState } from 'react'
import styled from 'styled-components'

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
  AccountTitle,
  Stroke,
  Name,
  DepositBtn,
  AddPortfolioBtn,
  CloseButton,
  Balances,
  Radio,
} from './index.styles'

const StyledRow = styled(Row)`
  display: none;
`

const PortfolioSelector = ({
  theme,
  id,
  selectStyles,
  value,
}: {
  theme: Theme
  id: string
  selectStyles: () => void
  value: string
}) => {
  const [Portfolio, choosePortfolio] = useState('1')
  const [Account, chooseAccount] = useState('5')
  return (
    <>
      <ExchangePair
        style={{
          width: '18rem',
          marginLeft: '.8rem',
          borderRadius: '0.3rem',
        }}
        selectStyles={{
          ...selectStyles,
          '& div': {
            textTransform: 'capitalize',
            fontSize: '1.4rem',
          },
        }}
      >
        <SelectR
          theme={theme}
          id={id}
          style={{ width: '100%' }}
          value={value}
          fullWidth={true}
          isDisabled={true}
        />
        <StyledRow
          id={'preferences'}
          direction="column"
          style={{
            overflow: 'scroll',
            overflowX: 'hidden',
            top: '100%',
            left: '2.5rem',
            position: 'absolute',
            zIndex: 900,
            background: theme.palette.white.background,
            width: '55rem',
            height: '29rem',
            borderRadius: '1rem',
            border: theme.palette.border.main,
            boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
          }}
        >
          <Row
            width={'100%'}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              borderBottom: '0.1rem solid #e0e2e5',
            }}
          >
            <Container
              width={'45%'}
              theme={theme}
              style={{
                borderRight: theme.palette.border.main,
                paddingRight: '2rem',
              }}
            >
              <Stroke theme={theme}>
                <PortfolioTitle isActive={Portfolio === '1'}>
                  <Name>
                    {' '}
                    <input
                      type="radio"
                      value="1"
                      id="1"
                      checked={Portfolio === '1'}
                      style={{ marginRight: '1rem' }}
                      onChange={() => {
                        choosePortfolio('1')
                      }}
                    ></input>
                    <span className="radioBtn"></span>
                    <label htmlFor={'1'}> Portfolio #1</label>{' '}
                  </Name>
                  <SvgIcon src={Portfolio === '1' ? WhitePen : BluePen} />
                </PortfolioTitle>
                <Balances>$100</Balances>
              </Stroke>

              <Stroke theme={theme}>
                {' '}
                <PortfolioTitle theme={theme} isActive={Portfolio === '2'}>
                  {' '}
                  <Name>
                    {' '}
                    <input
                      type="radio"
                      value="2"
                      id="2"
                      checked={Portfolio === '2'}
                      style={{ marginRight: '1rem' }}
                      onChange={() => {
                        choosePortfolio('2')
                      }}
                    ></input>
                    <label htmlFor={'2'}>Portfolio #2 </label>
                  </Name>
                  <SvgIcon src={Portfolio === '2' ? WhitePen : BluePen} />
                </PortfolioTitle>
                <Balances>$100</Balances>
              </Stroke>
              <Stroke theme={theme}>
                {' '}
                <PortfolioTitle theme={theme} isActive={Portfolio === '3'}>
                  <Name>
                    <input
                      type="radio"
                      value="3"
                      id="3"
                      checked={Portfolio === '3'}
                      style={{ marginRight: '1rem' }}
                      onChange={() => {
                        choosePortfolio('3')
                      }}
                    ></input>
                    <label htmlFor={'3'}>Portfolio #3 </label>
                  </Name>{' '}
                  <SvgIcon src={Portfolio === '3' ? WhitePen : BluePen} />
                </PortfolioTitle>
                <Balances>$100</Balances>
              </Stroke>
              <Stroke theme={theme}>
                {' '}
                <PortfolioTitle theme={theme} isActive={Portfolio === '4'}>
                  {' '}
                  <Name>
                    {' '}
                    <input
                      type="radio"
                      value="4"
                      id="4"
                      checked={Portfolio === '4'}
                      style={{ marginRight: '1rem' }}
                      onChange={() => {
                        choosePortfolio('4')
                      }}
                    ></input>
                    <label htmlFor={'4'}>Portfolio #4 </label>
                  </Name>
                  <SvgIcon src={Portfolio === '4' ? WhitePen : BluePen} />
                </PortfolioTitle>
                <Balances>$100</Balances>
              </Stroke>
              <Stroke>
                <AddPortfolioBtn width={'85%'}>
                  + Add new portfolio
                </AddPortfolioBtn>
              </Stroke>
            </Container>
            <Container
              width={'calc(55% - 1rem)'}
              style={{ marginRight: '2rem' }}
            >
              {' '}
              <Stroke theme={theme} padding={'0 3rem 0 0'}>
                <AccountTitle theme={theme} isActive={Account === '5'}>
                  {' '}
                  <Name>
                    {' '}
                    <input
                      type="radio"
                      value="5"
                      id="5"
                      checked={Account === '5'}
                      style={{ marginRight: '1rem' }}
                      onChange={() => {
                        chooseAccount('5')
                      }}
                    ></input>
                    <label htmlFor={'5'}>Account #4 </label>
                  </Name>
                  <SvgIcon src={Account === '5' ? WhitePen : BluePen} />
                </AccountTitle>{' '}
                <Balances>$100.00</Balances>
                <DepositBtn>Deposit</DepositBtn>
              </Stroke>
              <Stroke theme={theme} padding={'0 3rem 0 0'}>
                {' '}
                <AccountTitle theme={theme} isActive={Account === '6'}>
                  {' '}
                  <Name>
                    <input
                      type="radio"
                      value="6"
                      id="6"
                      checked={Account === '6'}
                      style={{
                        marginRight: '1rem',
                      }}
                      onChange={() => {
                        chooseAccount('6')
                      }}
                    ></input>
                    <label htmlFor={'6'}>Account #1 </label>
                  </Name>
                  <SvgIcon src={Account === '6' ? WhitePen : BluePen} />
                </AccountTitle>{' '}
                <Balances>$100.00</Balances>
                <DepositBtn>Deposit</DepositBtn>
              </Stroke>
              <Stroke theme={theme} padding={'0 3rem 0 0'}>
                {' '}
                <AccountTitle theme={theme} isActive={Account === '7'}>
                  {' '}
                  <Name>
                    {' '}
                    <input
                      type="radio"
                      value="7"
                      id="7"
                      checked={Account === '7'}
                      style={{ marginRight: '1rem' }}
                      onChange={() => {
                        chooseAccount('7')
                      }}
                    ></input>
                    <label htmlFor={'7'}>Account #2 </label>
                  </Name>
                  <SvgIcon src={Account === '7' ? WhitePen : BluePen} />
                </AccountTitle>{' '}
                <Balances>$100.00</Balances>
                <DepositBtn>Deposit</DepositBtn>
              </Stroke>
              <Stroke>
                <AddPortfolioBtn width={'60%'}>
                  + Add new account
                </AddPortfolioBtn>
              </Stroke>
            </Container>
          </Row>
          <Row style={{ height: '6rem' }}>
            <CloseButton>Ok</CloseButton>
          </Row>
        </StyledRow>
      </ExchangePair>
    </>
  )
}

export default PortfolioSelector
