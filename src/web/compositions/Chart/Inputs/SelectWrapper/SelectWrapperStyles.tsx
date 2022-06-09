import { Grid, Paper, Input } from '@material-ui/core'
import React from 'react'
import { AutoSizer } from 'react-virtualized'
import styled from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components/Loading'
import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const StyledGrid = styled(Grid)`
  display: none;
  top: calc(100% - 1rem);
  left: 0rem;
  font-family: Avenir Next Medium;
  position: absolute;
  z-index: 900;
  background: ${(props) => props.theme.colors.gray6};
  min-width: ${(props) => (props.isAdvancedSelectorMode ? '160rem' : '90rem')};
  height: ${(props) => (props.isAdvancedSelectorMode ? '73rem' : '61rem')};
  border-radius: 2rem;
  overflow: hidden;
  border: 0.1rem solid ${(props) => props.theme.colors.gray5};
  filter: drop-shadow(0px 0px 8px rgba(125, 125, 131, 0.2));

  @media (max-width: 600px) {
    top: 19rem;
    width: 100%;
    height: calc(100% - 30rem);
    border-radius: 0;
    filter: none;
    min-width: auto;
  }
`

export const StyledSymbol = styled.span`
  text-transform: capitalize;
  color: #96999c;
  font-family: Avenir Next Thin;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  @media (max-width: 600px) {
    display: none;
  }
`

export const StyledTokenName = styled.span`
  @media (max-width: 600px) {
    font-size: 2.6rem;
  }
`
export const IconContainer = styled.div`
  width: 4rem;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  @media (max-width: 600px) {
    width: 8rem;
    justify-content: flex-start;
  }
`

export const StyledHeader = styled(RowContainer)`
  height: ${(props) => (props.isAdvancedSelectorMode ? '15rem' : '10rem')};
  padding: ${(props) =>
    props.isAdvancedSelectorMode ? '0.5rem' : '1rem 0.5rem'};
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: normal;
  align-items: center;
  border-bottom: ${(props) => props.theme.colors.gray5};
  background: ${(props) => props.theme.colors.gray10};

  @media (max-width: 600px) {
    display: none;
  }
`
export const StyledTable = styled(Grid)`
  overflow: hidden;
  height: ${(props) =>
    props.isAdvancedSelectorMode ? 'calc(100% - 24rem)' : 'calc(100% - 15rem)'};

  @media (max-width: 600px) {
    height: calc(100% - 10rem);
  }
`
export const StyledRow = styled.span`
  @media (max-width: 600px) {
    display: none;
  }
`

export const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 2.3rem;
  font-family: Avenir Next Light;
  @media (min-width: 600px) {
    display: none;
  }
`

export const StyledAutoSizer = styled(AutoSizer)`
  .pairSelectorRow:hover,
  .pairSelectorRow:focus {
    background: ${(props) => props.theme.colors.gray5};
  }
`

export const TradeHistoryGrid = styled(Grid)`
  height: 100%;
  flex-basis: ${(props) =>
    props.hideOrderbook ? '100%' : props.hideDepthChart ? '50%' : '35%'};
  max-width: ${(props) =>
    props.hideOrderbook ? '100%' : props.hideDepthChart ? '50%' : '35%'};
  @media (max-width: 600px) {
    display: none;
  }
`
export const OrderBookGrid = styled(Grid)`
  height: 100%;
  flex-basis: ${(props) =>
    props.hideOrderbook ? '0' : props.hideTradeHistory ? '100%' : '50%'};
  max-width: ${(props) =>
    props.hideOrderbook ? '0' : props.hideTradeHistory ? '100%' : '50%'};
  @media (max-width: 600px) {
    max-width: 100%;
    flex-basis: 100%;
  }
`

export const StyledInput = styled(Input)`
  width: 100%;
  height: 5rem;
  background: ${(props) => props.theme.colors.gray6};
  font-family: Avenir Next Medium;
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.gray1};
  border-bottom: 0.1rem solid ${(props) => props.theme.colors.gray10};
  border-top: 0.1rem solid ${(props) => props.theme.colors.gray10};
  padding: 0 2rem;
  @media (max-width: 600px) {
    height: 10rem;
  }
`

export const TableFooter = styled(Grid)`
  height: 4rem;
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 1000;
  background: ${(props) => props.theme.colors.gray5};
  @media (max-width: 600px) {
    display: none;
  }
`

export const StyledTab = styled(({ isSelected, ...props }) => (
  <BtnCustom {...props} />
))`
  && {
    text-transform: capitalize;
    padding: 0.2rem 0.75rem;
    border: none;
    background: ${(props) =>
      props.isSelected ? props.theme.colors.blue3 : props.theme.colors.gray6};
    border-radius: 1.3rem;
    cursor: pointer;
    font-family: ${(props) =>
      props.isSelected ? 'Avenir Next' : 'Avenir Next'};
    font-size: 1.4rem;
    margin: 0.6rem 0.55rem;
    color: ${(props) => (props.isSelected ? '#fff' : props.theme.colors.gray1)};
    width: auto;
    height: auto;
  }
`

export const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
  color: ${(props) => props.theme.colors.white};
  font-size: 2.5rem;
  margin-bottom: 0;
  @media (max-width: 600px) {
    font-size: 4rem;
  }
`
export const BlueButton = styled(
  ({ isUserConfident, showLoader, children, ...props }) => (
    <BtnCustom {...props}>
      {showLoader ? (
        <Loading
          color="#fff"
          size={24}
          style={{ display: 'flex', alignItems: 'center', height: '4.5rem' }}
        />
      ) : (
        children
      )}
    </BtnCustom>
  )
)`
  font-size: ${(props) => (props.isMobile ? '2.5rem' : '1.4rem')};
  height: ${(props) => (props.isMobile ? '9.5rem' : '4.5rem')};
  text-transform: capitalize;
  background-color: ${(props) => props.background || props.theme.colors.blue5};
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: ${(props) => props.color || '#f8faff'};
  border: none;
`
export const TextField = styled.input`
  width: 100%;
  height: ${(props) => props.height || '3.5rem'};
  background: ${(props) => props.theme.colors.gray5};
  border: none;
  border-radius: 0.5rem;
  color: ${(props) => props.theme.colors.gray1};
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  outline: none;
  margin-top: 1rem;

  &:focus {
    border: ${(props) => `0.1rem solid ${props.theme.colors.blue5}`};
  }
  &::placeholder {
    padding-top: 1rem;
  }
  @media (max-width: 600px) {
    height: 9.5rem;
    font-size: 2rem;
    margin-bottom: 5rem;

    &::placeholder {
      font-size: 2rem;
    }
  }
`

export const StyledRowContainer = styled(RowContainer)`
  margin: 1rem 0;
  @media (max-width: 600px) {
    margin-top: 5rem;
  }
`
export const StyledTextArea = styled.textarea`
  width: 100%;
  height: ${(props) => props.height || '3.5rem'};
  background: ${(props) => props.theme.colors.gray5};
  border-radius: 0.5rem;
  color: ${(props) => props.theme.colors.gray0};
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: none;
  outline: none;
  margin-top: 1rem;
  padding-top: 1rem;
  resize: none;
  @media (max-width: 600px) {
    height: 30rem;
    font-size: 2rem;
    margin-bottom: 3rem;
    &::placeholder {
      font-size: 2rem;
    }
  }
  &:focus {
    border: ${(props) => `0.1rem solid ${props.theme.colors.blue5}`};
  }
`

export const Form = styled.form`
  width: 100%;
`
export const Label = styled.label`
  width: 100%;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
`

export const SubmitButton = styled.button`
  width: 100%;
  height: 4.5rem;
  background: ${(props) =>
    props.isDisabled ? props.theme.colors.disabled : props.theme.colors.blue5};
  font-size: 1.4rem;
  text-transform: capitalize;
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: #f8faff;
  border: none;
  font-family: Avenir Next Medium;
  margin-top: 3rem;
  transition: 0.3rem;

  @media (max-width: 600px) {
    width: 48%;
    height: 9.5rem;
    font-size: 2.5rem;
  }
`
export const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: ${(props) => props.width || '91rem'};
  height: ${(props) => props.height || 'auto'};
  background: ${(props) => props.theme.colors.gray6};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
  max-width: 1200px;
  @media (max-width: 600px) {
    border: 0;
    border-radius: 0;
    width: 100%;
    height: calc(100% - 22rem);
    max-height: 100%;
    margin: 0;
    justify-content: center;
    background: #17181a;
  }
`

export const StyledPaperMediumWidth = styled(Paper)`
  border-radius: 2rem;
  width: 60rem;
  height: auto;
  background: ${(props) => props.theme.colors.gray6};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;

  @media (max-width: 600px) {
    border: 0;
    border-radius: 0;
    width: 100%;
    height: calc(100%);
    max-height: 100%;
    margin: 0;
    justify-content: center;
    background: #17181a;
  }
`

export const TextArea = styled.div`
  width: 85%;
  height: 3.5rem;
  background: #383b45;
  border: 1px solid #3a475c;
  border-radius: 0.5rem;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
export const StyledLabel = styled.label`
  color: ${(props) => props.color || props.theme.colors.gray1};
  font-size: 1.5rem;
  font-family: Avenir Next Medium;
  white-space: nowrap;
  letter-spacing: 0.01rem;
  cursor: pointer;
`
export const ExpandIconContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;

  svg {
    path {
      fill: ${(props) => props.theme.colors.gray1};
    }
  }
`
