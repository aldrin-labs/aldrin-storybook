import styled from 'styled-components'
import React from 'react'

import { Grid, Paper } from '@material-ui/core'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components/Loading'
import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'

export const StyledGrid = styled(Grid)`
  display: none;
`

export const StyledTab = styled(({ isSelected, ...props }) => (
  <Row {...props} />
))`
  && {
    text-transform: capitalize;
    padding: 0.5rem 1.5rem;
    background: ${(props) => (props.isSelected ? '#366CE5' : '#383B45')};
    border-radius: 1.3rem;
    cursor: pointer;
    font-family: ${(props) =>
      props.isSelected ? 'Avenir Next Demi' : 'Avenir Next Medium'};
    font-size: 1.4rem;
    margin: 0.5rem 0.75rem;
    color: #fff;
  }
`

export const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
  font-size: 2.5rem;
  margin-bottom: 0;
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
  font-size: 1.4rem;
  height: 4.5rem;
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
`
export const StyledPaper = styled(Paper)`
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
