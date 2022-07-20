import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { PublicKey } from '@solana/web3.js'

import { SwapStep } from './getSwapRoute'

const checkIsTransactionFromNativeSOL = ({
  swapStep,
  walletPubkey,
  inputTokenAddress,
  outputTokenAddress,
}: {
  swapStep?: SwapStep
  walletPubkey: PublicKey
  inputTokenAddress?: string
  outputTokenAddress?: string
}) => {
  if (!swapStep) return false

  const { inputMint, isSwapBaseToQuote } = swapStep
  const isInputTokenSOL = WRAPPED_SOL_MINT.equals(new PublicKey(inputMint))

  if (isInputTokenSOL) {
    // if input mint is base of pool/market, we want to check that user didn't select
    // another SOL token (not native) from several
    if (isSwapBaseToQuote) {
      return (
        !inputTokenAddress ||
        walletPubkey.equals(new PublicKey(inputTokenAddress))
      )
    }

    // same if SOL token is in quote
    return (
      !outputTokenAddress ||
      walletPubkey.equals(new PublicKey(outputTokenAddress))
    )
  }

  return false
}

export { checkIsTransactionFromNativeSOL }
