import { MemcmpFilter } from '@solana/web3.js'

export const memCmpFiltersToBuf = (filters: MemcmpFilter[]): Buffer => {
  const bufs = filters.map((f) => ({ offset: f.memcmp.offset, data: new Buffer(f.memcmp.bytes) }))
  const bufSize = Math.max(...bufs.map((f) => f.offset + f.data.byteLength))
  const buffer = Buffer.alloc(bufSize)
  bufs.forEach((f) => buffer.fill(f.data, f.offset))

  console.log('buf: ', new Buffer("Tip5wgv8BjhBGujrNZSvhTSZ8eo6KLRM5i1xSq3n5e5"), filters, Buffer.concat([Buffer.from([1234]), buffer]), buffer)
  return buffer
}