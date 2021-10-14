declare module '*.svg' {
  const content: any
  export default content
}

declare module 'immutable-tuple' {
  export interface NodeTuple {}
  const tuple: (...args: any) => NodeTuple
  export default tuple
}
