import React, {useEffect, useState} from 'react';
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
} from '../Supply/Supply.styles';
import {compose} from 'recompose';
import {withTheme} from '@material-ui/core/styles';
import {depositObligationCollateral} from '@sb/dexUtils/borrow-lending/depositObligationCollateral';
import TableAssets from './components/TableAssets';
import {removeTrailingZeros, toNumberWithDecimals, u192ToBN} from '@sb/dexUtils/borrow-lending/U192-converting';
import {MarketCompType, ObligationType, WalletAccountsType} from '@sb/compositions/BorrowLending/Markets/types';
import {PublicKey} from '@solana/web3.js';
import {borrowObligationLiquidity} from '@sb/dexUtils/borrow-lending/borrowObligationLiquidity';
import {repayObligationLiquidity} from '@sb/dexUtils/borrow-lending/repayObligationLiquidity';

type BorrowProps = {
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

const Borrow = ({
    theme,
    reserves,
    reservesPKs,
    obligations,
    obligationDetails,
    walletAccounts,
    userSummary,
    handleGetReservesAccounts,
    handleGetObligation,
}: BorrowProps) => {
    const { wallet } = useWallet()
    const connection = useConnection()

    const collateralTokens = {};
    let totalRemainingBorrow = 0;
    let totalBorrowedWorth = 0;
    let totalUserDepositWorth = 0;
    let totalUserCollateralWorth = 0;
    let reserveBorrowedLiquidity = 0;
    let reserveBorrowedLiquidityWorth = 0;
    let reserveAvailableLiquidity = 0;
    let mintedCollateralTotal = 0;
    let unhealthyBorrowValue = 0;
    const totalRiskFactor = obligationDetails ? (parseInt(u192ToBN(obligationDetails.borrowedValue).toString())/parseInt(u192ToBN(obligationDetails.unhealthyBorrowValue).toString()) * 100) : 0;

    const handleBorrowObligationLiquidity = (reserve: any, amount: number, callback: () => void) => {
        borrowObligationLiquidity({
            wallet,
            connection,
            obligation: obligations[0],
            obligationDetails,
            reserve,
            amount: new BN(amount),
        }).then(borrowObligationLiquidityRes => {
            handleGetReservesAccounts()
            handleGetObligation()
            if(callback) {
                callback()
            }
        }).catch(depositObligationCollateralError => console.log('depositObligationCollateralError', depositObligationCollateralError))
    }

    const handleRepayObligationLiquidity = (reserve: any, amount: number, callback: () => void) => {
        repayObligationLiquidity({
            wallet,
            connection,
            obligation: obligations[0],
            obligationDetails,
            reserve,
            amount: new BN(amount),
        }).then(repayObligationLiquidityRes => {
            handleGetReservesAccounts()
            handleGetObligation()
            if(callback) {
                callback()
            }
        }).catch(depositObligationCollateralError => console.log('depositObligationCollateralError', depositObligationCollateralError))
    }

    const generateCollateralCompositionArr = (reservesList: []): MarketCompType[] => {
        const depositCompArr: MarketCompType[] = [];
        if(walletAccounts && walletAccounts.length > 0 && userSummary) {
            reservesList.forEach(reserve => {
                const tokenCollateralWorth = collateralTokens[reserve.publicKey];
                const reserveDepositPercent = tokenCollateralWorth/(totalUserCollateralWorth)*100;

                depositCompArr.push({
                    asset: reserve.collateral.mint.toString(),
                    value: reserveDepositPercent || 0,
                })
            })
        }

        return depositCompArr;
    }

    const calcCollateralWorth = (collateralDeposit, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice) => {
        console.log('calcCollateralWorth', {collateralDeposit, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice})
        return collateralDeposit * (reserveBorrowedLiquidity + reserveAvailableLiquidity) / mintedCollateralTotal * tokenPrice;
    }

    if(walletAccounts && walletAccounts.length) {
        reserves.forEach(reserve => {
            const tokenPrice = toNumberWithDecimals(parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()), 5);
            const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
            const depositAmount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
            const depositWorth = parseFloat(tokenPrice, 5) * depositAmount;
            console.log('depositWorthh', depositWorth)
            totalRemainingBorrow = reserve.config.loanToValueRatio.percent/100 * (depositWorth);
            console.log('remainingBorrow supply', totalRemainingBorrow)

            totalUserDepositWorth = totalUserDepositWorth + depositWorth;

            const tokenDecimals = tokenAccount.account.data.parsed.info.tokenAmount.decimals;
            reserveBorrowedLiquidity = parseInt(u192ToBN(reserve.liquidity.borrowedAmount).toString())/Math.pow(10, 18 + tokenDecimals);
            reserveBorrowedLiquidityWorth = reserveBorrowedLiquidity * parseFloat(tokenPrice);
            reserveAvailableLiquidity = parseInt(reserve.liquidity.availableAmount.toString())/Math.pow(10, tokenDecimals);
            mintedCollateralTotal = parseInt(reserve.collateral.mintTotalSupply.toString()/Math.pow(10, tokenDecimals));
            console.log('reserveBorrowedLiquidityWorth', reserveBorrowedLiquidity, reserveBorrowedLiquidityWorth)
            totalBorrowedWorth = totalBorrowedWorth + reserveBorrowedLiquidityWorth;

            if(obligationDetails) {
                unhealthyBorrowValue = parseInt(u192ToBN(obligationDetails.unhealthyBorrowValue).toString())/Math.pow(10, 18);
                const reserveObligationCollateral = obligationDetails.reserves.find(reserveObligation => {

                    if(reserveObligation.collateral) {
                        console.log(reserve.publicKey.toString(), reserveObligation.collateral.inner.depositReserve.toString())
                        return (reserve.publicKey.toString() === reserveObligation.collateral.inner.depositReserve.toString());
                    }
                    return false;

                })

                const reserveObligationBorrow = obligationDetails.reserves.find(reserveObligation => {

                    if(reserveObligation.liquidity) {
                        console.log(reserve.publicKey.toString(), reserveObligation.liquidity.inner.borrowReserve.toString())
                        return (reserve.publicKey.toString() === reserveObligation.liquidity.inner.borrowReserve.toString());
                    }
                    return false;

                })

                if(reserveObligationCollateral) {
                    const collateralDeposit = parseInt(reserveObligationCollateral.collateral.inner.depositedAmount.toString())/Math.pow(10, tokenDecimals);
                    const collateralWorth = calcCollateralWorth(collateralDeposit, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice);
                    const remainingBorrow = reserve.config.loanToValueRatio.percent/100 * collateralWorth;
                    totalUserCollateralWorth = totalUserCollateralWorth + collateralWorth;
                    collateralTokens[reserve.publicKey] = collateralWorth;
                }

                if(reserveObligationBorrow) {

                }
            }
        });
    }

    const collateralCompValues = generateCollateralCompositionArr(reserves);

    const renderCollateralsComp = (reservesValues: MarketCompType[]) => {
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
                                            <TitleBlock>Collaterals</TitleBlock>

                                            <DescriptionBlock>
                                                <Description>Total:
                                                    <NumberFormat
                                                        value={totalUserCollateralWorth}
                                                        displayType={'text'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        thousandSeparator={true}
                                                        prefix={'$'} />
                                                </Description>
                                                <List>
                                                    {renderCollateralsComp(collateralCompValues)}
                                                </List>
                                            </DescriptionBlock>
                                        </BlockNumber>
                                    </Cell>

                                    <Cell col={12} colLg={6}>
                                        <BlockNumber>
                                            <TitleBlock>Loans</TitleBlock>

                                            <DescriptionBlock>
                                                <Description>
                                                    Total:
                                                    <NumberFormat
                                                        value={totalBorrowedWorth}
                                                        displayType={'text'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        thousandSeparator={true}
                                                        prefix={'$'} />
                                                </Description>
                                                <List>
                                                    {/*<ListItem>USDC 100.00%</ListItem>*/}
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
                                obligationDetails={obligationDetails}
                                calcCollateralWorth={calcCollateralWorth}
                                unhealthyBorrowValue={unhealthyBorrowValue}
                                handleBorrowObligationLiquidity={handleBorrowObligationLiquidity}
                                handleRepayObligationLiquidity={handleRepayObligationLiquidity}
                            />
                        </Block>
                    </Cell>
                </RootRow>
            </WideContent>
        </Page>
    );
};

export default compose(withTheme())(Borrow);
