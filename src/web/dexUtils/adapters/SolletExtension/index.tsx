import { CommonWalletAdapter } from '../CommonWallet/index'
import { notify } from '../../notifications';

export function SolletExtensionAdapter(_, network) {
  const sollet = (window as any).sollet;
  if (sollet) {
    return new CommonWalletAdapter(sollet, network);
  }
  return {
    on: () => {},
    connect: () => {
      window.open('https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno', '_blank');
      notify({
        message: 'Sollet Extension Error',
        description: 'Please install the Sollet Extension for Chrome',
      });
    }
  }
}