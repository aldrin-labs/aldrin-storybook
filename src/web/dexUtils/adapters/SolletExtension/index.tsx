import Wallet from '@project-serum/sol-wallet-adapter';
import { SolletExtensionURL } from '@sb/dexUtils/utils';
import { notify } from '../../notifications';

export function SolletExtensionAdapter(_, network) {
  const sollet = (window as any).sollet;
  if (sollet) {
    return new Wallet(sollet, network);
  }

  return {
    on: () => {},
    connect: () => {
      window.open(SolletExtensionURL, '_blank');
      notify({
        message: 'Sollet Extension Error',
        description: 'Please install the Sollet Extension for Chrome',
      });
    }
  }
}