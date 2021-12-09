import React from 'react';

import {Block, BlockContent} from "@sb/components/Block";

type BorrowedLentProps = {
    valueBorrowed: string,
    valueLent: number
}

const BorrowedLent = ({valueBorrowed, valueLent}: BorrowedLentProps) => {
    return (
        <>
            <Block>
                <BlockContent>
                    Total Borrowed
                    <h3>${valueBorrowed}</h3>
                </BlockContent>
            </Block>
            <Block>
                <BlockContent>
                    % Lent Out
                    <h3>{valueLent % 1 !== 0 ? valueLent.toFixed(2) : valueLent}%</h3>
                </BlockContent>
            </Block>
        </>
    );
};

export default BorrowedLent;
