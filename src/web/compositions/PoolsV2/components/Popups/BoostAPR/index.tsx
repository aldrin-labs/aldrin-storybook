import React from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { RootColumn, RootRow } from '@sb/compositions/PoolsV2/index.styles'

import { RIN_MINT } from '@core/solana'

import { ValuesContainer } from '../../Inputs'
import { Container } from '../../TableRow/index.styles'
import { Header } from '../CreatePool/components/Header'
import { RationContainer } from '../CreatePool/components/RationContainer'
import { TokenSelectorContainer } from '../CreatePool/index.styles'
import { Column, StyledModal } from '../index.styles'

export const BoostAPRModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  return (
    <StyledModal>
      <Modal open={open} onClose={onClose}>
        <Header
          header="Boost APR for"
          description="USDT/USDC"
          needSteps={false}
          onClose={onClose}
        />
        <RootColumn margin="5em 0" width="100%">
          <ValuesContainer />
          <RationContainer
            needElement={false}
            needPadding={false}
            token="RIN"
          />
          <RootRow margin="0">
            <Container height="4em" needBorder width="49%" padding="10px 18px">
              <RootRow margin="0" width="100%">
                <Column margin="0" width="auto">
                  <InlineText size="sm" color="white2">
                    Rewards per day
                  </InlineText>
                  <InlineText weight={600} color="white1">
                    1.00
                  </InlineText>
                </Column>
                <TokenSelectorContainer>
                  <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
                  <InlineText color="gray0" size="md" weight={600}>
                    RIN
                  </InlineText>
                </TokenSelectorContainer>
              </RootRow>
            </Container>
            <Container height="4em" needBorder width="49%" padding="10px 18px">
              <RootRow margin="0" width="100%">
                <Column margin="0" width="auto">
                  <InlineText size="sm" color="white2">
                    Est. APR for $100k TVL
                  </InlineText>
                  <InlineText weight={600} color="white1">
                    1.00
                  </InlineText>
                </Column>
                <TokenSelectorContainer>
                  <InlineText color="gray0" size="md" weight={600}>
                    &nbsp;%&nbsp;
                  </InlineText>
                </TokenSelectorContainer>
              </RootRow>
            </Container>
          </RootRow>
        </RootColumn>
        <RootRow margin="0 0 2em 0">
          <Button
            onClick={() => {}}
            $variant="violet"
            $width="xl"
            $padding="xxxl"
            $fontSize="sm"
          >
            Boost APR to 125% till Mar 28, 2022
          </Button>
        </RootRow>
      </Modal>
    </StyledModal>
  )
}
