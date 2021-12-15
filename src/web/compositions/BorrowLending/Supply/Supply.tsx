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

import {
    TitleBlock,
    BlockNumber,
    RewardCard,
    BlockReward,
    DescriptionBlock, Description, List, ListItem
} from './Supply.styles';
import {BlueButton} from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles';
import {compose} from 'recompose';
import {withTheme} from '@material-ui/core/styles';
import {initObligation} from '@sb/dexUtils/borrow-lending/initObligation';
import {depositObligationCollateral} from '@sb/dexUtils/borrow-lending/depositObligationCollateral';
import TableAssets from './components/TableAssets';
import {toNumberWithDecimals, u192ToBN} from "@sb/dexUtils/borrow-lending/U192-converting";
import {MarketCompType, WalletAccountsType} from "@sb/compositions/BorrowLending/Markets/types";
import {NumberValue} from "@sb/compositions/BorrowLending/Dashboard/Dashboard.styles";

type SupplyProps = {
    theme: Theme,
    reserves: any,
    obligations: any,
    walletAccounts: WalletAccountsType | [],
    userSummary: any,
    lendingMarket: () => void,
}

const Supply = ({
    theme,
    reserves,
    obligations,
    walletAccounts,
    userSummary,
    lendingMarket,
}: SupplyProps) => {
    const { wallet } = useWallet()
    const connection = useConnection()

    const generateDepositCompositionArr = (reservesList: []): MarketCompType[] => {
        const depositCompArr: MarketCompType[] = [];
        if(walletAccounts && walletAccounts.length > 0 && userSummary) {
            reservesList.forEach(reserve => {
                const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
                const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount.amount;
                const tokenWorth = parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()) * tokenAmount;
                const totalAmountWorth = userSummary.totalDeposit;
                const reserveDepositPercent = parseInt(totalAmountWorth/tokenWorth) * 100;

                depositCompArr.push({
                    asset: reserve.collateral.mint.toString(),
                    value: reserveDepositPercent,
                })
            })
        }

        return depositCompArr;
    }

    const handleDepositLiq = async (reserve, amount = new BN(10)) => {
        depositLiquidity({
            wallet,
            connection,
            reserve,
            amount,
        })
            .then(res => {
                console.log('handleDepositLiq', res)
                let newObligation = null;
                if(obligations.length === 0) {
                    initObligation({
                        wallet,
                        connection,
                    }).then(initObligationRes => {
                        newObligation = initObligationRes;
                        console.log('initObligationRes', initObligationRes)
                    }).catch(error => console.log('initObligationError', error));
                }

                lendingMarket()

                console.log('deposit obligation', newObligation)
                depositObligationCollateral({
                    wallet,
                    connection,
                    obligation: obligations[0] || newObligation,
                    reserve,
                    amount,
                })
            })
            .catch(error => console.log('handleDepositLiqError', error))
    }

    const depositCompValues = generateDepositCompositionArr(reserves);

    const renderDepositComp = (reservesValues: MarketCompType[]) => {
        return reservesValues.map((value) => {
            return (
                <ListItem key={value.asset}>
                    <a
                        href={`https://explorer.solana.com/address/${value.asset}`}
                        target="_blank"
                    >
                        {value.asset}
                    </a>
                    <span>{value.value % 1 !== 0 ? value.value.toFixed(2) : value.value}%</span>
                </ListItem>
            )
        })
    }

    if(wallet.publicKey && !obligations) {
        return null;
    }

    return (
        <Page>
            <WideContent>
                <RootRow>
                    <button onClick={() => handleDepositLiq(reserves[0])}>Deposit liquidity</button>
                </RootRow>
                <RootRow>
                    <Cell col={12}>
                        <Block>
                            <BlockContent>
                                <RowContainer align={'center'}>
                                    <Cell col={12} colLg={6}>
                                        <BlockNumber>
                                            <TitleBlock>Deposit</TitleBlock>

                                            <DescriptionBlock>
                                                <Description>Total: ${userSummary?.totalDeposit ? toNumberWithDecimals(userSummary.totalDeposit, 2) : 0}</Description>
                                                <List>
                                                    {renderDepositComp(depositCompValues)}
                                                </List>
                                            </DescriptionBlock>
                                        </BlockNumber>
                                    </Cell>

                                    <Cell col={12} colLg={6}>
                                        <BlockNumber>
                                            <TitleBlock>Projected Yields</TitleBlock>

                                            <DescriptionBlock>
                                                <Description>Total: $9,659.78</Description>
                                                <List>
                                                    <ListItem>USDC 100.00%</ListItem>
                                                </List>
                                            </DescriptionBlock>
                                        </BlockNumber>
                                    </Cell>
                                </RowContainer>

                                <RowContainer>
                                    <Cell col={12} colLg={8}>
                                        <RewardCard>
                                            <RowContainer>
                                                <Cell col={12} colLg={4}>
                                                    <BlockReward>
                                                        <TitleBlock>Positions</TitleBlock>
                                                        0/10
                                                    </BlockReward>
                                                </Cell>
                                                <Cell col={12} colLg={4}>
                                                    <BlockReward>
                                                        <TitleBlock>Risk Factor</TitleBlock>
                                                        0
                                                    </BlockReward>
                                                </Cell>
                                                <Cell col={12} colLg={4}>
                                                    <BlockReward>
                                                        <TitleBlock>Remain Borrow</TitleBlock>
                                                        $0
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

export default compose(withTheme())(Supply);
