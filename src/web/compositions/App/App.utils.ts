export const getSearchParamsObject = ({ search }: { search: string }): any => {
  const locationArrayOfParams = search.split('&')
  const objectParams: any = locationArrayOfParams.reduce((acc: any, el) => {
    const kv = el.split('=')
    kv[0] = kv[0].replace('?', '')
    acc[kv[0]] = kv[1]

    return acc
  }, {})

  return objectParams
}
