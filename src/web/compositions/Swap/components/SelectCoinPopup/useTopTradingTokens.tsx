import useSWR from 'swr'

export const useTopTradingTokens = (): [string[], () => Promise<string[]>] => {
  const fetcher = async () => {
    const topTokens = await (
      await fetch('https://cache.jup.ag/top-tokens')
    ).json()

    return topTokens
  }

  const { data, mutate } = useSWR('topTradingTokens', fetcher)

  return [data || [], mutate]
}
