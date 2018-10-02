import { formatNumberToUSFormat } from './PortfolioTableUtils'

describe('Format number to US format function', () => {
  it('for number 1000', () => {
    expect(formatNumberToUSFormat(1000)).toBe('1,000')
  })
  it('for number 1 000 000.', () => {
    expect(formatNumberToUSFormat(1000000)).toBe('1,000,000')
  })
  it('for number 1 000 000 000', () => {
    expect(formatNumberToUSFormat(1000000000)).toBe('1,000,000,000')
  })
  it('for string 1000', () => {
    expect(formatNumberToUSFormat('1000')).toBe('1,000')
  })
  it('for string 1 000 000', () => {
    expect(formatNumberToUSFormat('1000000')).toBe('1,000,000')
  })
  it('for string 1 000 000 000', () => {
    expect(formatNumberToUSFormat('1000000000')).toBe('1,000,000,000')
  })
  it('for float number 1 000 000 000', () => {
    expect(formatNumberToUSFormat(1000000000.9321312)).toBe('1,000,000,000.9321312')
  })
  it('for float string-number 1 000.10', () => {
    expect(formatNumberToUSFormat('1000.10')).toBe('1,000.10')
  })
  it('for float minumum number 0.0321312313', () => {
    expect(formatNumberToUSFormat(0.0321312313)).toBe('0.0321312313')
  })
  it('for float number 2383.18734781', () => {
    expect(formatNumberToUSFormat(2383.18734781)).toBe('2,383.18734781')
  })
  it('for float string-number 123499.11', () => {
    expect(formatNumberToUSFormat('123499.11')).toBe('123,499.11')
  })
})
