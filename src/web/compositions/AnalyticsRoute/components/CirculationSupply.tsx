import { formatNumberToUSFormat } from '@core/utils/PortfolioTableUtils'
import React, { useEffect, useState } from 'react'
import { API_URL } from '@core/utils/config'

export const CCAICirculationSupply = ({}) => {
  const [circulationSupply, setCirculationSupply] = useState<number>(0)

  useEffect(() => {
    fetch(`https://${API_URL}/getCCAICirculationSupply`, {
      method: 'GET',
    })
      .then((data) => data.json())
      .then((data) => setCirculationSupply(data.supply))
      .catch(function(error) {
        console.log('Request failed', error)
      })
  }, [])
  return (
    <span style={{ marginRight: '0.5rem' }}>
      {formatNumberToUSFormat(circulationSupply.toFixed(0))}
    </span>
  )
}
