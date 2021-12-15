import { FlexBlock } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import { Text } from '@sb/components/Typography'
import React from 'react'
import {
  PoolProcessingBlock,
  PoolProcessingButton,
  PoolProcessingContent,
  Title,
} from './styles'

export type TransactionStatus = 'processing' | 'success' | 'error'

interface PoolProcessingModalProps {
  step: number
  onSuccess: () => void
  onError: () => void
  status: TransactionStatus
}

const steps = [
  'Generate transactions...',
  'Create accounts...',
  'Set account authorities...',
  'Create liquidity pool...',
  'Deposit initial liquidity...',
  'Setup farming...',
  'Final touches 🎉 . It may takes up to 3 minutes.',
]

export const PoolProcessingModal: React.FC<PoolProcessingModalProps> = (
  props
) => {
  const { step, onSuccess, onError, status } = props

  return (
    <Modal backdrop="dark" open onClose={() => {}}>
      <PoolProcessingBlock>
        <FlexBlock justifyContent="space-between">
          <Title>Pool creating...</Title>
        </FlexBlock>
        <PoolProcessingContent>
          {status === 'processing' && (
            <>
              <Text>{steps[step]}</Text>
              <Text size="sm">Please do not close browser tab.</Text>
            </>
          )}
          {status === 'success' && (
            <>
              <Text>Pool has been created</Text>
              <Text size="sm">Now you can close the tab.</Text>
            </>
          )}
          {status === 'error' && (
            <>
              <Text>Pool creation failed.</Text>
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
            </>
          )}

          <PoolProcessingButton
            $loading={status === 'processing'}
            disabled={status === 'processing'}
            onClick={status === 'error' ? onError : onSuccess}
          >
            OK
            {status === 'error' && ' :('}
          </PoolProcessingButton>
        </PoolProcessingContent>
      </PoolProcessingBlock>
    </Modal>
  )
}
