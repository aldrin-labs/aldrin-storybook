import React, { useState } from 'react'

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

export const PoolInfo = () => {
  const [isLaunchFarmingModalOpen, setIsLaunchFarmingModalOpen] =
    useState(false)
  const [isBoostAPRModalOpen, setIsBoostAPRModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [needReschedulePool, setNeedReschedulePool] = useState(false)
  const [needScheduleNewFarming, scheduleNewFarming] = useState(false)

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
        arrow={false}
        open={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
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
