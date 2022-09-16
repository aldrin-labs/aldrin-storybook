import React, { useState } from 'react'
import { RootRow } from '../../index.styles'
import { LaunchFarmingModal } from '../Popups/LaunchNewFarming'
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
const [isLaunchFarmingModalOpen, setIsLaunchFarmingModalOpen] = useState(false)

  return (
    <>
      {userPools.map((pool) => (
        <RootRow margin="30px 0 0 0">
          {!pool.isPoolLaunched && <NotLaunchedPool />}
          {pool.isPoolLaunched && <LaunchedPool setIsLaunchFarmingModalOpen={setIsLaunchFarmingModalOpen} poolInfo={pool} />}
        </RootRow>
      ))}
      <LaunchFarmingModal open={isLaunchFarmingModalOpen} onClose={()=>setIsLaunchFarmingModalOpen(false)}/>
    </>
  )
}
