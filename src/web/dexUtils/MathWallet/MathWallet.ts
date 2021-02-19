import EventEmitter from 'eventemitter3'
import { PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'

export default class MathWallet extends EventEmitter {
  _providerUrl: URL
  _publicKey: null | any
  _autoApprove: boolean
  _popup: null | any
  _handlerAdded: boolean
  _nextRequestId: number
  _responsePromises: any
  _useInjectedInterface: boolean

  constructor(providerUrl: string, network: string) {
    super()
    this._providerUrl = new URL(providerUrl)
    this._providerUrl.hash = new URLSearchParams({
      origin: window.location.origin,
      network,
    }).toString()
    this._publicKey = null
    this._autoApprove = false
    this._popup = null
    this._handlerAdded = false
    this._nextRequestId = 1
    this._responsePromises = new Map()
    this._useInjectedInterface = false
  }

  _handleConnect = () => {
    if (!window.solana) {
      alert('Open the mathwallet plugin and switch to Solana')
      return
    }

    window.solana.getAccounts()
    .then((accounts: any[]) => {
      // TODO: Refactor --- add catch
      if (accounts && accounts.length) {
        const account = accounts[0]
        const newPublicKey = new PublicKey(account.publicKey)

        if (!this._publicKey || !this._publicKey.equals(newPublicKey)) {
          this._handleDisconnect()
          this._publicKey = newPublicKey
          // bcz mathwallet doesn't support autoApprove
          this._autoApprove = false

          this.emit('connect', this._publicKey);
        }
      }
    })
    .catch((err) => {
      this._handleDisconnect()
      alert(err.message)
    })

  }

  _handleDisconnect = () => {
    if (this._publicKey) {
      window.solana.forgetAccounts()
      .then(() => {
        this._publicKey = null
        
        this.emit('disconnect')
      })
      .catch((err) => {
        alert(err.message)
      })
    }

  }

  connect = () => {
    if (!this._handlerAdded) {
      this._handlerAdded = true

      // window.addEventListener('message', this._handleMessage)
      window.addEventListener('beforeunload', this.disconnect)
    }
    return this._handleConnect()
  }

  disconnect = () => {
    if (!window.solana) {
      alert('Open the mathwallet plugin and switch to Solana')
      return
    }

    this._handleDisconnect()
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

  signTransaction = async (transaction) => {
    if (!window.solana) {
      alert('Open the mathwallet plugin and switch to Solana')
      return
    }

    if (!this._publicKey) {
      alert('Connect your mathwallet first')
      return
    }

    const { signRawTransaction } = window.solana

    const response = await signRawTransaction(bs58.encode(transaction.serializeMessage()))

    const signature = bs58.decode(response.signature)
    const publicKey = new PublicKey(response.publicKey)
    transaction.addSignature(publicKey, signature)
    return transaction 
  }

}
