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
import { default as NumberFormat } from 'react-number-format';

import {
    TitleBlock,
    BlockNumber,
    RewardCard,
    BlockReward,
    DescriptionBlock, Description, List, ListItem
} from './Supply.styles';
import {compose} from 'recompose';
import {withTheme} from '@material-ui/core/styles';
import {initObligation} from '@sb/dexUtils/borrow-lending/initObligation';
import {depositObligationCollateral} from '@sb/dexUtils/borrow-lending/depositObligationCollateral';
import TableAssets from './components/TableAssets';
import {removeTrailingZeros, toNumberWithDecimals, u192ToBN} from '@sb/dexUtils/borrow-lending/U192-converting';
import {MarketCompType, ObligationType, WalletAccountsType} from '@sb/compositions/BorrowLending/Markets/types';
import {getObligation} from '@sb/dexUtils/borrow-lending/getObligation';
import {withdrawCollateral} from '@sb/dexUtils/borrow-lending/withdrawCollateral';
import {withdrawLiquidity} from '@sb/dexUtils/borrow-lending/withdrawLiquidity';
import {PublicKey} from '@solana/web3.js';

type SupplyProps = {
    theme: Theme,
    reserves: any,
    reservesPKs: PublicKey[],
    obligations: any,
    obligationDetails: any,
    walletAccounts: WalletAccountsType | [],
    userSummary: any,
    handleGetReservesAccounts: () => void,
    handleGetObligation: () => void,
}

const Supply = ({
    theme,
    reserves,
    reservesPKs,
    obligations,
    obligationDetails,
    walletAccounts,
    userSummary,
    handleGetReservesAccounts,
    handleGetObligation,
}: SupplyProps) => {
    const { wallet } = useWallet()
    const connection = useConnection()
    let totalRemainingBorrow = 0;
    let totalUserDepositWorth = 0;
    let totalRiskFactor = obligationDetails ? parseInt(u192ToBN(obligationDetails.borrowedValue).toString())/parseInt(u192ToBN(obligationDetails.unhealthyBorrowValue).toString()) * 100 : 0;

    const generateDepositCompositionArr = (reservesList: []): MarketCompType[] => {
        const depositCompArr: MarketCompType[] = [];
        if(walletAccounts && walletAccounts.length > 0 && userSummary) {
            reservesList.forEach(reserve => {
                const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
                const tokenAmount = tokenAccount?.account.data.parsed.info.tokenAmount.amount;
                const tokenDecimals = tokenAccount?.account.data.parsed.info.tokenAmount.decimals;
                const tokenWorth = parseInt(u192ToBN(reserve.liquidity.marketPrice).toString())/Math.pow(10, 18) * tokenAmount/Math.pow(10, tokenDecimals)/5;
                console.log('totalUserDepositWorth', totalUserDepositWorth/5, tokenWorth)
                const reserveDepositPercent = tokenWorth/(totalUserDepositWorth/5)*100;

                depositCompArr.push({
                    asset: reserve.collateral.mint.toString(),
                    value: reserveDepositPercent || 0,
                })
            })
        }

        return depositCompArr;
    }

    const handleDepositLiq = async (reserve: any, amount: number, asCollateral: boolean, callback: () => void) => {
        console.log('deposit liq', new BN(amount));
        depositLiquidity({
            wallet,
            connection,
            reserve,
            amount: new BN(amount),
        })
            .then(async res => {
                console.log('handleDepositLiq', res)
                let newObligation = null;
                if(obligations.length === 0) {
                    newObligation = await initObligation({
                        wallet,
                        connection,
                    }).catch(error => console.log('initObligationError', error));
                }

                if(callback) {
                    callback()
                }

                console.log('deposit obligation', newObligation)
                console.log('asCollateral', asCollateral)
                if(asCollateral) {
                    console.log('deposit collateral', new BN(amount));
                    await depositObligationCollateral({
                        wallet,
                        connection,
                        obligation: obligations[0] || newObligation,
                        obligationDetails,
                        reserve,
                        amount: new BN(amount * 5),
                    }).then(depositObligationCollateralRes => {
                        handleGetObligation()
                    }).catch(depositObligationCollateralError => console.log('depositObligationCollateralError', depositObligationCollateralError))
                }
                handleGetReservesAccounts()

            })
            .catch(error => console.log('handleDepositLiqError', error))
    }

    const handleWithdrawCollateral = async (reserve: any, amount: number, callback: () => void) => {
        withdrawCollateral({
            wallet,
            connection,
            reserve,
            obligation: obligations[0],
            obligationDetails,
            amount: new BN(amount),
        }).then(res => {
            console.log('withdrawCollateral', res)
            handleGetReservesAccounts()
            handleGetObligation()
            if(callback) {
                callback()
            }
        })
            .catch(error => console.log('withdrawCollateralError', error))
    }

    const handleWithdrawLiquidity = async (reserve: any, amount: number, callback: () => void) => {
        withdrawLiquidity({
            wallet,
            connection,
            reserve,
            obligation: obligations[0],
            obligationDetails,
            amount: new BN(amount),
        }).then(res => {
            console.log('withdrawLiquidity', res)
            handleGetReservesAccounts()
            if(callback) {
                callback()
            }
        })
            .catch(error => console.log(error))
    }

    if(walletAccounts && walletAccounts.length) {
        reserves.forEach(reserve => {
            const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
            const depositAmount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
            const depositWorth = parseInt(u192ToBN(reserve.liquidity.marketPrice).toString())/Math.pow(10, 18) * depositAmount;
            console.log('depositWorthh', depositWorth)
            totalRemainingBorrow = reserve.config.loanToValueRatio.percent/100 * (depositWorth);
            console.log('remainingBorrow supply', totalRemainingBorrow)

            totalUserDepositWorth = totalUserDepositWorth + depositWorth;
        });
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

    const positions = obligationDetails?.reserves?.filter(reserve => {
        return Object.keys(reserve)[0] !== 'empty';
    }).length || 0;

    if(wallet.publicKey && !obligations) {
        return null;
    }

    if(wallet.publicKey && !obligationDetails) {
        return null;
    }

    return (
        <Page>
            <WideContent>
                <RootRow>
                    <Cell col={12}>
                        <Block>
                            <BlockContent>
                                <RowContainer align={'center'}>
                                    <Cell col={12} colLg={6}>
                                        <BlockNumber>
                                            <TitleBlock>Deposit</TitleBlock>

                                            <DescriptionBlock>
                                                <Description>Total:
                                                    <NumberFormat
                                                        value={totalUserDepositWorth/5}
                                                        displayType={'text'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        thousandSeparator={true}
                                                        prefix={'$'} />
                                                </Description>
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
                                                <Description>Total: TBA</Description>
                                                <List>
                                                    <ListItem>Token name 100.00%</ListItem>
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
                                                        {positions}/10
                                                    </BlockReward>
                                                </Cell>
                                                <Cell col={12} colLg={4}>
                                                    <BlockReward>
                                                        <TitleBlock>Risk Factor</TitleBlock>
                                                        {removeTrailingZeros(parseFloat(totalRiskFactor).toFixed(2))}%
                                                    </BlockReward>
                                                </Cell>
                                                <Cell col={12} colLg={4}>
                                                    <BlockReward>
                                                        <TitleBlock>Remain Borrow</TitleBlock>
                                                        {obligationDetails ?
                                                            <NumberFormat
                                                                value={parseInt(u192ToBN(obligationDetails.allowedBorrowValue).toString())/Math.pow(10, 18)}
                                                                displayType={'text'}
                                                                decimalScale={2}
                                                                fixedDecimalScale={true}
                                                                thousandSeparator={true}
                                                                prefix={'$'} />
                                                            : 0
                                                        }
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
                            <TableAssets
                                theme={theme}
                                walletAccounts={walletAccounts}
                                reserves={reserves}
                                obligations={obligations}
                                handleDepositLiq={handleDepositLiq}
                                handleWithdrawCollateral={handleWithdrawCollateral}
                                handleWithdrawLiquidity={handleWithdrawLiquidity}
                                obligationDetails={obligationDetails}
                            />
                        </Block>
                    </Cell>
                </RootRow>
            </WideContent>
        </Page>
    );
};

export default compose(withTheme())(Supply);
