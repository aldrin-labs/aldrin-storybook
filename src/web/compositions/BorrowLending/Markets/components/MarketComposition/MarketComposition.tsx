import React from 'react';

import {Block, BlockContent} from '@sb/components/Block';
import {MarketCompType} from '../../types';

type MarketCompositionProps = {
    values: MarketCompType[]
}

const MarketComposition = ({values}: MarketCompositionProps) => {

    const renderReservesValues = (reservesValues: MarketCompositionProps['values']) => {
        return reservesValues.map((value) => {
            return (
                <li key={value.asset}>
                    <a
                        href={`https://explorer.solana.com/address/${value.asset}`}
                        target="_blank"
                    >
                        {value.asset}
                    </a>
                    <span>{value.value % 1 !== 0 ? value.value.toFixed(2) : value.value}%</span>
                </li>
            )
        })
    }

    return (
        <Block>
            <BlockContent>
                Market Composition
                <ul>
                    {renderReservesValues(values)}
                </ul>
            </BlockContent>
        </Block>
    );
};

export default MarketComposition;
