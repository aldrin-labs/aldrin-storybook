import CloseIcon from '@icons/closeIcon.svg'
import StakeBtn from '@icons/stakeBtn.png'
import { SvgIcon } from '@sb/components'
import { BlockTitle } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { LeftBlock, PopupBody, StretchedBlock } from '@sb/components/Layout'
import { PopupWrapper } from '@sb/components/PopupWrapper/PopupWrapper'
import { Text } from '@sb/components/Typography'
import React from 'react'
import { FormItem, RestakeButton } from '../Staking.styles'
import { RewardsChart } from './RewardsChart'

export const RestakePopup = ({
  open,
  close,
}: {
  open: boolean
  close: () => void
}) => {
  return (
    <PopupWrapper open={open} close={close}>
      <PopupBody>
        <StretchedBlock align="center">
          <BlockTitle>Would you like to restake your reward?</BlockTitle>
          <SvgIcon
            src={CloseIcon}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              close()
            }}
          />
        </StretchedBlock>
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
      </PopupBody>
    </PopupWrapper>
  )
}
