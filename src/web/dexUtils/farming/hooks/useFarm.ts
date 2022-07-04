import { useFarmsInfo } from './useFarmsInfo'

export const useFarm = (stakeMint: string) => {
  const { data } = useFarmsInfo()
  return data?.get(stakeMint)
}
