import React from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'

import { ClockIcon } from '../../Icons'
import { InvisibleInput } from '../../Inputs/index.styles'
import { LinkToTwitter } from '../../Socials'
import { Container } from '../../TableRow/index.styles'
import { Header } from '../CreatePool/components/Header'
import { Column, SmallModal } from '../index.styles'

export const EditModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <SmallModal>
        <Header
          header="Edit Twitter for"
          description="USDT/USDC"
          needSteps={false}
          arrow={false}
          onClose={() => onClose()}
        />
        <RootRow width="100%" margin="2em">
          <Container padding="0.5em 1em" height="4em" needBorder width="100%">
            <RootRow margin="0" width="100%">
              <Column margin="0" width="auto">
                <InlineText size="sm" color="white2">
                  Twitter{' '}
                </InlineText>
                <InvisibleInput />
              </Column>

              <LinkToTwitter />
            </RootRow>
          </Container>
        </RootRow>
        <Button
          onClick={() => {}}
          $variant="violet"
          $width="xl"
          $padding="xxxl"
          $fontSize="sm"
        >
          <ClockIcon color="blue1" /> Update Twitter
        </Button>
      </SmallModal>
    </Modal>
  )
}
