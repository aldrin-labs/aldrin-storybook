import React from 'react'
import { useTheme } from 'styled-components'

import { FlexBlock } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import { Text } from '@sb/components/Typography'

import {
  PoolProcessingBlock,
  PoolProcessingButton,
  PoolProcessingContent,
  Title,
} from '../Popups/CreatePool/styles'
import { FarmingProcessingModalProps } from './types'
import { Link } from './styles'

const PROCESSING_STATUSES = new Set(['preparing', 'signing', 'sending'])
const OK_STATUSES = new Set([...PROCESSING_STATUSES.values(), 'success'])
const STATUS_MESSAGES: { [k: string]: string } = {
  preparing: 'Preparing transaction...',
  signing: 'Signing transaction...',
  sending: 'Waiting for transaction confirmation...',
}
export const FarmingProcessingModal: React.FC<FarmingProcessingModalProps> = (
  props
) => {
  const theme = useTheme()

  const { onClose, open, status, prolongFarming, txId } = props

  const isProcessing = PROCESSING_STATUSES.has(status)
  const isTransactionFailed = !OK_STATUSES.has(status)

  return (
    <Modal backdrop="dark" open={open} onClose={() => {}}>
      <PoolProcessingBlock>
        {isProcessing && (
          <>
            <FlexBlock justifyContent="space-between">
              <Title>Setup Farming</Title>
            </FlexBlock>
            <PoolProcessingContent>
              <div>
                {STATUS_MESSAGES[status] && (
                  <Text>{STATUS_MESSAGES[status]}</Text>
                )}
              </div>
              <Text size="sm">Please do not close browser window.</Text>
            </PoolProcessingContent>
          </>
        )}
        {status === 'confirmed' && (
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
        {isTransactionFailed && (
          <>
            <FlexBlock justifyContent="space-between">
              {status === 'timeout' ? (
                <div>
                  <Title>Farming prolongation timeout.</Title>
                  <Text>Please, try again later.</Text>
                </div>
              ) : (
                <div>
                  <Title>Farming prolongation failed.</Title>
                  <>
                    {!!txId && (
                      <Text>
                        <Link
                          target="_blank"
                          href={`https://solscan.io/tx/${txId}`}
                          rel="noreferrer"
                          color="violet5"
                        >
                          View on SolScan.
                        </Link>
                      </Text>
                    )}
                  </>
                </div>
              )}
            </FlexBlock>
            <PoolProcessingContent>
              <Text size="sm">
                Please check your transaction or contact us via{' '}
                <Link
                  href="https://t.me/Aldrin_Exchange"
                  target="_blank"
                  rel="noreferrer"
                  color="violet5"
                >
                  Telegram
                </Link>
                .
              </Text>
            </PoolProcessingContent>
          </>
        )}
        <PoolProcessingContent>
          <FlexBlock flex="1" justifyContent="space-between" direction="row">
            <PoolProcessingButton
              $width="rg"
              $loading={status === 'processing'}
              disabled={status === 'processing'}
              onClick={() => prolongFarming()}
            >
              Try again
            </PoolProcessingButton>
            <PoolProcessingButton
              $width="rg"
              $loading={status === 'processing'}
              disabled={status === 'processing'}
              onClick={onClose}
            >
              OK
            </PoolProcessingButton>
          </FlexBlock>
        </PoolProcessingContent>
      </PoolProcessingBlock>
    </Modal>
  )
}
