import { useRef, useEffect } from 'react'

export function useInterval(callback: () => any, delay: number) {
  const savedCallback = useRef<typeof callback>(null)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const cb = savedCallback.current
      if (cb) {
        cb()
      }
    }

    const id = setInterval(tick, delay)
    return () => {
      clearInterval(id)
    }
  }, [delay])
}
