import React, {useState} from 'react';

import {RowTd, Table, TableBody, TableHeader, TableRow} from '@sb/compositions/Pools/components/Tables/index.styles';
import {Theme} from '@material-ui/core';
import {toNumberWithDecimals, u192ToBN} from '@sb/dexUtils/borrow-lending/U192-converting';
import {ObligationType, WalletAccountsType} from '@sb/compositions/BorrowLending/Markets/types';
import {calculateBorrowApy, calculateUtilizationRate} from '@sb/compositions/BorrowLending/utils/rates';
import ActionsPopup from '@sb/compositions/BorrowLending/Supply/components/ActionsPopup';
import {PublicKey} from '@solana/web3.js';
import BN from 'bn.js';
import NumberFormat from "react-number-format";

type TableAssetsProps = {
    theme: Theme,
    reserves: any,
    obligations: any,
    walletAccounts: WalletAccountsType | [],
    handleDepositLiq: (reserve: any, amount: number, asCollateral: boolean, callback: () => void) => void,
    handleWithdrawCollateral: (reserve: any, amount: number, callback: () => void) => void,
    handleWithdrawLiquidity: (reserve: any, amount: number, callback: () => void) => void,
    obligationDetails: ObligationType | null
}

const TableAssets = ({
    theme,
    reserves,
    obligations,
    walletAccounts,
    handleDepositLiq,
    handleWithdrawCollateral,
    handleWithdrawLiquidity,
    obligationDetails,
}: TableAssetsProps) => {
    const [actionsOpen, setActionsOpen] = useState(false);

    const closeActions = () => {
        setActionsOpen(false)
    }

    const calcCollateralWorth = (collateralDeposit, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice) => {
        return collateralDeposit * (reserveBorrowedLiquidity + reserveAvailableLiquidity) / mintedCollateralTotal * tokenPrice;
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
            let reserveObligation = null;
            let borrowApy = 0;
            const maxLtv = reserve.config.loanToValueRatio.percent;
            let remainingBorrow = 0;
            let liquidityDeposit = 0;
            let liquidityWorth = 0;
            let collateralDeposit = 0;
            let collateralWorth = 0;
            let reserveBorrowedLiquidity = 0;
            let reserveAvailableLiquidity = 0;
            let mintedCollateralTotal = 0;
            let mintedLiquidityTotal = 0;

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
                        reserveObligation = obligationDetails.reserves.find(reserveObligation => {

                            if(reserveObligation.collateral) {
                                console.log(reserve.publicKey.toString(), reserveObligation.collateral.inner.depositReserve.toString())
                                return (reserve.publicKey.toString() === reserveObligation.collateral.inner.depositReserve.toString());
                            }
                            return false;

                        })

                        // remainingBorrow = reserve.config.loanToValueRatio.percent/100 * (depositWorth/Math.pow(10, 18));
                        if(reserveObligation) {
                            collateralDeposit = parseInt(reserveObligation.collateral.inner.depositedAmount.toString())/Math.pow(10, tokenDecimals);
                            // amount_of_collateral * (reserveBorrowedLiquidity + reserveAvailableLiquidity) / mintedCollateralTotal * tokenPrice
                            console.log('reserve.collateral.inner.marketValue', parseInt(u192ToBN(reserveObligation.collateral.inner.marketValue).toString())/Math.pow(10, 18))
                            // collateralWorth = calcCollateralWorth(collateralDeposit, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice);
                            collateralWorth = parseInt(u192ToBN(reserveObligation.collateral.inner.marketValue).toString())/Math.pow(10, 18);
                            remainingBorrow = reserve.config.loanToValueRatio.percent/100 * collateralWorth;
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
                            <p style={{margin: 0}}><strong>{walletBalance}</strong></p>
                            <span>${toNumberWithDecimals(walletBalanceWorth, 2)}</span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>{depositAmount} ({collateralDeposit})</strong></p>
                            <span>${toNumberWithDecimals(depositWorth, 2)}</span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>{depositApy % 1 !== 0 ? depositApy.toFixed(2) : depositApy}%</strong></p>
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
                                reserveObligation={reserveObligation}
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
                                remainingBorrow={remainingBorrow}
                                depositApy={depositApy}
                                handleDepositLiq={handleDepositLiq}
                                handleWithdrawCollateral={handleWithdrawCollateral}
                                handleWithdrawLiquidity={handleWithdrawLiquidity}
                                calcCollateralWorth={calcCollateralWorth}
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
                    <RowTd style={{borderTop: 'none'}}>Your Wallet Balance</RowTd>
                    <RowTd style={{borderTop: 'none'}}>Deposited Amount	</RowTd>
                    <RowTd style={{borderTop: 'none'}}>Deposit APY</RowTd>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderRows()}
            </TableBody>
        </Table>
    );
};

export default TableAssets;
