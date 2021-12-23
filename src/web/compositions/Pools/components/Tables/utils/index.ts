export const symbolIncludesSearch = (
  symbol: string,
  searchValue: string
): boolean => {
  if (searchValue) {
    const updatedSearchValue = searchValue
      .replace('/', '_')
      .replace(' ', '_')
      .replace('-', '_')
      .replace('_', '')

    return symbol.toLowerCase().includes(updatedSearchValue.toLowerCase())
  }

  return true
}

export * from './poolsTable'
