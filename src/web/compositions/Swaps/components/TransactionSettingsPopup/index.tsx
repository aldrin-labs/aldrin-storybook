import React from 'react'
import styled from 'styled-components'

import { Text } from '@sb/compositions/Addressbook/index'

import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import Close from '@icons/closeIcon.svg'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem 0;
  width: 50rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
  overflow: hidden;
  padding: 2rem;
`
const ValueButton = styled.button`
  width: auto;
  cursor: pointer;
  padding: 0.7rem 1.5rem;
  font-family: Avenir Next Medium;
  color: #fbf2f2;
  background-color: transparent;
  margin-right: 2rem;
  font-size: 1.3rem;
  border: 0.1rem solid #3a475c;
  border-radius: 2rem;
  &:focus {
    background: ${(props) => props.theme.palette.blue.serum};
    border: ${(props) => `0.1rem solid ${props.theme.palette.blue.serum}`};
    font-family: Avenir Next Demi;
    color: #f8faff;
  }
`
const ValueInput = styled.input`
  width: 8rem;
  padding: 0.7rem 1.5rem;
  font-family: Avenir Next Medium;
  color: #fbf2f2;
  background-color: transparent;
  font-size: 1.3rem;
  border: 0.1rem solid #3a475c;
  border-radius: 2rem;
  outline: none;
  &:focus {
    border: ${(props) => `0.1rem solid ${props.theme.palette.blue.serum}`};
  }
`

const slippageToleranceValues = [{ value: 0.1 }, { value: 0.5 }, { value: 1 }]

export const TransactionSettingsPopup = ({
  theme,
  close,
  open,
  setSlippageTolerance,
}: {
  theme: Theme
  close: () => void
  open: boolean
  setSlippageTolerance: (arg: number) => void
}) => {
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      close()
    }
  }
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between">
        <Text>Transaction Settings</Text>
        <SvgIcon
          src={Close}
          style={{ cursor: 'pointer' }}
          onClick={() => close()}
        />
      </RowContainer>
      <RowContainer justify="flex-start" margin="2rem 0">
        <Text fontFamily="Avenir Next Demi">Slippage Tolerance</Text>
      </RowContainer>
      <RowContainer justify="flex-start">
        {slippageToleranceValues.map((el) => {
          return (
            <ValueButton
              theme={theme}
              onClick={() => {
                setSlippageTolerance(el.value)
                close()
              }}
            >
              {el.value}%
            </ValueButton>
          )
        })}
        <Row style={{ position: 'relative' }}>
          <ValueInput
            onChange={(e) => {
              setSlippageTolerance(e.target.value)
            }}
            placeholder="1.00"
            theme={theme}
            onKeyDown={handleKeyDown}
          />
          <div
            style={{
              position: 'absolute',
              fontFamily: 'Avenir Next Medium',
              color: '#fbf2f2',
              fontSize: '1.3rem',
              right: '1.5rem',
            }}
          >
            %
          </div>
        </Row>
      </RowContainer>
    </DialogWrapper>
  )
}
