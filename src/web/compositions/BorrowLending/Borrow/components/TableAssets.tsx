import React, {useState} from 'react';

import {RowTd, Table, TableBody, TableHeader, TableRow} from '@sb/compositions/Pools/components/Tables/index.styles';
import {Theme} from '@material-ui/core';
import {toNumberWithDecimals, u192ToBN} from '@sb/dexUtils/borrow-lending/U192-converting';
import {ObligationType, WalletAccountsType} from '@sb/compositions/BorrowLending/Markets/types';
import {calculateBorrowApy, calculateUtilizationRate} from '@sb/compositions/BorrowLending/utils/rates';
import ActionsPopup from '@sb/compositions/BorrowLending/Borrow/components/ActionsPopup';
import {PublicKey} from '@solana/web3.js';
import BN from 'bn.js';
import NumberFormat from "react-number-format";

type TableAssetsProps = {
    theme: Theme,
    reserves: any,
    obligations: any,
    walletAccounts: WalletAccountsType | [],
    obligationDetails: ObligationType | null,
    calcCollateralWorth: () => void,
    handleBorrowObligationLiquidity: (reserve: any, amount: number, callback: () => void) => void,
}

const TableAssets = ({
    theme,
    reserves,
    obligations,
    walletAccounts,
    obligationDetails,
    calcCollateralWorth,
    handleBorrowObligationLiquidity,
}: TableAssetsProps) => {
    const [actionsOpen, setActionsOpen] = useState(false);

    const closeActions = () => {
        setActionsOpen(false)
    }

    const renderRows = () => {
        return reserves.map((reserve, index) => {
            const tokenPrice = toNumberWithDecimals(parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()), 5);
            let tokenDecimals = 0;
            let depositAmount = 0;
            let depositWorth = 0;
            let walletBalance = 0;
            let depositApy = 0;
            let walletBalanceWorth = 0;
            let reserveObligationCollateral = null;
            let reserveObligationBorrow = null;
            let borrowApy = 0;
            const maxLtv = reserve.config.loanToValueRatio.percent;
            const liquidationThreshold = reserve.config.liquidationThreshold.percent;
            let remainingBorrow = 0;
            let liquidityDeposit = 0;
            let liquidityWorth = 0;
            let collateralDeposit = 0;
            let collateralWorth = 0;
            let reserveBorrowedLiquidity = 0;
            let reserveAvailableLiquidity = 0;
            let mintedCollateralTotal = 0;
            let mintedLiquidityTotal = 0;
            let borrowedAmount = 0;
            let borrowedAmountWorth = 0;

            if(walletAccounts && walletAccounts.length > 0) {
                const depositTokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
                const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.liquidity.mint.toString());
                if(depositTokenAccount) {
                    const depositAmountBN = new BN(depositTokenAccount.account.data.parsed.info.tokenAmount.amount);
                    const depositWorthBN = u192ToBN(reserve.liquidity.marketPrice).mul(depositAmountBN);
                    depositAmount = depositTokenAccount.account.data.parsed.info.tokenAmount.uiAmountString;
                    depositWorth = parseInt(depositWorthBN.toString())/Math.pow(10, depositTokenAccount.account.data.parsed.info.tokenAmount.decimals)/5;
                }

                if(tokenAccount) {
                    tokenDecimals = tokenAccount.account.data.parsed.info.tokenAmount.decimals;
                    walletBalance = +tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
                    walletBalanceWorth = walletBalance * parseInt(u192ToBN(reserve.liquidity.marketPrice).toString());
                    const reserveBorrowedAmount = parseInt(u192ToBN(reserve.liquidity.borrowedAmount).toString());
                    const utilizationRate = calculateUtilizationRate(
                        reserveBorrowedAmount,
                        parseInt((u192ToBN(reserve.liquidity.borrowedAmount).add(reserve.liquidity.availableAmount)).toString())
                    );

                    borrowApy = calculateBorrowApy(
                        utilizationRate,
                        reserve.config.optimalUtilizationRate.percent/100,
                        reserve.config.optimalBorrowRate.percent/100,
                        reserve.config.minBorrowRate.percent/100,
                        reserve.config.maxBorrowRate.percent/100
                    );
                    depositApy = borrowApy * utilizationRate;

                    reserveBorrowedLiquidity = parseInt(u192ToBN(reserve.liquidity.borrowedAmount).toString())/Math.pow(10, 18);
                    reserveAvailableLiquidity = parseInt(reserve.liquidity.availableAmount.toString())/Math.pow(10, tokenDecimals);
                    mintedCollateralTotal = parseInt(reserve.collateral.mintTotalSupply.toString()/Math.pow(10, tokenDecimals));
                    // mintedLiquidityTotal = parseInt(reserve.liquidity.mintTotalSupply.toString()/Math.pow(10, tokenDecimals));
                    // console.log('mintedLiquidityTotal', mintedLiquidityTotal)

                    if(obligationDetails) {
                        console.log(
                            {
                                depositedValue: u192ToBN(obligationDetails.depositedValue).toString(),
                                borrowedValue: u192ToBN(obligationDetails.borrowedValue).toString(),
                                allowedBorrowValue: u192ToBN(obligationDetails.allowedBorrowValue).toString(),
                                unhealthyBorrowValue: u192ToBN(obligationDetails.unhealthyBorrowValue).toString(),
                            }
                        )
                        //
                        obligationDetails.reserves.forEach(r => {
                            if (r.collateral) {
                                const c = r.collateral.inner
                                console.log("col", {
                                    depositReserve: c.depositReserve.toString(), depositedAmount: c.depositedAmount.toString(), marketValue: u192ToBN(c.marketValue).toString()
                                });
                            } else if (r.liquidity) {
                                const l = r.liquidity.inner
                                console.log("liq",{
                                    borrowReserve: l.borrowReserve.toString(), borrowedAmount: u192ToBN(l.borrowedAmount).toString(), cumulativeBorrowRate: u192ToBN(l.cumulativeBorrowRate).toString(), marketValue: u192ToBN(l.marketValue).toString()
                                });
                            }
                        })

                        reserveObligationCollateral = obligationDetails.reserves.find(reserveObligation => {

                            if(reserveObligation.collateral) {
                                console.log(reserve.publicKey.toString(), reserveObligation.collateral.inner.depositReserve.toString())
                                return (reserve.publicKey.toString() === reserveObligation.collateral.inner.depositReserve.toString());
                            }
                            return false;

                        })

                        reserveObligationBorrow = obligationDetails.reserves.find(reserveObligation => {

                            if(reserveObligation.liquidity) {
                                console.log(reserve.publicKey.toString(), reserveObligation.liquidity.inner.borrowReserve.toString())
                                return (reserve.publicKey.toString() === reserveObligation.liquidity.inner.borrowReserve.toString());
                            }
                            return false;

                        })

                        if(reserveObligationCollateral) {
                            collateralDeposit = parseInt(reserveObligationCollateral.collateral.inner.depositedAmount.toString())/Math.pow(10, tokenDecimals);
                            // collateralWorth = calcCollateralWorth(collateralDeposit, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice);
                            collateralWorth = parseInt(u192ToBN(reserveObligationCollateral.collateral.inner.marketValue).toString())/Math.pow(10, 18);
                            remainingBorrow = reserve.config.loanToValueRatio.percent/100 * collateralWorth;
                        }

                        if(reserveObligationBorrow) {
                            borrowedAmount = parseInt(u192ToBN(reserveObligationBorrow.liquidity.inner.borrowedAmount).toString())/Math.pow(10, 18);
                            borrowedAmountWorth = parseInt(u192ToBN(reserveObligationBorrow.liquidity.inner.marketValue).toString())/Math.pow(10, 18);
                            console.log('borrowedAmount', borrowedAmount)
                        }
                    }
                }
            }

            return (
                <>
                    <TableRow
                        onClick={() => setActionsOpen(index)}
                        style={{cursor: 'pointer'}}
                    >
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <a
                                href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                                target="_blank"
                                style={{display: 'block'}}
                            >
                                {reserve.liquidity.mint.toString()}
                            </a>
                            <span>${tokenPrice}</span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>{collateralDeposit}</strong></p>
                            <span>
                                <NumberFormat
                                    value={remainingBorrow}
                                    displayType={'text'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                            </span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>{borrowedAmount}</strong></p>
                            <span>
                                <NumberFormat
                                    value={borrowedAmountWorth}
                                    displayType={'text'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                            </span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>{borrowApy % 1 !== 0 ? borrowApy.toFixed(2) : borrowApy}%</strong></p>
                        </RowTd>
                    </TableRow>
                    {
                        walletAccounts && walletAccounts.length > 0 && (
                            <ActionsPopup
                                theme={theme}
                                open={actionsOpen === index}
                                onClose={closeActions}
                                reserve={reserve}
                                tokenPrice={tokenPrice}
                                reserveObligationCollateral={reserveObligationCollateral}
                                token={reserve.liquidity.mint.toString()}
                                walletBalance={walletBalance}
                                tokenDecimals={tokenDecimals}
                                depositAmount={depositAmount}
                                collateralDeposit={collateralDeposit}
                                collateralWorth={collateralWorth}
                                reserveBorrowedLiquidity={reserveBorrowedLiquidity}
                                reserveAvailableLiquidity={reserveAvailableLiquidity}
                                mintedCollateralTotal={mintedCollateralTotal}
                                maxLtv={maxLtv}
                                liquidationThreshold={liquidationThreshold}
                                remainingBorrow={remainingBorrow}
                                calcCollateralWorth={calcCollateralWorth}
                                borrowApy={borrowApy}
                                handleBorrowObligationLiquidity={handleBorrowObligationLiquidity}
                            />
                        )
                    }
                </>
            )
        })
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <RowTd style={{borderTop: 'none'}}>Asset</RowTd>
                    <RowTd style={{borderTop: 'none'}}>Available for You</RowTd>
                    <RowTd style={{borderTop: 'none'}}>Borrowed Amount</RowTd>
                    <RowTd style={{borderTop: 'none'}}>Borrow APY</RowTd>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderRows()}
            </TableBody>
        </Table>
    );
};

export default TableAssets;
