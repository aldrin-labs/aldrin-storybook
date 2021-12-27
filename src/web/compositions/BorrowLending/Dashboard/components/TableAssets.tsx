import React, {useState} from 'react';

import {RowTd, Table, TableBody, TableHeader, TableRow} from '@sb/compositions/Pools/components/Tables/index.styles';
import BalancesPopup from '@sb/compositions/BorrowLending/Dashboard/components/BalancesPopup';
import {Theme} from '@material-ui/core';
import {toNumberWithDecimals, u192ToBN} from "@sb/dexUtils/borrow-lending/U192-converting";
import {WalletAccountsType} from "@sb/compositions/BorrowLending/Markets/types";
import {calculateBorrowApy, calculateUtilizationRate} from "@sb/compositions/BorrowLending/utils/rates";

type TableAssetsProps = {
    theme: Theme,
    reserves: any,
    walletAccounts: WalletAccountsType | []
}

const TableAssets = ({theme, reserves, walletAccounts}: TableAssetsProps) => {
    const [balancesOpen, setBalancesOpen] = useState(false);

    const closeBalances = () => {
        setBalancesOpen(false)
    }

    const renderRows = () => {
        return reserves.map((reserve, index) => {
            let tokenPrice = 0;
            let depositAmount = 0;
            let depositAmountUI = 0;
            let depositWorth = 0;

            // BalancesPopup values
            let walletBalance = 0;
            let borrowApy = 0;
            let depositApy = 0;

            if(walletAccounts && walletAccounts.length > 0) {
                const depositTokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.collateral.mint.toString());
                const tokenAccount = walletAccounts.find(account => account.account.data.parsed.info.mint === reserve.liquidity.mint.toString());
                if(depositTokenAccount) {
                    tokenPrice = toNumberWithDecimals(parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()), 5);
                    depositAmount = depositTokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
                    depositAmountUI = depositTokenAccount.account.data.parsed.info.tokenAmount.uiAmountString;
                    depositWorth = parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()) * depositAmount;
                }

                if(tokenAccount) {
                    walletBalance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
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

            return (
                <>
                    <TableRow
                        onClick={() => setBalancesOpen(index)}
                        style={{cursor: 'pointer'}}
                        key={index}
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
                            <p style={{margin: 0}}><strong>{depositAmountUI}</strong></p>
                            <span>${toNumberWithDecimals(depositWorth, 2)}</span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>tba</strong></p>
                            <span>tba</span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>0</strong></p>
                            <span>$0.00</span>
                        </RowTd>
                    </TableRow>
                    <BalancesPopup
                        theme={theme}
                        open={balancesOpen === index}
                        onClose={closeBalances}
                        walletBalance={walletBalance}
                        borrowApy={borrowApy}
                        depositApy={depositApy}
                        depositAmountUI={depositAmountUI}
                    />
                </>
            )
        })
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <RowTd style={{borderTop: 'none'}}>Asset</RowTd>
                    <RowTd style={{borderTop: 'none'}}>Deposit Value</RowTd>
                    <RowTd style={{borderTop: 'none'}}>Borrow Value</RowTd>
                    <RowTd style={{borderTop: 'none'}}>Claimable Rewards</RowTd>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderRows()}
            </TableBody>
        </Table>
    );
};

export default TableAssets;
