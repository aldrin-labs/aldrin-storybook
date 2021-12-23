import React from 'react';

import {Block, BlockContent} from '@sb/components/Block';
import NumberFormat from "react-number-format";

type CurrentMarketSizeProps = {
    value: string
}

const CurrentMarketSize = ({value}: CurrentMarketSizeProps) => {
    return (
        <Block>
            <BlockContent>
                Current market size
                <h3>
                    <NumberFormat
                        value={value}
                        displayType={'text'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={true}
                        prefix={'$'}
                    />
                </h3>
            </BlockContent>
        </Block>
    );
};

export default CurrentMarketSize;
