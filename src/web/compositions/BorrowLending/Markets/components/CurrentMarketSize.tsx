import React from 'react';

type CurrentMarketSizeProps = {
    value: string
}

const CurrentMarketSize = ({value}: CurrentMarketSizeProps) => {
    return (
        <div>
            current market size
            <h3>{value}</h3>
        </div>
    );
};

export default CurrentMarketSize;
