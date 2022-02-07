import { Paper, Theme } from '@material-ui/core'
import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import {
  getNumberOfDecimalsFromNumber,
  getNumberOfIntegersFromNumber,
} from '@core/utils/chartPageUtils'

import Close from '@icons/closeIcon.svg'

import { ValueButton, ValueInput } from '../../styles'

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

const slippageToleranceValues = [{ value: 0.1 }, { value: 0.5 }, { value: 1 }]

export const TransactionSettingsPopup = ({
  theme,
  close,
  open,
  slippageTolerance,
  setSlippageTolerance,
}: {
  theme: Theme
  close: () => void
  open: boolean
  slippageTolerance: number
  setSlippageTolerance: (arg: number) => void
}) => {
  const [localSlippage, setLocalSlippage] = useState('')

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
              if (
                getNumberOfIntegersFromNumber(e.target.value) > 2 ||
                getNumberOfDecimalsFromNumber(e.target.value) > 2 ||
                isNaN(+e.target.value)
              ) {
                setSlippageTolerance(slippageTolerance)
                setLocalSlippage(slippageTolerance)
                return
              }

              setSlippageTolerance(e.target.value)
              setLocalSlippage(e.target.value)
            }}
            value={localSlippage}
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
