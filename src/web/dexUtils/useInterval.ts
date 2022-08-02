import { useRef, useEffect, useCallback } from 'react'

export function useInterval(callback: () => any, delay: number) {
  const savedCallback = useRef(callback)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }

    if (delay !== null) {
      const id = setInterval(tick, delay)
      intervalRef.current = id
      return () => clearInterval(id)
    }

    return () => {}
  }, [delay])

  useEffect(() => {
    // clear interval on when component gets removed to avoid memory leaks
    if (intervalRef.current !== null) {
      return () => clearInterval(intervalRef.current)
    }

    return () => {}
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(savedCallback.current, delay)
    }
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }
  }, [])

  return {
    reset,
    stop,
  }
}
