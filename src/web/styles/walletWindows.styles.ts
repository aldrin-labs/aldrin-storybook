import { Button, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import styled from 'styled-components'
import { PTWrapper as PTWrapperRaw } from '@storybook/styles/cssUtils'

export { PTextBox, STypography, STypographyButtonText, SButton, SAddIcon }

export const PTWrapper = styled(PTWrapperRaw)`
  width: calc(100% - 1rem);

  grid-column-start: 2;
  grid-column-end: 3;
  display: flex;
  flex-direction: column;

  @media (max-width: 840px) {
    margin: 1.5rem auto;
  }

  @media (max-width: 550px) {
    width: calc(100% - 90px);
    margin: 0.625rem auto;
  }

  @media (max-width: 425px) {
    width: calc(100% - 20px);
  }
`

const PTextBox = styled.div`
  margin: 0 auto;
  width: 50%;
  height: 50%;
  min-width: 400px;
  min-height: 350px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
`

const STypography = styled(Typography)`
  text-align: center;
  margin-bottom: 3rem;
`

const STypographyButtonText = styled(Typography)`
  font-weight: 500;
`

const SButton = styled(Button)`
  padding-right: 11px;
  border-color: transparent;
  border-radius: 3px;
  background-color: transparent;
  font-size: 14px;
  font-weight: 500;
  box-sizing: border-box;
  border: 1px solid;

  &&:hover {
    border-color: ${(props: { borderColor: string }) => props.borderColor};
    background-color: ${(props: { backgroundColor: string }) =>
      props.backgroundColor};
  }

  && > span {
    display: flex;
    justify-content: space-between;
  }
`

const SAddIcon = styled(AddIcon)`
  font-size: 18px;
`
