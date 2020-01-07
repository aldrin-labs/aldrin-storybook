import React from 'react'
import styled from 'styled-components'
import {
  Typography,
  Button,
  Radio,
  Checkbox,
  IconButton,
  FormControlLabel,
  Paper,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'

import SearchUsername from '@core/components/SearchUsername/SearchUsername'

import { Link } from 'react-router-dom'

export const StyledDialogContent = styled(DialogContent)`
  padding: 0 2.4rem 2.4rem;
  font-family: DM Sans;

  @media (min-width: 2560px) {
    padding: 0 2rem 2rem;
  }
`

export const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e0e5ec;
  background-color: #f2f4f6;
  height: 4rem;
`

export const StyledPaper = styled(Paper)`
  &::-webkit-scrollbar-thumb {
    background: #165be0;
  }

  border-radius: 2rem;
  width: 100%;

  @media (min-width: 1440px) {
    max-width: 450px;
  }

  @media (min-width: 1720px) {
    max-width: 500px;
  }

  @media (min-width: 1820px) {
    max-width: 540px;
  }

  @media (min-width: 1921px) {
    max-width: 680px;
  }

  @media (min-width: 2560px) {
    max-width: 850px;
  }
`

export const ButtonShare = styled(Button)`
  background: ${(props) => (props.active ? '#165be0' : '#FFFFFF')};
  color: ${(props) => (props.active ? '#fff' : '#7284A0')};
  box-shadow: ${(props) =>
    props.active ? 'none' : '0px 0px .5rem rgba(10,19,43,0.1)'};
  padding: ${(props) => props.padding || '1.6rem 4rem'};
  border: 1.5px solid #e0e5ec;
  box-sizing: border-box;
  border-radius: 2rem;
  font-size: 1.6rem;

  &:hover {
    color: #fff;
    background-color: #165be0;
    border: 1.5px solid #165be0;
  }

  @media (min-width: 1440px) {
    font-size: 1.55rem;
    padding: ${(props) => (props.padding ? '1.2rem 2.7rem' : '1.2rem 1.3rem')};
  }

  @media (min-width: 1720px) {
    padding: ${(props) => (props.padding ? '1.2rem 3.2rem' : '1.2rem 2.5rem')};
  }

  @media (min-width: 1820px) {
    font-size: 1.7rem;
    padding: ${(props) => (props.padding ? '1.2rem 3.5rem' : '1.2rem 2.8rem')};
  }

  @media (min-width: 1921px) {
    font-size: 1.4rem;
    padding: ${(props) => (props.padding ? '1.2rem 3rem' : '1.2rem 2.2rem')};
  }

  @media (min-width: 2560px) {
    font-size: 1.4rem;
    padding: ${(props) => (props.padding ? '1.2rem 3rem' : '1.2rem 1.75rem')};
  }
`

export const StyledButton = styled(({ padding, ...rest }) => (
  <Button {...rest} />
))`
  padding: ${(props) => props.padding || '.8rem 1.45rem'};
  font-weight: bold;
  border-radius: 1.2rem;
  border: ${(props) =>
    props.disabled ? '1.5px solid #E0E5EC' : '1.5px solid #165BE0'};
  color: #165be0;
  letter-spacing: 1.5px;

  @media (min-width: 1440px) {
    font-size: 1.4rem;
    padding: ${(props) => (props.padding ? '.6rem 2.5rem' : '.6rem 1rem')};
  }

  @media (min-width: 1921px) {
    border-radius: 1rem;
    font-size: 1.35rem;
    padding: ${(props) => (props.padding ? '.6rem 2.5rem' : '.6rem 1rem')};
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
    padding: ${(props) => (props.padding ? '.6rem 2.45rem' : '.6rem 1.2rem')};
  }
`

export const ShareButton = styled(StyledButton)`
  margin-top: 2rem;
  padding: 0.8rem 7rem;

  @media (min-width: 1440px) {
    font-size: 1.2rem;
    padding: 0.7rem 6rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
    padding: 0.6rem 5rem;
  }
`

export const ClearButton = styled(IconButton)`
  color: #b93b2b;
  padding: 0.5rem;
`

export const Line = styled.div`
  content: '';
  width: 100%;
  background-color: #e0e5ec;
  margin-left: 1rem;
  height: 1px;

  @media (min-width: 1921px) {
    height: 1.5px;
  }

  @media (min-width: 2560px) {
    height: 2px;
  }
`

export const SButton = styled.span`
  text-decoration: none;
  color: #165be0;
  cursor: pointer;
`

export const SRadio = styled(Radio)`
  svg {
    color: #165be0;
  }

  @media (min-width: 1440px) {
    svg {
      font-size: 2.2rem;
    }
  }

  @media (min-width: 1720px) {
    svg {
      font-size: 2.4rem;
    }
  }

  @media (min-width: 2560px) {
    svg {
      font-size: 2rem;
    }
  }

  & svg {
    height: 2rem;
    width: 2rem;
  }
`

export const SCheckbox = styled(Checkbox)`
  @media (min-width: 1440px) {
    & svg {
      font-size: 2.2rem;
    }
  }

  @media (min-width: 1720px) {
    & svg {
      font-size: 2.4rem;
    }
  }

  @media (min-width: 2560px) {
    & svg {
      font-size: 2rem;
    }
  }

  & svg {
    height: 2rem;
    width: 2rem;
  }
`

export const TypographySectionTitle = styled(Typography)`
  padding: 0.5rem 0;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 23px;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  color: #16253d;

  @media (min-width: 1921px) {
    font-size: 1.05rem;
  }

  @media (min-width: 2560px) {
    font-size: 1rem;
  }
`
export const TypographySubTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 1.6rem;
  line-height: 31px;
  color: #7284a0;

  @media (min-width: 1440px) {
    font-size: 1.25rem;
  }

  @media (min-width: 1720px) {
    font-size: 1.35rem;
  }

  @media (min-width: 1921px) {
    font-size: 1.2rem;
  }
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  text-transform: uppercase;
  line-height: 31px;
  color: #7284a0;

  @media (min-width: 1440px) {
    font-size: 1.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.4rem;
  }
`

export const TypographyFooter = styled(Link)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 1.6rem;
  text-transform: uppercase;
  line-height: 31px;
  color: #fff;
  text-decoration: none;

  @media (min-width: 1921px) {
    font-size: 1.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.4rem;
  }
`

export const DialogFooter = styled(DialogTitle)`
  text-align: center;
  color: #fff;
  background: #2f7619;
  border-radius: 0px 0px 2rem 2rem;
`

export const FormInputTemplate = ({ name, handleChange, children }) => (
  <StyledInputTemplate
    value={name}
    label={name}
    labelPlacement="start"
    onChange={handleChange}
    control={children}
  />
)

export const StyledInputTemplate = styled(FormControlLabel)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  flex-basis: 45%;
  padding: 0.2rem 0;
  margin-left: 0;

  & > span {
    color: #7284a0;
    font-size: 1.6rem;
  }

  @media (min-width: 1440px) {
    & > span {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 1720px) {
    & > span {
      font-size: 1.35rem;
    }
  }

  @media (min-width: 1921px) {
    & > span {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 2560px) {
    & > span {
      font-size: 1.2rem;
    }
  }
`

export const StyledInput = styled.input`
  outline: none;
  width: ${(props) => props.width}%;
  padding: 1.2rem;
  margin-left: -1.2rem;
  border-radius: 1.2rem;
  box-shadow: inset 0px 0px 0.5rem rgba(10, 19, 43, 0.1);
  border: 1px solid #eaecee;
  color: #7284a0;
  font-size: 1.6rem;

  &::placeholder {
    color: #abbad1;
    font-size: 1.6rem;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (min-width: 1440px) {
    font-size: 1.2rem;
    padding: 1.1rem 0rem 1.1rem 1.1rem;

    &::placeholder {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 1720px) {
    font-size: 1.35rem;

    &::placeholder {
      font-size: 1.35rem;
    }
  }

  @media (min-width: 1921px) {
    width: ${(props) =>
      props.width === '100' ? props.width : props.width - 4}%;
    font-size: 1.2rem;
    padding: 1.1rem;

    &::placeholder {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
    padding: 1rem;

    &::placeholder {
      font-size: 1.2rem;
    }
  }
`

export const StyledTextArea = styled.textarea`
  outline: none;
  width: calc(100% + 1.2rem);
  height: 20rem;
  padding: 1.5rem 0 0 1.2rem;
  margin-left: -1.2rem;
  border-radius: 2rem;
  box-shadow: inset 0px 0px 0.5rem rgba(10, 19, 43, 0.1);
  border: 1px solid #eaecee;
  color: #7284a0;
  resize: none;

  &::placeholder {
    color: #abbad1;
    font-size: 1.6rem;
  }

  @media (min-width: 1440px) {
    font-size: 1.2rem;
    padding: 1.8rem 0 0 1.2rem;

    &::placeholder {
      font-size: 1.25rem;
    }
  }

  @media (min-width: 1720px) {
    font-size: 1.35rem;
    padding: 1.8rem 0 0 1.2rem;

    &::placeholder {
      font-size: 1.25rem;
    }
  }

  @media (min-width: 1921px) {
    height: 14rem;
    font-size: 1.2rem;
    padding: 1.5rem 0 0 1.2rem;

    &::placeholder {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 2560px) {
    height: 14rem;
    font-size: 1.2rem;
    padding: 1.5rem 0 0 1.2rem;

    &::placeholder {
      font-size: 1.2rem;
    }
  }
`

export const StyledSearch = styled(SearchUsername)`
  outline: none;
  width: ${(props) => props.width}%;
  padding: 0.5rem 0 0.5rem 1rem;
  margin-left: -1.2rem;
  border-radius: 1.2rem;
  box-shadow: inset 0px 0px 0.5rem rgba(10, 19, 43, 0.1);
  border: 1px solid #eaecee;
  color: #7284a0;
  font-size: 1.6rem;

  .custom-async-select-box {
    &__menu {
      margin-left: -0.8rem;
    }

    &__single-value {
      color: #7284a0;
    }

    &__placeholder {
      color: #abbad1;
    }
  }

  @media (min-width: 1440px) {
    font-size: 1.2rem;
    padding: 0.5rem 0rem 0.5rem 1.1rem;
    width: ${(props) => props.width - 4}%;

    &::placeholder {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 1720px) {
    font-size: 1.35rem;

    &::placeholder {
      font-size: 1.35rem;
    }
  }

  @media (min-width: 1921px) {
    font-size: 1.2rem;
    padding: 0.7rem 0rem 0.5rem 1.1rem;

    &::placeholder {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
    padding: 0.7rem 0rem 0.6rem 1.1rem;
  }
`
