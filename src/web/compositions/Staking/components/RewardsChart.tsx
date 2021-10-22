import React, { useEffect } from 'react'
import { StretchedBlock } from '@sb/components/Layout'

const RewardsChart = ({ id, title }: { id: string; title: string }) => {
  const data =
    getTotalVolumeLockedHistoryQuery?.getTotalVolumeLockedHistory?.volumes

  useEffect(() => {
    createTotalVolumeLockedChart({ theme, id, data })

    // @ts-ignore - we set it in create chart function above
    return () => window[`TotalVolumeLockedChart-${id}`].destroy()
  }, [id])

  return (
    <>
      <StretchedBlock margin={'0 2rem 0 2rem'} style={{ flexWrap: 'nowrap' }}>
        <WhiteTitle
          style={{ marginRight: '2rem' }}
          theme={theme}
          color={theme.palette.white.text}
        >
          {title}
        </WhiteTitle>
      </StretchedBlock>
      <ChartContainer>
        <canvas id="TotalVolumeLockedChart"></canvas>
      </ChartContainer>
    </>
  )
}
