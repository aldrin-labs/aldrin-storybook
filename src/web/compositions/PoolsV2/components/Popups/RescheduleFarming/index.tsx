import React from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'

import { ClockIcon } from '../../Icons'
import { CustomTextInput } from '../../Inputs'
import { Header } from '../CreatePool/components/Header'
import { SContainer } from '../CreatePool/index.styles'
import { Column, SmallModal } from '../index.styles'

export const RescheduleModal = ({
  open,
  onClose,
  isPool,
}: {
  open: boolean
  onClose: () => void
  isPool: boolean
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <SmallModal>
        <Header
          header="Reschedule Launch"
          description="USDT/USDC"
          needSteps={false}
          arrow={false}
          onClose={() => onClose()}
        />
        <RootRow width="100%" margin="2em">
          <SContainer padding="0.5em 1em" height="8em" needBorder width="100%">
            <Column justify="space-between" width="100%">
              <RootRow margin="0" width="100%">
                <InlineText color="white2" size="sm">
                  Launch {isPool ? 'Pool' : 'Farming'}
                </InlineText>
              </RootRow>

              <RootRow margin="0" width="100%">
                <CustomTextInput
                  title="Launch Date"
                  placeholder="DD / MM / YYYY"
                  width="49%"
                />
                <CustomTextInput
                  title="Launch Time (24h format)"
                  placeholder="HH/MM"
                  width="49%"
                />
              </RootRow>
            </Column>
          </SContainer>
        </RootRow>
        <Button
          onClick={() => {}}
          $variant="violet"
          $width="xl"
          $padding="xxxl"
          $fontSize="sm"
        >
          <ClockIcon color="blue1" />{' '}
          {isPool ? 'Reschedule Pool Launch' : 'Reschedule Farming Launch'}{' '}
        </Button>
      </SmallModal>
    </Modal>
  )
}
