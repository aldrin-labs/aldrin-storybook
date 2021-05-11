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
      notify({
        message: 'Ccai Extension Error',
        description: 'Please install the Ccai Extension for Chrome',
      });
    }
  }
}