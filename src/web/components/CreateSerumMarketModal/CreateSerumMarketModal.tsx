import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'

import { Button } from '../Button'
import { InputField, INPUT_FORMATTERS } from '../Input'
import { FlexBlock } from '../Layout'
import { Modal } from '../Modal'
import { Text } from '../Typography'
import {
  Sidebar,
  Body,
  Content,
  FormGroup,
  Label,
  Li,
} from './CreateSerumMarketModal.styles'
import { CreateSerumMarketModalProps } from './CreateSerumMarketModal.types'

export const CreateSerumMarketModal: React.FC<CreateSerumMarketModalProps> = (
  props
) => {
  const [step, setStep] = useState(1)
  const { onClose } = props
  const form = useFormik({
    initialValues: {
      baseTokenMintAddress: '',
      quoteTokenMintAddress: '',
      minOrderSize: 0,
      tickSize: 0.001,
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.baseTokenMintAddress) {
        errors.baseTokenMintAddress = 'Required'
      }
      if (!values.quoteTokenMintAddress) {
        errors.quoteTokenMintAddress = 'Required'
      }
      if (!values.minOrderSize) {
        errors.minOrderSize = 'Required'
      }
      if (!values.tickSize) {
        errors.tickSize = 'Required'
      }
      return errors
    },
    onSubmit: (values) => {
      console.log('Submit form', values)
    },
  })
  return (
    <Modal
      styles={{
        root: { zIndex: 9999999 },
      }}
      open={false}
      onClose={onClose}
    >
      <Body>
        <FlexBlock direction="row">
          <Sidebar>
            <FlexBlock
              style={{ height: '100%' }}
              direction="column"
              justifyContent="space-between"
            >
              <div>
                <ol>
                  <Li $isActive={step === 1}>Create Market</Li>
                  <Li $isActive={step === 2}>Submit Listing</Li>
                </ol>
              </div>
              <div>
                <Text color="white2">Market Creation Guide</Text>
                <Text color="white2">About Aldrin CLOB</Text>
              </div>
            </FlexBlock>
          </Sidebar>
          <Content>
            {step === 1 && (
              <FormikProvider value={form}>
                <form onSubmit={form.handleSubmit}>
                  <FormGroup>
                    <Label>Base Token Mint Address</Label>
                    <InputField name="baseTokenMintAddress" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Quote Token Mint Address</Label>
                    <InputField name="quoteTokenMintAddress" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Minimum Order Size (in Base Token)</Label>
                    <InputField
                      name="minOrderSize"
                      formatter={INPUT_FORMATTERS.DECIMAL}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Minimum Order Size (in Base Token)</Label>
                    <InputField
                      name="minOrderSize"
                      formatter={INPUT_FORMATTERS.DECIMAL}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label> Tick Size (in Quote Token)</Label>
                    <InputField
                      name="tickSize"
                      formatter={INPUT_FORMATTERS.DECIMAL}
                    />
                  </FormGroup>
                  <Button type="submit">Create Market</Button>
                </form>
              </FormikProvider>
            )}
          </Content>
        </FlexBlock>
      </Body>
    </Modal>
  )
}
