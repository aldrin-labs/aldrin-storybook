import React from 'react';

import {Block, BlockContent} from '@sb/components/Block';

type CurrentMarketSizeProps = {
    value: string
}

const CurrentMarketSize = ({value}: CurrentMarketSizeProps) => {
    return (
        <Block>
            <BlockContent>
                Current market size
                <h3>${value}</h3>
            </BlockContent>
        </Block>
    );
};

export default CurrentMarketSize;
