import { PublicKey, Signer, Transaction } from '@solana/web3.js'
import { toMap } from '../../utils'
import { TransactionAndSigners, InstructionWithLamports } from './types'

const MAX_TX_SIZE = 1232 // Solana restrictions
const KEY_SIZE = 32
const MAX_LAMPORTS = 200000
const LAMPORTS_PER_SIG = 50
/**
 * Build transactions and signers from instructions list
 * Group all instructions one by one to transactions limited to 1232 bytes
 */
export const buildTransactions = (
  instructions: InstructionWithLamports[],
  feePayer: PublicKey,
  signers: Signer[] = []
): TransactionAndSigners[] => {
  const result = [
    { transaction: new Transaction(), signers: new Map<string, Signer>() },
  ]

  const lastTxKeys = new Set<string>()
  const signersByPk = toMap(signers, (s) => s.publicKey.toBase58())
  let lastTxSize = 0
  let lastTxLamports = 0

  for (let i = 0; i < instructions.length; i += 1) {
    const instruction = instructions[i]
    const instructionKeys = new Set(
      instruction.instruction.keys.map((_) => _.pubkey.toBase58())
    )

    const newKeys = [...instructionKeys].filter((ik) => !lastTxKeys.has(ik))
    const addTxSize =
      KEY_SIZE * newKeys.length + instruction.instruction.data.byteLength
    const newTxSize = lastTxSize + addTxSize

    const addLamports =
      instruction.instruction.keys.filter((k) => k.isSigner).length *
        LAMPORTS_PER_SIG +
      (instruction.lamports || 0)

    const newLamportsSize = lastTxLamports + addLamports

    if (newTxSize >= MAX_TX_SIZE || newLamportsSize >= MAX_LAMPORTS) {
      // Create new Tx, clear caches
      result.push({
        transaction: new Transaction(),
        signers: new Map<string, Signer>(),
      })
      lastTxSize = 0
      lastTxLamports = 0
      lastTxKeys.clear()
    }

    const lastTx = result[result.length - 1]

    lastTx.transaction.add(instruction.instruction)
    instruction.instruction.keys.forEach((k) => {
      if (k.isSigner) {
        const sigKey = k.pubkey.toBase58()
        const signer = signersByPk.get(sigKey)
        if (!signer && !k.pubkey.equals(feePayer)) {
          throw new Error(`No private key for signer ${sigKey}`)
        }
        if (signer) {
          lastTx.signers.set(sigKey, signer)
        }
      }
    })

    lastTxSize += addTxSize
    lastTxLamports += addLamports
    newKeys.forEach((nk) => lastTxKeys.add(nk))
  }

  return result.map((t) => ({
    transaction: t.transaction,
    signers: [...t.signers.values()],
  }))
}
