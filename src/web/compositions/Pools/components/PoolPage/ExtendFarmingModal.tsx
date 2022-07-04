import { PublicKey } from '@solana/web3.js'
import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Loader } from '@sb/components/Loader/Loader'
import { Modal } from '@sb/components/Modal'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { createNewHarvestPeriod, useFarm } from '@sb/dexUtils/farming'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripByAmount } from '@core/utils/chartPageUtils'
import { DAY } from '@core/utils/dateUtils'

import { getTokenName } from '../../../../dexUtils/markets'
import { useTokenInfos } from '../../../../dexUtils/tokenRegistry'
import { FarmingForm } from '../Popups/CreatePool/FarmingForm'
import { Body, ButtonContainer, Footer } from '../Popups/CreatePool/styles'
import { WithFarming } from '../Popups/CreatePool/types'
import { FarmingProcessingModal } from './FarmingProcessingModal'
import { ExtendFarmingModalProps, FarmingModalProps } from './types'

const FarmingModal: React.FC<FarmingModalProps> = (props) => {
  const { onClose, onExtend, title, pool } = props

  const [userTokens] = useUserTokenAccounts()
  const farmingTokens = (pool.farming || []).map((fs) => fs.farmingTokenMint)
  const farm = useFarm(pool.poolTokenMint)
  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()

  const [isProcessingFarmingPopupOpen, setIsProcessingFarmingPopupOpen] =
    useState(false)
  const [farmingTransactionStatus, setFarmingTransactionStatus] = useState<
    string | null
  >(null)
  const [farmingTxId, setFarmingTxId] = useState<string | undefined>()

  const tokens: Token[] = userTokens
    // .filter(
    //   (ut) =>
    //     farmingTokens.length === 0 ? true : farmingTokens.includes(ut.mint) //  Limit token select with already existing mints
    // )
    .map((ut) => ({
      mint: ut.mint,
      account: ut.address,
      balance: ut.amount,
    }))
    .sort((a, b) => a.mint.localeCompare(b.mint))

  // Because tokens could change & Formik bug, we have to store state somewhere
  // https://github.com/jaredpalmer/formik/issues/3348
  const [initialValues] = useState<WithFarming>({
    farming: {
      token: tokens[0] || { mint: farmingTokens[0] },
      vestingEnabled: true,
      tokenAmount: '0',
      farmingPeriod: '14',
      vestingPeriod: '7',
    },
  })

  const prolongFarming = async (values: WithFarming) => {
    setFarmingTransactionStatus('preparing')

    setIsProcessingFarmingPopupOpen(true)

    const farmingRewardAccount = userTokens.find(
      (ut) => ut.address === values.farming.token.account
    )

    try {
      if (!farmingRewardAccount) {
        throw new Error('No token account selected')
      }

      const result = await createNewHarvestPeriod({
        connection,
        wallet,
        stakeMint: new PublicKey(pool.poolTokenMint),
        harvestMint: new PublicKey(farmingRewardAccount.mint),
        duration: parseFloat(values.farming.farmingPeriod) * DAY,
        userTokens,
        amount: parseFloat(values.farming.tokenAmount),
        farm,
      })
      if (result === 'success') {
        onExtend()
      } else {
        setFarmingTransactionStatus('error')
      }

      // setFarmingTransactionStatus(
      //   result.details?.includes(SendTransactionDetails.TIMEOUT)
      //     ? 'timeout'
      //     : result.status
      // )
      setFarmingTransactionStatus(result)
    } catch (e) {
      console.warn('Unable to create farming: ', e)
      setFarmingTransactionStatus('error')
    }
  }

  const form = useFormik<WithFarming>({
    validateOnMount: true,
    initialValues,
    onSubmit: prolongFarming,
    validate: async (values) => {
      if (
        values.farming.vestingEnabled &&
        !((values.farming.vestingPeriod || 0) > 0)
      ) {
        return {
          farming: { vestingPeriod: 'Please enter a valid vesting period.' },
        }
      }
      return null
    },
  })

  const {
    values: { farming },
  } = form
  const farmingRewardPerDay =
    parseFloat(farming.farmingPeriod) > 0
      ? parseFloat(farming.tokenAmount) / parseFloat(farming.farmingPeriod)
      : 0
  const farmingRewardFormatted = `${stripByAmount(farmingRewardPerDay)}`

  return (
    <>
      <FormikProvider value={form}>
        <form onSubmit={form.handleSubmit}>
          <FarmingForm
            farmingRewardFormatted={farmingRewardFormatted}
            tokens={tokens}
            userTokens={userTokens}
          />

          <Footer>
            <ButtonContainer>
              <Button
                $padding="lg"
                type="button"
                onClick={onClose}
                $variant="outline-white"
              >
                Cancel
              </Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button $padding="lg" disabled={!form.isValid} type="submit">
                {title}
              </Button>
            </ButtonContainer>
          </Footer>
        </form>
      </FormikProvider>
      {farmingTransactionStatus && (
        <FarmingProcessingModal
          prolongFarming={() => prolongFarming({ farming })}
          status={farmingTransactionStatus}
          open={isProcessingFarmingPopupOpen}
          txId={farmingTxId}
          onClose={() => {
            setFarmingTransactionStatus(null)
            setFarmingTxId(undefined)
            setIsProcessingFarmingPopupOpen(false)
          }}
        />
      )}
    </>
  )
}

export const ExtendFarmingModal: React.FC<ExtendFarmingModalProps> = (
  props
) => {
  const [userTokens] = useUserTokenAccounts()
  const { title = 'Extend Farming', onClose, onExtend, pool } = props

  const tokensInfo = useTokenInfos()
  const base = getTokenName({ address: pool.tokenA, tokensInfoMap: tokensInfo })
  const quote = getTokenName({
    address: pool.tokenB,
    tokensInfoMap: tokensInfo,
  })

  return (
    <Modal open onClose={onClose} title={`${title} for ${base}/${quote} pool`}>
      <Body>
        {!userTokens.length ? (
          <Loader />
        ) : (
          <FarmingModal
            onClose={onClose}
            pool={pool}
            title={title}
            onExtend={onExtend}
          />
        )}
      </Body>
    </Modal>
  )
}
