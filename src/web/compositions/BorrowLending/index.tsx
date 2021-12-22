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
import {ObligationType, WalletAccountsType, WalletReserveMapType} from '@sb/compositions/BorrowLending/Markets/types';
import {TokenInstructions} from '@project-serum/serum';
import {u192ToBN} from '@sb/dexUtils/borrow-lending/U192-converting';
import Supply from './Supply/Supply';
import {Token} from '@solana/spl-token';
import {getReserves} from '@sb/dexUtils/borrow-lending/getReserves';
import BN from "bn.js";
import {getObligation} from "@sb/dexUtils/borrow-lending/getObligation";
import Borrow from "@sb/compositions/BorrowLending/Borrow/Borrow";

type MatchParams = {
    section: string;
}

type BorrowLendingProps = {
    match: RouteComponentProps<MatchParams>
}

const BorrowLending: FC = ({match}: BorrowLendingProps) => {
    const [reservesPKs, setReservesPKs] = useState([])
    const [reserves, setReserves] = useState<any>([])
    const [obligations, setObligations] = useState<any>(null)
    const [walletAccounts, setWalletAccounts] = useState<WalletAccountsType | [] | null>(null);
    const [walletReserveMap, setWalletReserveMap] = useState<WalletReserveMapType | []>([]);
    const [userSummary, setUserSummary] = useState(null);
    const [reservesRefreshCount, setReservesRefreshCount] = useState(0);
    const [obligationDetails, setObligationDetails] = useState<ObligationType | null>(null);

    const { wallet } = useWallet()
    const connection = useConnection()

    useEffect(() => {
        handleGetReservesAccounts();
    }, [])

    useEffect(() => {
        if(wallet.publicKey) {
            loadObligationFromWallet(wallet.publicKey);
            getWalletAccounts();

            // const walletReserveMapTemp: WalletReserveMapType | [] = [];
            // reserves.forEach(reserve => {
            //     getMintFromWallet({wallet, connection, mint: reserve.collateral.mint})
            //         .then(mintResult => {
            //             // @ts-ignore
            //             walletReserveMapTemp.push({
            //                 [reserve.collateral.mint]: mintResult,
            //             })
            //         })
            // })
            //
            // setWalletReserveMap(walletReserveMapTemp)
        }
    }, [wallet.publicKey, reservesRefreshCount])

    useEffect(() => {
        const summary = {};
        let totalDepositWorth = 0;
        if(walletAccounts && walletAccounts.length > 0) {
            reserves.forEach(reserve => {
                const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
                if(tokenAccount) {
                    const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount.amount;
                    const tokenDecimals = tokenAccount?.account.data.parsed.info.tokenAmount.decimals;
                    const tokenWorth = parseInt(u192ToBN(reserve.liquidity.marketPrice).toString())/Math.pow(10, 18) * tokenAmount/Math.pow(10, tokenDecimals)/5;
                    totalDepositWorth = totalDepositWorth + tokenWorth;
                    // totalDepositWorth = parseInt(totalDepositWorth.add(tokenWorth).toString())/Math.pow(10, tokenAccount.account.data.parsed.info.tokenAmount.decimals);
                }

                const liq = reserve.liquidity
                const col = reserve.collateral
                console.log(
                    'reserveInfo',
                    {
                        availableAmount: liq.availableAmount.toString(),
                        borrowedAmount: u192ToBN(liq.borrowedAmount).toString(),
                        cumulativeBorrowRate: u192ToBN(liq.cumulativeBorrowRate).toString(),
                        marketPrice: u192ToBN(liq.marketPrice).toString(),
                        mintTotalSupply: col.mintTotalSupply.toString()
                    }
                )
            })

            summary.totalDepositWorth = totalDepositWorth;

            setUserSummary(summary)
        }
    }, [walletAccounts])

    useEffect(() => {
        if(obligations && obligations.length > 0) {
            handleGetObligation();
        }
    }, [obligations])

    const handleGetObligation = () => {
        // console.log('handleGetObligation', obligations)
        getObligation({
            wallet,
            connection,
            obligationPk: obligations[0].pubkey,
        }).then((obligation: ObligationType) => {
            setObligationDetails(obligation)
        }).catch(error => console.log(error))
    }

    const getWalletAccounts = () => {
        connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
            programId: TokenInstructions.TOKEN_PROGRAM_ID,
        }).then(tokenAccounts => {
            setWalletAccounts(tokenAccounts.value);
        })

        console.log('get all accounts')
    }

    const handleGetReservesAccounts = () => {
        getReserves({
            wallet,
            connection,
        })
            .then(reservesAccounts => {
                const tempReservesPKs = reservesAccounts.map(reserve => reserve.pubkey);
                setReservesPKs(tempReservesPKs);
                const promiseArr = [];
                reservesAccounts.forEach((reserve) => {
                    promiseArr.push(getReserve({
                        wallet,
                        connection,
                        reservePK: reserve.pubkey,
                    }));
                });
                Promise.all(promiseArr)
                    .then((values) => {

                        // Merge reserve results with PK results
                        const reservesMerged = [];
                        values.forEach((value, index) => {
                            reservesMerged.push({
                                publicKey: tempReservesPKs[index],
                                ...value,
                            })
                        })
                        setReserves(reservesMerged);
                        setReservesRefreshCount(reservesRefreshCount + 1);
                    }).catch(promiseArrError => console.log('promiseArrError', promiseArrError))
            })
            .catch(error => {
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
            let resCopy = [...res];
            resCopy.sort((a, b) => a.pubkey.toString() > b.pubkey.toString() ? 1 : -1);
            console.log('obligation list', resCopy[0].pubkey.toString())
            setObligations([resCopy[0]]);
        }).catch(error => {
            console.log('error', error)
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
                                reservesPKs={reservesPKs}
                                obligations={obligations}
                                obligationDetails={obligationDetails}
                                userSummary={userSummary}
                                walletAccounts={walletAccounts}
                                handleGetReservesAccounts={handleGetReservesAccounts}
                                handleGetObligation={handleGetObligation}
                            />
                            :
                            match.params.section === 'borrow' ?
                                <Borrow
                                    reserves={reserves}
                                    reservesPKs={reservesPKs}
                                    obligations={obligations}
                                    obligationDetails={obligationDetails}
                                    userSummary={userSummary}
                                    walletAccounts={walletAccounts}
                                    handleGetReservesAccounts={handleGetReservesAccounts}
                                    handleGetObligation={handleGetObligation}
                                />
                        : null
            }
        </>
    );
};

export default BorrowLending;
