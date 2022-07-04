import { useFarmersAccountInfo } from './useFarmersAccountInfo'

export const useFarmer = (farm?: string) => {
  const { data } = useFarmersAccountInfo()
  return data?.get(farm || '')
}
