import styled from 'styled-components'
import React from 'react'

import { Grid, Paper } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components/Loading'
import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Input } from '@material-ui/core'
import { AutoSizer } from 'react-virtualized'

export const StyledGrid = styled(Grid)`
  display: none;
  top: calc(100% - 1rem);
  left: 0rem;
  font-family: Avenir Next Medium;
  position: absolute;
  z-index: 900;
  background: #222429;
  min-width: ${(props) => (props.isAdvancedSelectorMode ? '160rem' : '90rem')};
  height: ${(props) => (props.isAdvancedSelectorMode ? '73rem' : '61rem')};
  border-radius: 2rem;
  overflow: hidden;
  border: ${(props) => props.theme.palette.border.new};
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
  height: ${(props) => (props.isAdvancedSelectorMode ? '15rem' : '6rem')};
  padding: 0.5rem;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: normal;
  align-items: center;
  border-bottom: ${(props) => props.theme.palette.border.new};
  background: #17181a;

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
    background: rgba(55, 56, 62, 0.75);
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
  background: #383b45;
  font-family: Avenir Next Medium;
  font-size: 1.5rem;
  color: #96999c;
  border-bottom: 0.1rem solid #383b45;
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
  background: #17181a;
  border-top: 0.1rem solid #383b45;
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
    background: ${(props) => (props.isSelected ? '#651CE4' : '#383B45')};
    border-radius: 1.3rem;
    cursor: pointer;
    font-family: ${(props) =>
      props.isSelected ? 'Avenir Next' : 'Avenir Next'};
    font-size: 1.4rem;
    margin: 0.6rem 0.55rem;
    color: #fbf2f2;
    width: auto;
    height: auto;
  }
`

export const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
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
          color={'#fff'}
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
  background-color: ${(props) =>
    props.background || props.theme.palette.blue.serum};
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: ${(props) => props.color || '#f8faff'};
  border: none;
`
export const TextField = styled.input`
  width: 100%;
  height: ${(props) => props.height || '3.5rem'};
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
  outline: none;
  margin-top: 1rem;

  &:focus {
    border: ${(props) => `0.1rem solid ${props.theme.palette.blue.serum}`};
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
    border: ${(props) => `0.1rem solid ${props.theme.palette.blue.serum}`};
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
    props.isDisabled ? '#93A0B2' : props.theme.palette.blue.serum};
  font-size: 1.4rem;
  text-transform: capitalize;
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: #f8faff;
  border: none;
  font-family: Avenir Next Medium;
  margin-top: 4rem;
  transition: 0.3rem;

  @media (max-width: 600px) {
    width: 48%;
    height: 9.5rem;
    font-size: 2.5rem;
  }
`
export const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 91rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;

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
  background: #222429;
  border: 0.1rem solid #3a475c;
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
  color: ${(props) => props.color || '#96999c'};
  font-size: 1.5rem;
  font-family: Avenir Next Medium;
  white-space: nowrap;
  letter-spacing: 0.01rem;
  cursor: pointer;
`
