import React, {FC, useEffect, useState} from 'react';
import {RouteComponentProps } from 'react-router-dom';
import {useWallet} from '@sb/dexUtils/wallet';
import {useConnection} from '@sb/dexUtils/connection';
import {getReserve} from '@sb/dexUtils/borrow-lending/getReserve';

import Markets from './Markets/Markets';
import Dashboard from './Dashboard/Dashboard';
import {loadAccountsFromProgram} from '@sb/dexUtils/common/loadAccountsFromProgram';
import {PublicKey} from '@solana/web3.js';
import {BORROW_LENDING_PROGRAM_ADDRESS} from '@sb/dexUtils/ProgramsMultiton/utils';
import {ProgramsMultiton} from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton';
import {getMintFromWallet} from '@sb/dexUtils/borrow-lending/getMintFromWallet';
import {WalletAccountsType, WalletReserveMapType} from '@sb/compositions/BorrowLending/Markets/types';
import {TokenInstructions} from '@project-serum/serum';
import {u192ToBN} from '@sb/dexUtils/borrow-lending/U192-converting';
import Supply from "./Supply/Supply";

type MatchParams = {
    section: string;
}

type BorrowLendingProps = {
    match: RouteComponentProps<MatchParams>
}

const BorrowLending: FC = ({match}: BorrowLendingProps) => {
    const [reserves, setReserves] = useState<any>([])
    const [obligations, setObligations] = useState<any>(null)
    const [walletAccounts, setWalletAccounts] = useState<WalletAccountsType | [] | null>(null);
    const [walletReserveMap, setWalletReserveMap] = useState<WalletReserveMapType | []>([]);
    const [userSummary, setUserSummary] = useState(null);
    const [lendingMarketRefreshCount, setLendingMarketRefreshCount] = useState(0);

    const { wallet } = useWallet()
    const connection = useConnection()

    useEffect(() => {
        lendingMarket();
    }, [])

    useEffect(() => {
        if(wallet.publicKey) {
            loadObligationFromWallet(wallet.publicKey.toBase58());

            const walletReserveMapTemp: WalletReserveMapType | [] = [];
            reserves.forEach(reserve => {
                getMintFromWallet({wallet, connection, mint: reserve.collateral.mint})
                    .then(mintResult => {
                        // @ts-ignore
                        walletReserveMapTemp.push({
                            [reserve.collateral.mint]: mintResult,
                        })
                    })
            })

            setWalletReserveMap(walletReserveMapTemp)

            getWalletAccounts();
        }
    }, [wallet.publicKey, lendingMarketRefreshCount])

    useEffect(() => {
        let summary = {};
        let totalDeposit = 0;
        if(walletAccounts && walletAccounts.length > 0) {
            reserves.forEach(reserve => {
                const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
                if(tokenAccount) {
                    const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
                    const tokenWorth = parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()) * tokenAmount;
                    totalDeposit = totalDeposit + tokenWorth;
                }
            })

            summary.totalDeposit = totalDeposit;

            setUserSummary(summary)
        }
    }, [walletAccounts])

    const getWalletAccounts = () => {
        connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
            programId: TokenInstructions.TOKEN_PROGRAM_ID,
        }).then(tokenAccounts => {
            setWalletAccounts(tokenAccounts.value);
        })
    }

    const lendingMarket = () => {
        console.log(wallet, 'mywallet')
        const reserve = getReserve({
            wallet,
            connection,
        }).then(res => {
            setReserves([res])

            setLendingMarketRefreshCount(lendingMarketRefreshCount + 1);
        }).catch(error => {
            console.log('error')
        });
    }

    const loadObligationFromWallet = (walletPubKey: PublicKey) => {
        const program = ProgramsMultiton.getProgramByAddress({
            wallet,
            connection,
            programAddress: BORROW_LENDING_PROGRAM_ADDRESS,
        })

        const hashPrefixSize = 1;
        const lastUpdateSize = 16;
        const pubkeySize = 32;
        const offset = hashPrefixSize + lastUpdateSize + pubkeySize;
        const config = {
            filters: [
                {memcmp: { offset, bytes: walletPubKey.toString() }},
                {dataSize: program.account.obligation.size },
            ],
        };

        loadAccountsFromProgram({
            connection,
            filters: config.filters,
            programAddress: BORROW_LENDING_PROGRAM_ADDRESS,
        }).then(res => {
            setObligations(res);
        }).catch(error => {
            console.log('error')
        });
    }

    if(reserves.length === 0) {
        return null;
    }

    return (
        <>
            {
                match.params.section === 'markets' ?
                    <Markets reserves={reserves} />
                    :
                    match.params.section === 'dashboard' ?
                        <Dashboard
                            reserves={reserves}
                            obligations={obligations}
                            userSummary={userSummary}
                            walletAccounts={walletAccounts}
                        />
                        :
                        match.params.section === 'supply' ?
                            <Supply
                                reserves={reserves}
                                obligations={obligations}
                                userSummary={userSummary}
                                walletAccounts={walletAccounts}
                                lendingMarket={lendingMarket}
                            />
                        : null
            }
        </>
    );
};

export default BorrowLending;
