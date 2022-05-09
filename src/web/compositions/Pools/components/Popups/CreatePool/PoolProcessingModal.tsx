import React from 'react'

import { FlexBlock } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import { Text } from '@sb/components/Typography'

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
  error?: POOL_ERRORS
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

export enum POOL_ERRORS {
  ACCOUNTS_CREATION_FAILED = 'Accounts creation failed. Please, try again later',
  SETTING_AUTHORITIES_FAILED = 'Setting authorities failed. Please, try again later',
  POOL_CREATION_FAILED = 'Pool creation failed. Please, try again later',
  DEPOSIT_FAILED = 'Deposit failed. Please, try to deposit manually',
  FARMING_CREATION_FAILED = 'Farming creation failed. Please, try to create farming manually.',
  BACKEND_REFRESH_FAILED = 'Pools fetching failed. Try to refresh the page.',
}

export const PoolProcessingModal: React.FC<PoolProcessingModalProps> = (
  props
) => {
  const { step, onSuccess, onError, status, error } = props

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
              <Text>{error || 'Pool creation failed.'}</Text>
              <Text size="sm">
                If you have any questions, contact us via{' '}
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
