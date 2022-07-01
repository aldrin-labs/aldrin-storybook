import { MutableRefObject, useRef } from 'react'

const useInputFocus = (): [
  MutableRefObject<HTMLInputElement | null>,
  () => void
] => {
  const htmlElRef = useRef<HTMLInputElement | null>(null)
  const setFocus = () => {
    if (htmlElRef.current) {
      htmlElRef.current.focus()
    }
  }

  return [htmlElRef, setFocus]
}

export { useInputFocus }
