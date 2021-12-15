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
    const [actionsOpen, setActionsOpen] = useState(false);

    const closeActions = () => {
        setActionsOpen(false)
    }

    const renderRows = () => {
        return reserves.map(reserve => {
            let tokenPrice = 0;
            let depositAmount = 0;
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
                            <p style={{margin: 0}}><strong>{depositAmount}</strong></p>
                            <span>${toNumberWithDecimals(depositWorth, 2)}</span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>0.00009</strong> USDC</p>
                            <span>$4.27</span>
                        </RowTd>
                        <RowTd style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                            <p style={{margin: 0}}><strong>0</strong></p>
                            <span>$0.00</span>
                        </RowTd>
                    </TableRow>
                    <BalancesPopup
                        theme={theme}
                        open={actionsOpen}
                        onClose={closeActions}
                        walletBalance={walletBalance}
                        borrowApy={borrowApy}
                        depositApy={depositApy}
                        depositAmount={depositAmount}
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
