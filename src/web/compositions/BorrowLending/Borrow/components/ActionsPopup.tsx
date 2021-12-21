import React, {useState} from 'react'

import { Theme } from '@material-ui/core'
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/lab/Slider';
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
    ButtonCategory,
    TitleBlock,
    SupplyCard,
    BlockSupply,
    AmountCard,
    MaxAmount,
    ButtonGroup
} from '../../Supply/components/ActionsPopup.styles';

import CloseIcon from '@icons/closeIcon.svg'

import {
    BlueButton,
    StyledPaper,
    Title,
} from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles';
import {Cell} from '@sb/components/Layout';
import BN from 'bn.js';
import {removeTrailingZeros} from '@sb/dexUtils/borrow-lending/U192-converting';
import NumberFormat from 'react-number-format';

const ActionsPopup = ({
                          theme,
                          onClose,
                          open,
                          reserve,
                          reserveObligation,
                          token,
                          tokenPrice,
                          walletBalance,
                          tokenDecimals,
                          depositAmount,
                          collateralDeposit,
                          collateralWorth,
                          reserveBorrowedLiquidity,
                          reserveAvailableLiquidity,
                          mintedCollateralTotal,
                          maxLtv,
                          remainingBorrow,
                          handleDepositLiq,
                          handleWithdrawCollateral,
                          handleWithdrawLiquidity,
                          calcCollateralWorth,
                      }: {
    theme: Theme
    onClose: () => void
    open: boolean,
    reserve: any,
    reserveObligation: any,
    token: string,
    tokenPrice: string,
    walletBalance: number,
    tokenDecimals: number,
    depositAmount: number,
    collateralDeposit: number,
    collateralWorth: number,
    reserveBorrowedLiquidity: number,
    reserveAvailableLiquidity: number,
    mintedCollateralTotal: number,
    maxLtv: number,
    remainingBorrow: number,
    handleDepositLiq: (reserve: any, amount: number, asColateral: boolean, callback: () => void) => void,
    handleWithdrawCollateral: (reserve: any, amount: number, callback: () => void) => void,
    handleWithdrawLiquidity: (reserve: any, amount: number, callback: () => void) => void,
    calcCollateralWorth: () => void,
}) => {
    const [amount, setAmount] = useState(0);
    const [mode, setMode] = useState(0);
    const [asCollateral, setAsCollateral] = useState(false)

    const handleChange = (values) => {
        let valueToSet = values.floatValue;

        if(!mode && +valueToSet > walletBalance) {
            valueToSet = walletBalance;
        } else if(mode && +valueToSet > +depositAmount) {
            valueToSet = +depositAmount;
        }
        setAmount(valueToSet || 0);
    };

    const handleChangeMode = (modeValue) => {
        setMode(modeValue);
        setAmount(0);
    }

    const handleChangeCollateral = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAsCollateral(event.target.checked);
    }

    const depositLiq = () => {
        const callback = () => {
            onClose();
            setAmount(0);
        }
        handleDepositLiq(reserve, amount * Math.pow(10, tokenDecimals), asCollateral, callback);
    }

    const withdrawLiq = () => {
        const callback = () => {
            onClose();
            setAmount(0);
            setMode(0);
        }
        handleWithdrawLiquidity(reserve, amount * Math.pow(10, tokenDecimals), callback);
    }

    const withdrawCollateral = () => {
        const callback = () => {
            onClose();
            setAmount(0);
            setMode(0);
        }
        console.log(amount * Math.pow(10, tokenDecimals))
        handleWithdrawCollateral(reserve, amount * Math.pow(10, tokenDecimals), callback);
    }

    const ballanceAfterDeposit = removeTrailingZeros((+walletBalance - amount).toFixed(tokenDecimals));
    const depositAfterDeposit = removeTrailingZeros((+depositAmount + amount).toFixed(tokenDecimals));
    const depositWorthAfterDeposit = depositAfterDeposit * tokenPrice;

    const collateralWorthAfterDeposit = collateralWorth + calcCollateralWorth(amount, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice);

    const ballanceAfterWithdraw = removeTrailingZeros((+walletBalance + amount).toFixed(tokenDecimals));
    const depositAfterWithdraw = removeTrailingZeros((+depositAmount - amount).toFixed(tokenDecimals));
    const collateralWorthAfterWithdraw = collateralWorth - calcCollateralWorth(amount, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice);

    const remainingBorrowAfterDeposit = reserve.config.loanToValueRatio.percent/100 * collateralWorthAfterDeposit;
    const remainingBorrowAfterWithdraw = reserve.config.loanToValueRatio.percent/100 * collateralWorthAfterWithdraw;

    let MAX_VAL = 0;
    if(mode) {
        MAX_VAL = parseFloat(depositAmount).toFixed(tokenDecimals);
    } else {
        MAX_VAL = walletBalance;
    }
    const withValueLimit = ({ floatValue }) => floatValue <= MAX_VAL;

    console.log('reserveObligation?.collateral.inner.depositedAmount', reserveObligation?.collateral.inner.depositedAmount.toString())
    return (
        <DialogWrapper
            theme={theme}
            PaperComponent={StyledPaper}
            fullScreen={false}
            onClose={onClose}
            PaperProps={{ width: '110rem', height: '80rem' }}
            maxWidth={'lg'}
            open={open}
            aria-labelledby="responsive-dialog-title"
        >
            <RowContainer style={{ marginBottom: '1rem' }} justify={'space-between'} align={'flex-start'}>
                <Title>
                    {token}
                </Title>
                <SvgIcon
                    onClick={() => onClose()}
                    src={CloseIcon}
                    style={{ cursor: 'pointer' }}
                    width={'2rem'}
                    height={'2rem'}
                />
            </RowContainer>

            {/*<RowContainer>*/}
            {/*    <button onClick={() => handleDepositLiq(reserve, 10)}>Deposit liquidity</button>*/}
            {/*    <button disabled={reserveObligation?.collateral.inner.depositedAmount.toString()} onClick={() => handleWithdrawLiquidity(reserve, 600)}>Withdraw liquidity</button>*/}
            {/*    <button disabled={ typeof reserveObligation?.collateral.inner.depositedAmount === 'undefined' ? true : false} onClick={() => handleWithdrawCollateral(reserve, 10)}>Withdraw collateral</button>*/}
            {/*</RowContainer>*/}
            <RowContainer>
                <ButtonCategory onClick={() => handleChangeMode(0)}>Deposit</ButtonCategory>
                <ButtonCategory onClick={() => handleChangeMode(1)} style={{borderTopColor: 'green', color: 'green'}}>Withdraw</ButtonCategory>
            </RowContainer>

            <RowContainer>
                <Cell col={12} colLg={10}>
                    <SupplyCard>
                        <RowContainer>
                            <Cell col={12} colLg={3}>
                                <BlockSupply>
                                    <TitleBlock>Mark Price</TitleBlock>
                                    ${tokenPrice}
                                </BlockSupply>
                            </Cell>
                            <Cell col={12} colLg={3}>
                                <BlockSupply>
                                    <TitleBlock>Supply APY</TitleBlock>
                                    2.31%
                                </BlockSupply>
                            </Cell>
                            <Cell col={12} colLg={3}>
                                <BlockSupply>
                                    <TitleBlock>Loan to Value</TitleBlock>
                                    {maxLtv}%
                                </BlockSupply>
                            </Cell>
                            <Cell col={12} colLg={3}>
                                {!mode && (
                                    <BlockSupply>
                                        <TitleBlock>Use as Collateral</TitleBlock>
                                        <Switch
                                            checked={asCollateral}
                                            onChange={handleChangeCollateral}
                                            value="checkedA"
                                            color="primary"
                                        />
                                    </BlockSupply>
                                )}
                            </Cell>
                        </RowContainer>
                    </SupplyCard>
                </Cell>
            </RowContainer>

            <RowContainer>
                <Cell col={12} colLg={6} style={{padding: '15px'}}>
                    <SupplyCard>
                        <RowContainer>
                            <Cell col={6}>
                                <BlockSupply>
                                    <TitleBlock>Wallet Balance</TitleBlock>
                                    {walletBalance} <a
                                    href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                                    target="_blank"
                                    style={{display: 'block'}}
                                >
                                    Token name
                                </a>
                                </BlockSupply>
                                <BlockSupply>
                                    <TitleBlock>Deposited Amount</TitleBlock>
                                    {depositAmount} <a
                                    href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                                    target="_blank"
                                    style={{display: 'block'}}
                                >
                                    Token name
                                </a>
                                </BlockSupply>
                                <BlockSupply>
                                    <TitleBlock>Risk Factor</TitleBlock>
                                    0%
                                </BlockSupply>
                                <BlockSupply>
                                    <TitleBlock>Remaining Borrow</TitleBlock>
                                    <NumberFormat
                                        value={remainingBorrow}
                                        displayType={'text'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        thousandSeparator={true}
                                        prefix={'$'} />
                                </BlockSupply>
                            </Cell>
                            <Cell col={6}>
                                <BlockSupply>
                                    <TitleBlock>Wallet Balance</TitleBlock>
                                    {mode ?
                                        ballanceAfterWithdraw < 0 ? 0 : ballanceAfterWithdraw
                                        :
                                        ballanceAfterDeposit < 0 ? 0 : ballanceAfterDeposit
                                    }
                                    <a
                                        href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                                        target="_blank"
                                        style={{display: 'block'}}
                                    >
                                        Token name
                                    </a>
                                </BlockSupply>
                                <BlockSupply>
                                    <TitleBlock>Deposited Amount</TitleBlock>
                                    {mode ?
                                        <>
                                            {depositAfterWithdraw}
                                            <a
                                                href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                                                target="_blank"
                                                style={{display: 'block'}}
                                            >
                                                Token name
                                            </a>
                                        </>
                                        :
                                        <>
                                            {depositAfterDeposit}
                                            <a
                                                href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                                                target="_blank"
                                                style={{display: 'block'}}
                                            >
                                                Token name
                                            </a>
                                        </>
                                    }
                                </BlockSupply>
                                <BlockSupply>
                                    <TitleBlock>Risk Factor</TitleBlock>
                                    0%
                                </BlockSupply>
                                <BlockSupply>
                                    <TitleBlock>Remaining Borrow</TitleBlock>
                                    {mode ?
                                        <NumberFormat
                                            value={remainingBorrowAfterWithdraw}
                                            displayType={'text'}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            thousandSeparator={true}
                                            prefix={'$'} />
                                        :
                                        (asCollateral ?
                                                <NumberFormat
                                                    value={remainingBorrowAfterDeposit}
                                                    displayType={'text'}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    thousandSeparator={true}
                                                    prefix={'$'} />
                                                :
                                                <NumberFormat
                                                    value={remainingBorrow}
                                                    displayType={'text'}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    thousandSeparator={true}
                                                    prefix={'$'} />
                                        )
                                    }
                                </BlockSupply>
                            </Cell>
                        </RowContainer>
                    </SupplyCard>
                </Cell>

                <Cell col={12} colLg={6}  style={{padding: '15px'}}>
                    <SupplyCard>
                        <BlockSupply>
                            {mode ?
                                <TitleBlock>How much would you like to withdraw?</TitleBlock>
                                :
                                <TitleBlock>How much would you like to deposit?</TitleBlock>
                            }
                            <AmountCard>
                                <RowContainer>
                                    <Cell col={6}>
                                        <TitleBlock>Amount</TitleBlock>
                                        <NumberFormat
                                            value={amount}
                                            onValueChange={(values) => handleChange(values)}
                                            allowLeadingZeros={false}
                                            isAllowed={withValueLimit}
                                        />
                                    </Cell>
                                    <Cell col={6}>
                                        <a
                                            href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                                            target="_blank"
                                            style={{display: 'block'}}
                                        >
                                            Token name
                                        </a>
                                    </Cell>
                                </RowContainer>
                            </AmountCard>
                            <div style={{textAlign: 'left', marginTop: '0.3rem'}}>
                                {mode ?
                                    <MaxAmount>Max Amount: {depositAmount}({collateralDeposit}) </MaxAmount>
                                    :
                                    <MaxAmount>Max Amount: {walletBalance} </MaxAmount>
                                }
                            </div>
                            {/*<CustomSlider*/}
                            {/*    value={amount}*/}
                            {/*    min={0}*/}
                            {/*    max={100}*/}
                            {/*    step={10}*/}
                            {/*    onChange={handleChange}*/}
                            {/*/>*/}
                            {mode ?
                                <ButtonGroup>
                                    <BlueButton
                                        theme={theme}
                                        btnWidth="calc(50% - 1rem)"
                                        style={{alignSelf: 'center', marginTop: '2rem'}}
                                        disabled={amount === 0 || reserveObligation?.collateral.inner.depositedAmount.toString()}
                                        onClick={() => withdrawLiq()}
                                    >
                                        Withdraw Liquidity
                                    </BlueButton>
                                    <BlueButton
                                        theme={theme}
                                        btnWidth="calc(50% - 1rem)"
                                        style={{alignSelf: 'center', marginTop: '2rem'}}
                                        disabled={ amount === 0 || typeof reserveObligation?.collateral.inner.depositedAmount === 'undefined' ? true : false}
                                        onClick={() => withdrawCollateral()}
                                    >
                                        Withdraw Collateral
                                    </BlueButton>
                                </ButtonGroup>
                                :
                                <>
                                    <BlueButton
                                        theme={theme}
                                        width="calc(50% - .5rem)"
                                        style={{alignSelf: 'center', marginTop: '2rem'}}
                                        disabled={amount === 0}
                                        onClick={() => depositLiq()}
                                    >
                                        Confirm
                                    </BlueButton>
                                </>
                            }
                        </BlockSupply>
                    </SupplyCard>
                </Cell>
            </RowContainer>

            <RowContainer width="90%" justify="flex-end" margin="2rem 0 0 0">
                <BlueButton
                    theme={theme}
                    width="calc(50% - .5rem)"
                    onClick={onClose}
                >
                    OK
                </BlueButton>
            </RowContainer>

        </DialogWrapper>
    )
}

export default ActionsPopup;
