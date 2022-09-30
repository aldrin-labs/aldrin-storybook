import { TokenInfo } from '@aldrin_exchange/swap_hook'
import React, { useState } from 'react'

import { Pool } from '@sb/dexUtils/amm/types'

import { getTokenDataByMint } from '@core/solana'

import { RootRow } from '../../index.styles'
import { BoostAPRModal } from '../Popups/BoostAPR'
import { DepositLiquidity } from '../Popups/DepositLiquidity'
import { EditModal } from '../Popups/EditPopup'
import { LaunchFarmingModal } from '../Popups/LaunchNewFarming'
import { RescheduleModal } from '../Popups/RescheduleFarming'
import { LaunchedPool } from './components/LaunchedPool'
import { NotLaunchedPool } from './components/NotLaunchedPoolRow'

const userPools = [
  {
    isPoolLaunched: false,
    widthrawEnabled: false,
    isFarmingActive: false,
    isNextFarmingScheduled: false,
  },
  {
    isPoolLaunched: true,
    widthrawEnabled: false,
    isFarmingActive: true,
    isNextFarmingScheduled: false,
  },
  {
    isPoolLaunched: true,
    widthrawEnabled: true,
    isFarmingActive: false,
    isNextFarmingScheduled: false,
  },
  {
    isPoolLaunched: true,
    widthrawEnabled: false,
    isFarmingActive: true,
    isNextFarmingScheduled: true,
  },
  {
    isPoolLaunched: true,
    widthrawEnabled: false,
    isFarmingActive: false,
    isNextFarmingScheduled: true,
  },
]

export const PoolInfo = ({
  pool,
  allTokensData,
}: {
  pool: Pool
  allTokensData: TokenInfo[]
}) => {
  const [isLaunchFarmingModalOpen, setIsLaunchFarmingModalOpen] =
    useState(false)
  const [isBoostAPRModalOpen, setIsBoostAPRModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [needReschedulePool, setNeedReschedulePool] = useState(false)
  const [needScheduleNewFarming, scheduleNewFarming] = useState(false)

  const {
    address: userTokenAccountA,
    amount: maxBaseAmount,
    decimals: baseTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    pool.account.reserves[0].mint.toString()
    // selectedBaseTokenAddressFromSeveral
  )

  const {
    address: userTokenAccountB,
    amount: maxQuoteAmount,
    decimals: quoteTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    pool.account.reserves[1].mint.toString()
    // selectedQuoteTokenAddressFromSeveral
  )

  return (
    <>
      {userPools.map((pool) => (
        <RootRow margin="30px 0 30px 0">
          {!pool.isPoolLaunched && (
            <NotLaunchedPool
              setIsRescheduleModalOpen={setIsRescheduleModalOpen}
              setNeedReschedulePool={setNeedReschedulePool}
            />
          )}
          {pool.isPoolLaunched && (
            <LaunchedPool
              setIsLaunchFarmingModalOpen={setIsLaunchFarmingModalOpen}
              setIsBoostAPRModalOpen={setIsBoostAPRModalOpen}
              setIsDepositModalOpen={setIsDepositModalOpen}
              setIsRescheduleFarmingModalOpen={setIsRescheduleModalOpen}
              scheduleNewFarming={scheduleNewFarming}
              setIsEditModalOpen={setIsEditModalOpen}
              poolInfo={pool}
            />
          )}
        </RootRow>
      ))}
      <LaunchFarmingModal
        open={isLaunchFarmingModalOpen}
        onClose={() => setIsLaunchFarmingModalOpen(false)}
        scheduleNewFarming={needScheduleNewFarming}
      />
      <BoostAPRModal
        open={isBoostAPRModalOpen}
        onClose={() => setIsBoostAPRModalOpen(false)}
      />
      <DepositLiquidity
        needBlur
        arrow={false}
        open={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        pool={pool}
        userTokenAccountA={userTokenAccountA}
        userTokenAccountB={userTokenAccountB}
        baseTokenDecimals={baseTokenDecimals}
        quoteTokenDecimals={quoteTokenDecimals}
        maxBaseAmount={maxBaseAmount}
        maxQuoteAmount={maxQuoteAmount}
      />
      <RescheduleModal
        open={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        isPool={needReschedulePool}
      />
      <EditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  )
}
