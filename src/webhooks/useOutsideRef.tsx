import { RefObject, useEffect } from 'react'

type UseOutsideRefParams = {
  ref: RefObject<any>
  callback: () => void
}

const useOutsideRef = (params: UseOutsideRefParams) => {
  const { ref, callback } = params

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}

export { useOutsideRef }
