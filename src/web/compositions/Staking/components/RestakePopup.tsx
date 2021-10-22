import CloseIcon from '@icons/closeIcon.svg'
import { SvgIcon } from '@sb/components'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BlockTitle } from '@sb/components/Block'
import { PopupBody, StretchedBlock, LeftBlock } from '@sb/components/Layout'
import { PopupWrapper } from '@sb/components/PopupWrapper/PopupWrapper'
import { Text } from '@sb/components/Typography'
import StakeBtn from '@icons/stakeBtn.png'
import React from 'react'
import { RewardsChart } from '../RewardsChart/RewardsChart'
import { FormItem, StyledPaper } from '../Staking.styles'
import { Button } from '@sb/components/Button'

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
          <Text maxWidth="100%" size="sm">
            By restaking your reward you will get more rewards each month due to
            a compound percentage, that's how your rewards will grow:
          </Text>
        </StretchedBlock>
        <RewardsChart id={'RewardsChart'} />
        <LeftBlock>
          {' '}
          <FormItem>
            <Button
              onClick={() => {}}
              fontSize="xs"
              padding="lg"
              borderRadis="xxl"
            >
              Claim Anyway
            </Button>
          </FormItem>{' '}
          <FormItem>
            <Button
              onClick={() => {}}
              backgroundImage={StakeBtn}
              fontSize="xs"
              padding="lg"
              borderRadis="xxl"
            >
              Restake
            </Button>
          </FormItem>
        </LeftBlock>
      </PopupBody>
    </PopupWrapper>
  )
}
