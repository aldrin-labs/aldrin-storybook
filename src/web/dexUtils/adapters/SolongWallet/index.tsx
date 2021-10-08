import EventEmitter from 'eventemitter3'
import { PublicKey } from '@solana/web3.js'

export class SolongWalletAdapter extends EventEmitter {
  _providerUrl: URL

  _publicKey: any

  _onProcess: boolean

  _autoApprove: boolean

  constructor(providerUrl: string, network: string) {
    super()
    this._providerUrl = new URL(providerUrl)
    this._providerUrl.hash = new URLSearchParams({
      origin: window.location.origin,
      network,
    }).toString()
    this._autoApprove = false
    this._publicKey = null
    this._onProcess = false
  }

  get publicKey() {
    return this._publicKey
  }

  get connected() {
    return this._publicKey !== null
  }

  get autoApprove() {
    return this._autoApprove
  }

  async signTransaction(transaction: any) {
    return (window as any).solong.signTransaction(transaction)
  }

  connect = () => {
    if (this._onProcess) {
      return
    }

    if ((window as any).solong === undefined) {
      alert(
        'Please install solong wallet extension from Chrome Web Store first '
      )
      return
    }

    this._onProcess = true
    console.log('solong helper select account')
    ;(window as any).solong
      .selectAccount()
      .then((account: any) => {
        this._publicKey = new PublicKey(account)
        this.emit('connect', this._publicKey)
      })
      .catch(() => {
        this.disconnect()
      })
      .finally(() => {
        this._onProcess = false
      })
  }

  disconnect = () => {
    if (this._publicKey) {
      this._publicKey = null
      this.emit('disconnect')
    }
  }
}
