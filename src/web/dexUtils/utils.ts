import { useCallback, useEffect, useRef, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { MASTER_BUILD } from '@core/utils/config'

export function isValidPublicKey(key: string): boolean {
  if (!key) {
    return false
  }
  try {
    // eslint-disable-next-line no-new
    new PublicKey(key)
    return true
  } catch {
    return false
  }
}

export const CCAI_MINT: string = 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp'

export const CCAIProviderURL = MASTER_BUILD
  ? 'https://wallet.aldrin.com'
  : 'https://develop.wallet.cryptocurrencies.ai/'

export const CCAIListingTime = 1623333600

export const isCCAITradingEnabled = () => Date.now() / 1000 > CCAIListingTime

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const percentFormat = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const encode = (data: { [c: string]: any }) => {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

export function floorToDecimal(value: number, decimals: number) {
  return decimals ? Math.floor(value * 10 ** decimals) / 10 ** decimals : value
}

export function roundToDecimal(value: number, decimals: number) {
  return decimals ? Math.round(value * 10 ** decimals) / 10 ** decimals : value
}

export function getUniqueListBy(arr: any[], key: string): any[] {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

export function getDecimalCount(value: number) {
  // includes e-7
  if (value <= 0.00000001) return 8
  if (value <= 0.0000001) return 7
  if (!Number.isNaN(value) && Math.floor(value) !== value && !!value)
    return value.toString().split('.')[1].length || 0
  return 0
}

export function useLocalStorageState<T>(
  key: string,
  defaultState: T,
  setIfNotChanged = false
) {
  const [state, setState] = useState(() => {
    // NOTE: Not sure if this is ok
    const storedState = localStorage.getItem(key)
    if (storedState) {
      return JSON.parse(storedState)
    }
    return defaultState
  })

  const setLocalStorageState = useCallback(
    (newState) => {
      const changed = state !== newState
      if (!changed && !setIfNotChanged) {
        return
      }
      setState(newState)
      if (newState === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newState))
      }
    },
    [state, key, setIfNotChanged]
  )

  return [state, setLocalStorageState]
}

export function useEffectAfterTimeout(effect: () => any, timeout: number) {
  useEffect(() => {
    const handle = setTimeout(effect, timeout)
    return () => clearTimeout(handle)
  })
}

interface Emitter {
  on: (eventName: string, callback: () => void) => void
  removeListener: (eventName: string, callback: () => void) => void
}

export function useListener(emitter: Emitter, eventName: string) {
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const listener = () => forceUpdate((i) => i + 1)
    emitter.on(eventName, listener)
    return () => emitter.removeListener(eventName, listener)
  }, [emitter, eventName])
}

export function abbreviateAddress(address: PublicKey) {
  const base58 = address.toBase58()
  return `${base58.slice(0, 4)}…${base58.slice(-4)}`
}

export function useRefEqual<T>(
  value: T,
  areEqual: (oldValue: T, newValue: T) => boolean
): T {
  const prevRef = useRef<T>(value)
  if (prevRef.current !== value && !areEqual(prevRef.current, value)) {
    prevRef.current = value
  }
  return prevRef.current
}

export function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index
}

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined
}
