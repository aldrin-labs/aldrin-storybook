import { CommonWalletAdapter } from '../CommonWallet/index'
import { notify } from '../../notifications'

const { sollet } = window as any

export class SolletExtensionAdapter extends CommonWalletAdapter {
  constructor(provider: unknown, protected _network: string) {
    super(sollet, _network)
  }

  connect = async (): Promise<void> => {
    window.open(
      'https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno',
      '_blank'
    )
    notify({
      message: 'Sollet Extension Error',
      description: 'Please install the Sollet Extension for Chrome',
    })
  }
}
