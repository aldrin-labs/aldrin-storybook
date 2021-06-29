import { API_URL } from '@core/utils/config'

export const getCCAICirculationSupply = async () => {
  const result = await fetch(`https://${API_URL}/getCCAICirculationSupply`, {
    method: 'GET',
  }).then((data) => data.json())

  return result.supply
}
