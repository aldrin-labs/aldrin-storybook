import React from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/StakingV2/index.styles'

import { TooltipIcon } from '../../Icons'
import { Column, RightCenteredRow } from '../index.styles'

export const ConfirmUnstakeModal = ({
  open,
  onClose,
  unstake,
}: {
  open: boolean
  onClose: () => void
  unstake: () => void
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <RootRow margin="1em" width="30em">
        <Column width="100%">
          <InlineText color="white2" size="xsm">
            <TooltipIcon size={20} color="white2" margin="0" />
            <p>
              Your stake will take 2-3 days to completely deactivate upon
              Unstaking.
            </p>
            <p>
              After that, you can use your wallet (Phantom or Solflare) to
              withdraw the inactive stake.
            </p>
          </InlineText>
          <RightCenteredRow margin="2em 0 0 0">
            <Button
              $width="md"
              $padding="xxl"
              onClick={() => unstake()}
              $variant="violet"
            >
              OK
            </Button>
          </RightCenteredRow>
        </Column>
      </RootRow>
    </Modal>
  )
}
