import { useCallback, useEffect, useRef, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { MASTER_BUILD } from '@core/utils/config'

export function isValidPublicKey(key) {
  if (!key) {
    return false
  }
  try {
    new PublicKey(key)
    return true
  } catch {
    return false
  }
}

export const CCAI_MINT: string = "E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp"

export const CCAIProviderURL = MASTER_BUILD
  ? 'https://wallet.cryptocurrencies.ai'
  : 'https://develop.wallet.cryptocurrencies.ai'

export const CCAIListingTime = 1623333600

export const isCCAITradingEnabled = () => Date.now() / 1000 > CCAIListingTime 

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const percentFormat = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const encode = (data) => {
  return Object.keys(data)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
    )
    .join('&')
}

export function floorToDecimal(value, decimals) {
  return decimals ? Math.floor(value * 10 ** decimals) / 10 ** decimals : value
}

export function roundToDecimal(value, decimals) {
  return decimals ? Math.round(value * 10 ** decimals) / 10 ** decimals : value
}

export function getDecimalCount(value) {
  // includes e-7
  if (value <= 0.00000001) return 8
  if (value <= 0.0000001) return 7
  if (!isNaN(value) && Math.floor(value) !== value && !!value)
    return value.toString().split('.')[1].length || 0
  return 0
}

export function useLocalStorageState(key, defaultState = null, setIfNotChanged = false) {
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

export function useEffectAfterTimeout(effect, timeout) {
  useEffect(() => {
    const handle = setTimeout(effect, timeout)
    return () => clearTimeout(handle)
  })
}

export function useListener(emitter, eventName) {
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const listener = () => forceUpdate((i) => i + 1)
    emitter.on(eventName, listener)
    return () => emitter.removeListener(eventName, listener)
  }, [emitter, eventName])
}

export function abbreviateAddress(address) {
  const base58 = address.toBase58()
  return base58.slice(0, 4) + '…' + base58.slice(-4)
}

export function isEqual(obj1, obj2, keys) {
  if (!keys && Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }
  keys = keys || Object.keys(obj1)
  for (const k of keys) {
    if (obj1[k] !== obj2[k]) {
      // shallow comparison
      return false
    }
  }
  return true
}

export function useRefEqual<T>(
  value: T,
  areEqual: (oldValue: T, newValue: T) => boolean,
): T {
  const prevRef = useRef<T>(value);
  if (prevRef.current !== value && !areEqual(prevRef.current, value)) {
    prevRef.current = value;
  }
  return prevRef.current;
}