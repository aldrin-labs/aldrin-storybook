import React, {useState} from 'react';

import {RowTd, Table, TableBody, TableHeader, TableRow} from '@sb/compositions/Pools/components/Tables/index.styles';
import {Theme} from '@material-ui/core';
import {toNumberWithDecimals, u192ToBN} from '@sb/dexUtils/borrow-lending/U192-converting';
import {ObligationType, WalletAccountsType} from '@sb/compositions/BorrowLending/Markets/types';
import {calculateBorrowApy, calculateUtilizationRate} from '@sb/compositions/BorrowLending/utils/rates';
import ActionsPopup from '@sb/compositions/BorrowLending/Supply/components/ActionsPopup';
import {PublicKey} from "@solana/web3.js";

type TableAssetsProps = {
    theme: Theme,
    reserves: any,
    obligations: any,
    walletAccounts: WalletAccountsType | [],
    handleDepositLiq: (reserve: any, amount: number, asCollateral: boolean) => void,
    handleWithdrawCollateral: (reserve: any, amount: number) => void,
    handleWithdrawLiquidity: (reserve: any, amount: number) => void,
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
    obligationDetails
}: TableAssetsProps) => {
    const [actionsOpen, setActionsOpen] = useState(false);

    const closeActions = () => {
        setActionsOpen(false)
    }

    const renderRows = () => {
        return reserves.map(reserve => {
            let tokenPrice = toNumberWithDecimals(parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()), 5);
            let depositAmount = 0;
            let depositWorth = 0;
            let walletBalance = 0;
            let depositApy = 0;
            let walletBalanceWorth = 0;
            let reserveObligation = null;
            let borrowApy = 0;
            let maxLtv = reserve.config.loanToValueRatio.percent;

            if(walletAccounts && walletAccounts.length > 0) {
                const depositTokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
                const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.liquidity.mint.toString());
                if(depositTokenAccount) {
                    depositAmount = depositTokenAccount.account.data.parsed.info.tokenAmount.uiAmountString;
                    depositWorth = parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()) * depositAmount;
                }

                if(tokenAccount) {
                    walletBalance = +tokenAccount.account.data.parsed.info.tokenAmount.uiAmountString;
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
                }
            }

            if(obligationDetails) {
                reserveObligation = obligationDetails.reserves.find(reserve => {
                    if(reserve.collateral) {
                        return ('DSTQScWV8B9zxLrhGoopULVvqneVb2rkyhZNu5keEtrr' === reserve.collateral.inner.depositReserve.toString());
                    } else {
                        return false;
                    }
                })
                if(reserveObligation) {
                    console.log("depositedAmount", reserveObligation.collateral.inner.depositedAmount.toString())
                }
            }

            return (
                <>
                    <TableRow
                        onClick={() => setActionsOpen(true)}
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
                            <p style={{margin: 0}}><strong>{depositAmount}</strong></p>
                            <span>${toNumberWithDecimals(depositWorth, 2)}</span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>{depositApy % 1 !== 0 ? depositApy.toFixed(2) : depositApy}%</strong></p>
                        </RowTd>
                    </TableRow>
                    {
                        true && (
                            <ActionsPopup
                                theme={theme}
                                open={actionsOpen}
                                onClose={closeActions}
                                reserve={reserve}
                                tokenPrice={tokenPrice}
                                reserveObligation={reserveObligation}
                                token={reserve.liquidity.mint.toString()}
                                walletBalance={walletBalance}
                                depositAmount={depositAmount}
                                maxLtv={maxLtv}
                                handleDepositLiq={handleDepositLiq}
                                handleWithdrawCollateral={handleWithdrawCollateral}
                                handleWithdrawLiquidity={handleWithdrawLiquidity}
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
