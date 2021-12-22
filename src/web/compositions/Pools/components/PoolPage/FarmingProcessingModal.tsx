import { FlexBlock } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import { Text } from '@sb/components/Typography'
import React from 'react'
import {
  PoolProcessingBlock,
  PoolProcessingButton,
  PoolProcessingContent,
  Title,
} from '../Popups/CreatePool/styles'
import { FarmingProcessingModalProps } from './types'

export const FarmingProcessingModal: React.FC<FarmingProcessingModalProps> = (
  props
) => {
  const { onClose, status } = props

  return (
    <Modal backdrop="dark" open onClose={() => {}}>
      <PoolProcessingBlock>
        {status === 'processing' && (
          <>
            <FlexBlock justifyContent="space-between">
              <Title>Setup Farming...</Title>
            </FlexBlock>
            <PoolProcessingContent>
              <Text size="sm">Please do not close browser window.</Text>
            </PoolProcessingContent>
          </>
        )}
        {status === 'success' && (
          <>
            <FlexBlock justifyContent="space-between">
              <Title>Farming prolonged</Title>
            </FlexBlock>
            <PoolProcessingContent>
              <Text size="sm">
                The new farming will appear in the interface within a couple of
                minutes.
              </Text>
            </PoolProcessingContent>
          </>
        )}
        {status === 'error' && (
          <>
            <FlexBlock justifyContent="space-between">
              <Title>Farming prolongation failed...</Title>
            </FlexBlock>
            <PoolProcessingContent>
              <Text size="sm">
                Please check your transactions or contact us via{' '}
                <a
                  href="https://t.me/Aldrin_Exchange"
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram
                </a>
                .
              </Text>
            </PoolProcessingContent>
          </>
        )}
        <PoolProcessingContent>
          <PoolProcessingButton
            $loading={status === 'processing'}
            disabled={status === 'processing'}
            onClick={onClose}
          >
            OK
            {status === 'error' && ' :('}
          </PoolProcessingButton>
        </PoolProcessingContent>
      </PoolProcessingBlock>
    </Modal>
  )
}
