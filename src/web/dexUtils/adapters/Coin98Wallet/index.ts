import { CommonWalletAdapter } from '../CommonWallet/index'
import { notify } from '../../notifications';

export function Coin98ExtensionAdapter(_, network) {
  const coin98 = (window as any).coin98.sol._events.CHECK_CONNECTION;
  if (coin98) {
    return new CommonWalletAdapter(coin98, network);
  }
  return {
    on: () => {},
    connect: () => {
      window.open('https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg', '_blank');
      notify({
        message: 'Coin98 Extension Error',
        description: 'Please install the Coin98 Extension for Chrome',
      });
    }
  }
}