import React, {FC, useEffect, useState} from 'react';
import { PublicKey } from '@solana/web3.js';
import {Content, Page} from '@sb/components/Layout';
import {useWallet} from '@sb/dexUtils/wallet';
import {useConnection} from '@sb/dexUtils/connection';
import {initReserve} from '@sb/dexUtils/borrow-lending/initReserve';
import {getLendingMarket} from '@sb/dexUtils/borrow-lending/getLendingMarket';
import {getReserve} from '@sb/dexUtils/borrow-lending/getReserve';

import Markets from './Markets/Markets';

const BorrowLending: FC = () => {
    const [reserves, setReserves] = useState<any>([])
    const { wallet } = useWallet()
    const connection = useConnection()

    useEffect(() => {
        lendingMarket();
    }, [])

    const lendingMarket = async () => {
        const reserve = getReserve({
            wallet,
            connection,
        }).then(res => {
            setReserves([
                ...reserves,
                res,
            ])
        }).catch(error => {
            console.log('error')
        });
    }

    if(reserves.length === 0) {
        return null;
    }

    return (
        <Markets reserves={reserves} />
    );
};

export default BorrowLending;
