import React from 'react'
import styled from 'styled-components'
import { Card, withStyles } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'

import ReactSelectComponent from '@storybook/components/ReactSelectComponent'
import {
  HidingStyles,
  HighlightStyles,
} from '../shared.styles'

export const SwitchButtonsWrapper = styled.div`
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
`

export const InputContainer = styled(({ showHighlightShadows, ...other }) => (
  <Card {...other} />
))`
  min-height: 400px;
  margin-right: 2rem;
  && {
    overflow: visible;
  }

  ${(props: { showHighlightShadows: boolean }) =>
    props.showHighlightShadows ? HighlightStyles : ''};
`

export const TableContainer = styled(({ hide, ...otherProps }) => (
  <Card {...otherProps} />
))`
  flex-grow: 1;
  justify-content: flex-start;
  min-height: 400px;
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 30%;
  max-width: 50rem;
  @media (max-width: 600px) {
    margin-top: 1rem;
  }

  ${(props: { hide: boolean }) => (props.hide ? HidingStyles : '')};
`

export const Chart = styled.div`
  height: 354px;
  flex-grow: 1;
  border-radius: 1rem;
  background: ${(props: { background: string }) => props.background};

  @media (max-width: 1080px) {
    width: 100%;
    flex-basis: 100%;
  }
`

export const ImportData = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 0.5rem 2rem 0rem 2rem;
`

export const FlexWrapper = styled.div`
  height: 35px;
  display: flex;
  align-items: center;
`

export const SelectOptimization = styled(ReactSelectComponent)`
  min-height: 35px;
  width: 90px;

  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
`

export const StyledInputLabel = styled(InputLabel)`
  color: ${(props: { color: string }) => props.color};
  font-size: 0.875rem;
`

export const InputElementWrapper = styled.div`
  margin-bottom: 38px;
  display: flex;
  flex-direction: column;

  &:not(:nth-child(3)) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

export const STextField = withStyles((theme) => ({
  root: {
    width: 90,
    '&& > div:before': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '&& > div': {
      fontSize: '0.875rem',
    },
  },
}))(TextField)

export const StyledSwitch = styled(Switch)``

export const StyledWrapperForDateRangePicker = styled.div`
  width: 206px;
  padding: 6px 0;

  & .DateInput {
    width: 95px;
  }

  & .DateInput:first-child .DateInput_input {
    padding-left: 0;
  }

  & .DateInput_input {
    padding: 5px;
    font-size: 0.875rem;
    font-family: ${(props: { fontFamily: string }) => props.fontFamily};
    font-weight: 400;
    height: 36px;
    color: ${(props: { color: string }) => props.color};
    background: ${(props: { background: string }) => props.background};
  }

  & .DateRangePicker_picker {
    font-family: ${(props: { fontFamily: string }) => props.fontFamily};
    z-index: 10;
  }

  & .DateRangePickerInput {
    border: 0;
    background: ${(props: { background: string }) => props.background};
    border-bottom: 1px solid #c1c1c1;
  }

  & .DateInput_input__focused {
    border-bottom: 1px solid #fff;
    transition: all 100ms;
  }

  & .DateRangePickerInput_arrow_svg {
    fill: ${(props: { color: string }) => props.color};
    width: 14px;
    height: 14px;
  }
`

export const TableSelectsContaienr = styled.div`
  width: 49%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const InputInnerContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  min-width: 100px;
  padding: 0 15px 0 15px;
`
