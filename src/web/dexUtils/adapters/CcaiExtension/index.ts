import Wallet from '@project-serum/sol-wallet-adapter';
import { notify } from '../../notifications';

export function CcaiExtensionAdapter(_, network) {
  const ccai = (window as any).ccai;
  if (ccai) {
    return new Wallet(ccai, network);
  }

  return {
    on: () => {},
    connect: () => {
      window.open('https://chrome.google.com/webstore/detail/cryptocurrenciesai-wallet/oomlbhdllfeiglglhhaacafbkkbibhel', '_blank');
      notify({
        message: 'Aldrin Extension Error',
        description: 'Please install the Aldrin Extension for Chrome',
      });
    }
  }
}