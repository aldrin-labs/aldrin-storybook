import React, { useState, useEffect, useLayoutEffect } from 'react'

type UseStateWithCallbackFunction = <T>(
  initialState: T,
  callback: (state: T) => void
) => [T, React.Dispatch<T>]

const useStateWithCallback: UseStateWithCallbackFunction = (
  initialState,
  callback
) => {
  const [state, setState] = useState(initialState)

  useEffect(() => callback(state), [state, callback])

  return [state, setState]
}

const useStateWithCallbackInstant: UseStateWithCallbackFunction = (
  initialState,
  callback
) => {
  const [state, setState] = useState(initialState)

  useLayoutEffect(() => callback(state), [state, callback])

  return [state, setState]
}

export { useStateWithCallbackInstant }

export default useStateWithCallback
