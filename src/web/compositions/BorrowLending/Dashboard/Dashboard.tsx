import React, {useEffect, useState} from 'react';
import {depositLiquidity} from '@sb/dexUtils/borrow-lending/depositLiquidity';
import {useWallet} from '@sb/dexUtils/wallet';
import {useConnection} from '@sb/dexUtils/connection';
import BN from 'bn.js';
import {Cell, Page, WideContent} from '@sb/components/Layout';
import {RootRow} from '@sb/compositions/Pools/components/Charts/styles';
import {Block, BlockContent} from '@sb/components/Block';
import {RowContainer} from '@sb/compositions/AnalyticsRoute/index.styles';
import {Theme} from '@material-ui/core';

import {TitleBlock, NumberValue, BlockNumber, TextCol, RewardCard, BlockReward, Subtitle} from './Dashboard.styles';
import {BlueButton} from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles';
import {compose} from 'recompose';
import {withTheme} from '@material-ui/core/styles';
import {initObligation} from '@sb/dexUtils/borrow-lending/initObligation';
import {depositObligationCollateral} from '@sb/dexUtils/borrow-lending/depositObligationCollateral';
import TableAssets from './components/TableAssets';
import {toNumberWithDecimals} from "@sb/dexUtils/borrow-lending/U192-converting";
import {WalletAccountsType} from "@sb/compositions/BorrowLending/Markets/types";
import NumberFormat from "react-number-format";

type DashboardProps = {
    theme: Theme,
    reserves: any,
    obligations: any,
    walletAccounts: WalletAccountsType | [],
    userSummary: any,
}

const Dashboard = ({
    theme,
    reserves,
    obligations,
    walletAccounts,
    userSummary,
}: DashboardProps) => {
    const { wallet } = useWallet()
    const connection = useConnection()

    if(wallet.publicKey && !obligations) {
        return null;
    }

    return (
        <Page>
            <WideContent>
                <RootRow>
                    <Cell col={12}>
                        <Block>
                            <BlockContent>
                                <RowContainer>
                                    <Cell col={12} colLg={4}>
                                        <BlockNumber>
                                            <TitleBlock>Deposit Value</TitleBlock>
                                            <NumberValue>
                                                {userSummary?.totalDepositWorth ?
                                                    <NumberFormat
                                                        value={userSummary.totalDepositWorth}
                                                        displayType={'text'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                    />
                                                : 0}
                                            </NumberValue>
                                        </BlockNumber>
                                    </Cell>
                                    <Cell col={12} colLg={4}>
                                        <BlockNumber>
                                            <TitleBlock>Net APY</TitleBlock>
                                            <NumberValue>91.08%</NumberValue>
                                        </BlockNumber>
                                    </Cell>
                                    <Cell col={12} colLg={4}>
                                        <BlockNumber>
                                            <TitleBlock>Borrow Value</TitleBlock>
                                            <NumberValue>$4.27</NumberValue>
                                        </BlockNumber>
                                    </Cell>
                                </RowContainer>
                                <RowContainer>
                                    <Cell col={12} colLg={4}>
                                        <TextCol>26.54%</TextCol>
                                        <Subtitle>Borrowing Power Used</Subtitle>
                                    </Cell>
                                    <Cell col={12} colLg={4}>
                                        <TextCol>73.46%</TextCol>
                                        <Subtitle>Borrowing Power</Subtitle>
                                    </Cell>
                                    <Cell col={12} colLg={4}>
                                        <TextCol>$4.27</TextCol>
                                        <Subtitle>You Borrowed</Subtitle>
                                    </Cell>
                                </RowContainer>

                                <RowContainer>
                                    <Cell col={12} colLg={8}>
                                        <RewardCard>
                                            <RowContainer>
                                                <Cell col={12} colLg={4}>
                                                    <BlockReward>
                                                        <TitleBlock>Total Claimable Reward</TitleBlock>
                                                        0.000004
                                                    </BlockReward>
                                                </Cell>
                                                <Cell col={12} colLg={4}>
                                                    <BlockReward>
                                                        <TitleBlock>Your Balance</TitleBlock>
                                                        0
                                                    </BlockReward>
                                                </Cell>
                                                <Cell col={12} colLg={4}>
                                                    <BlockReward>
                                                        <BlueButton
                                                            theme={theme}
                                                            width="calc(50% - .5rem)"
                                                            style={{alignSelf: 'center'}}
                                                        >
                                                            Claim All
                                                        </BlueButton>
                                                    </BlockReward>
                                                </Cell>
                                            </RowContainer>
                                        </RewardCard>
                                    </Cell>
                                </RowContainer>
                            </BlockContent>
                        </Block>
                    </Cell>
                </RootRow>

                <RootRow>
                    <Cell col={12}>
                        <Block style={{paddingTop: '2rem', paddingBottom: '2rem'}}>
                            <TableAssets theme={theme} walletAccounts={walletAccounts} reserves={reserves} />
                        </Block>
                    </Cell>
                </RootRow>
            </WideContent>
        </Page>
    );
};

export default compose(withTheme())(Dashboard);
