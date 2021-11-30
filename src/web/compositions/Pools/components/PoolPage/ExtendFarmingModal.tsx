import React from 'react'
import { Modal } from '@sb/components/Modal'
import { PoolInfo } from '../../index.types'
import { FarmingForm } from '../Popups/CreatePool/FarmingForm'
import { useFormik, FormikProvider } from 'formik'
import { WithFarming } from '../Popups/CreatePool/types'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { TokenInfo } from '@sb/dexUtils/types'
import { Loader } from '@sb/components/Loader/Loader'
import { Body, Footer } from '../Popups/CreatePool/styles'
import { Button } from '../../../../components/Button'

interface ExtendFarmingModalProps {
  onClose: () => void
  pool: PoolInfo
}

interface FarmingModalProps extends ExtendFarmingModalProps {
  userTokens: TokenInfo[]
}

const FarmingModal: React.FC<FarmingModalProps> = (props) => {
  const { userTokens, onClose } = props

  const tokens: Token[] = userTokens.map((ut) => ({
    mint: ut.mint,
    account: ut.address,
    balance: ut.amount,
  }))
    .sort((a, b) => a.mint.localeCompare(b.mint))


  const form = useFormik<WithFarming>({
    validateOnMount: true,
    initialValues: {
      farming: {
        token: tokens[0],
        vestingEnabled: true,
        tokenAmount: 0,
        farmingPeriod: 14,
        vestingPeriod: 7,
      }
    },
    onSubmit: async (values) => {
      console.log('Values: ', values)
    },
    validate: async (values) => {
      if (values.farming.vestingEnabled && !((values.farming.vestingPeriod || 0) > 0)) {
        return { farming: { vestingPeriod: 'Please enter a valid vesting period.' } }
      }

      return
    },
  })

  const { values: { farming } } = form
  const farmingRewardPerDay = farming.farmingPeriod > 0 ? farming.tokenAmount / farming.farmingPeriod : 0
  const farmingRewardFormatted = stripByAmount(farmingRewardPerDay)


  return (
    <FormikProvider value={form}>

      <form onSubmit={form.handleSubmit}>
        <FarmingForm
          farmingRewardFormatted={farmingRewardFormatted}
          tokens={tokens}
          userTokens={userTokens}
        />

        <Footer>
          <Button $padding="lg" type="button" onClick={onClose} $variant="outline-white">Cancel</Button>
          <Button disabled={!form.isValid} type="submit">Extend</Button>

        </Footer>
      </form>

    </FormikProvider >
  )
}

export const ExtendFarmingModal: React.FC<ExtendFarmingModalProps> = (props) => {

  const [userTokens, refreshUserTokens] = useUserTokenAccounts()


  return (
    <Modal
      open
      onClose={props.onClose}
      title="Extend Farming"
    >
      <Body>
        {!userTokens.length ?
          <Loader /> :
          <FarmingModal userTokens={userTokens} onClose={props.onClose} pool={props.pool} />
        }
      </Body>
    </Modal>
  )

}