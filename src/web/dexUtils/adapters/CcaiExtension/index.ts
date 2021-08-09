import { CommonWalletAdapter } from '../CommonWallet/index'
import { notify } from '../../notifications';

export function CcaiExtensionAdapter(_, network) {
  const ccai = (window as any).ccai;
  if (ccai) {
    return new CommonWalletAdapter(ccai, network);
  }

  return {
    on: () => {},
    connect: () => {
      window.open('https://chrome.google.com/webstore/detail/cryptocurrenciesai-wallet/oomlbhdllfeiglglhhaacafbkkbibhel', '_blank');
      notify({
        message: 'Ccai Extension Error',
        description: 'Please install the Ccai Extension for Chrome',
      });
    }
  }
}