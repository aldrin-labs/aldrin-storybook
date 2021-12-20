import EventEmitter from 'eventemitter3'
import { PublicKey, Transaction } from '@solana/web3.js'
import bs58 from 'bs58'

import { WalletAdapter } from '@sb/dexUtils/types'
import { notify } from '../../notifications'

interface SlopeSignResponse {
  msg: 'ok' | 'Cancelled'
  data: {
    publicKey: string
    signature: string // bs58
  }
}

interface SlopeSignaturesResponse {
  msg: 'ok' | 'Cancelled'
  data: {
    publicKey: string
    signatures: string[] // bs58
  }
}
interface SlopeConnectResponse {
  msg: 'ok' | 'Cancelled'
  data: {
    publicKey: string
    autoApprove: boolean
  }
}

interface SlopeProvider {
  publicKey?: PublicKey
  isConnected?: boolean
  autoApprove?: boolean
  signTransaction: (transaction: string) => Promise<SlopeSignResponse>
  signAllTransactions: (
    transactions: string[]
  ) => Promise<SlopeSignaturesResponse>
  connect: () => Promise<SlopeConnectResponse>
  disconnect: () => Promise<void>
}

declare global {
  interface Window {
    Slope?: {
      new (): SlopeProvider
    }
  }
}

export class SlopeWalletAdapter extends EventEmitter implements WalletAdapter {
  private _provider: SlopeProvider | undefined

  private _publicKey: PublicKey | undefined = undefined

  private _autoApprove = false

  private _connected = false

  constructor() {
    super()
    this.connect = this.connect.bind(this)
    if (window.Slope) {
      this._provider = new window.Slope()
    }
  }

  private _handleConnect = (...args) => {
    this.emit('connect', ...args)
  }

  private _handleDisconnect = (...args) => {
    this.emit('disconnect', ...args)
  }

  get publicKey() {
    return this._publicKey
  }

  get connected() {
    return this._connected
  }

  get autoApprove() {
    return this._autoApprove
  }

  async signAllTransactions(
    transactions: Transaction[]
  ): Promise<Transaction[]> {
    if (!this._provider) {
      return transactions
    }

    const { msg, data } = await this._provider.signAllTransactions(
      transactions.map((tx) => bs58.encode(tx.serializeMessage()))
    )

    if (msg === 'ok') {
      transactions.forEach((tx, idx) =>
        tx.addSignature(
          new PublicKey(data.publicKey),
          bs58.decode(data.signatures[idx])
        )
      )
    }
    return transactions
  }

  async signTransaction(transaction: Transaction) {
    if (!this._provider) {
      return transaction
    }

    const { msg, data } = await this._provider.signTransaction(
      bs58.encode(transaction.serializeMessage())
    )

    if (msg === 'ok') {
      transaction.addSignature(
        new PublicKey(data.publicKey),
        bs58.decode(data.signature)
      )
    }

    return transaction
  }

  async connect() {
    if (!this._provider) {
      window.open('https://slope.finance/', '_blank')
      notify({
        message: 'Connection Error',
        description: 'Please install Slope wallet',
      })
      return
    }

    const { msg, data } = await this._provider.connect()
    if (msg === 'ok') {
      this._publicKey = new PublicKey(data.publicKey)
      this._autoApprove = data.autoApprove
      this._connected = true
      this._handleConnect(data)
    }
  }

  disconnect() {
    if (this._provider) {
      this._publicKey = undefined
      this._connected = false
      this._autoApprove = false
      this._handleDisconnect()
      this._provider.disconnect()
    }
  }
}
