import StakeBtn from '@icons/stakeBtn.png'
import { Button } from '@sb/components/Button'
import { LeftBlock, StretchedBlock } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import { Text } from '@sb/components/Typography'
import React from 'react'
import { FormItem, RestakeButton } from '../styles'
import { RewardsChart } from './RewardsChart'

export const RestakePopup = ({
  open,
  close,
}: {
  open: boolean
  close: () => void
}) => {
  return (
    <Modal
      title="Would you like to restake your reward?"
      open={open}
      onClose={close}
    >
      <StretchedBlock>
        <Text size="sm">
          By restaking your reward you will get more rewards each month due to
          a compound percentage, that's how your rewards will grow:
        </Text>
      </StretchedBlock>
      <RewardsChart />
      <LeftBlock>
        {' '}
        <FormItem>
          <Button
            onClick={() => { }}
            fontSize="xs"
            padding="lg"
            borderRadius="xxl"
          >
            Claim Anyway
          </Button>
        </FormItem>{' '}
        <RestakeButton
          onClick={() => { }}
          backgroundImage={StakeBtn}
          fontSize="xs"
          padding="lg"
          borderRadius="xxl"
        >
          Restake
        </RestakeButton>
      </LeftBlock>
    </Modal>
  )
}
