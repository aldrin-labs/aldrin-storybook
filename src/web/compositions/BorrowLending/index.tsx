import React, {useEffect} from 'react';
import { PublicKey } from '@solana/web3.js';
import {Content, Page} from '@sb/components/Layout';
import {loadBorrowLendingProgram} from './utils/loadProgram';
import {useWallet} from '@sb/dexUtils/wallet';
import {useConnection} from '@sb/dexUtils/connection';
import {initReserve} from '@sb/dexUtils/borrow-lending/initReserve';
import {getLendingMarket} from '@sb/dexUtils/borrow-lending/getLendingMarket';

import Markets from './Markets/Markets';

const BorrowLending = () => {
    const { wallet } = useWallet()
    const connection = useConnection()

    useEffect(() => {
        lendingMarket()
    }, [])

    const lendingMarket = async () => {
        try {
            console.log(connection, "connection")
            const lendingMarket = getLendingMarket({
                wallet,
                connection,
            });

            console.log(lendingMarket, 'lendingMarket')
            // const result = initReserve({
            //     wallet,
            //     connection,
            // });
            // console.log(result)
        } catch (e) {
            console.log('errorc', e)
        }
    }

    return (
        <Page>
            <Content>
                <Markets />
            </Content>
        </Page>
    );
};

export default BorrowLending;
