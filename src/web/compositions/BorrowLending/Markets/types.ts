import {AccountInfo, PublicKey} from '@solana/web3.js';

export type MarketCompType = {asset: string, value: number};

export type WalletAccountType = {[x: number]: void | { pubkey: PublicKey, account: AccountInfo<any> }};

export type WalletAccountsType = WalletAccountType[];

export type WalletReserveMapItemType = {
    [key: string]: {[x: number]: void | { pubkey: PublicKey, account: AccountInfo<any> }}
}

export type WalletReserveMapType = WalletReserveMapItemType[];

export type ObligationType = {
    [key: string]: any;
}
