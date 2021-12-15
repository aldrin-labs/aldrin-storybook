import React from 'react'

import { Theme, withTheme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import CloseIcon from '@icons/closeIcon.svg'

import {
    BlueButton,
    StyledPaper,
    Title,
} from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles';
import {Cell} from '@sb/components/Layout';

import {
    DescriptionBlock, StatsDescription, StatsItem, StatsList, StatsName,
    SubtitleBlock,
    TextBlock,
    TitleBlock, UtilizationChart
} from './ReserveStatusPopup.styles';
import {toNumberWithDecimals} from '@sb/dexUtils/borrow-lending/U192-converting';

const ReserveStatusPopup = ({
    theme,
    onClose,
    open,
    availableLiq,
    availableLiqWorth,
    borrowedAmount,
    borrowedAmountWorth,
    utilization,
    maxLTV,
    liquidationThreshold,
    liquidationBonus,
    depositApy,
 }: {
    theme: Theme
    onClose: () => void
    open: boolean,
    availableLiq: number,
    availableLiqWorth: number,
    borrowedAmount: number,
    borrowedAmountWorth: number,
    utilization: number,
    maxLTV: number,
    liquidationThreshold: number,
    liquidationBonus: number,
    depositApy: number
}) => {

    return (
        <DialogWrapper
            theme={theme}
            PaperComponent={StyledPaper}
            fullScreen={false}
            onClose={onClose}
            PaperProps={{ width: '90rem', height: '70rem' }}
            maxWidth={'lg'}
            open={open}
            aria-labelledby="responsive-dialog-title"
        >
            <RowContainer style={{ marginBottom: '1rem' }} justify={'space-between'}>
                <Title>
                    Reserve Status & Configuration
                </Title>
                <SvgIcon
                    onClick={() => onClose()}
                    src={CloseIcon}
                    style={{ cursor: 'pointer' }}
                    width={'2rem'}
                    height={'2rem'}
                />
            </RowContainer>
            <RowContainer>
                <Cell col={12} colLg={6}>
                    <TextBlock>
                        <TitleBlock>Available Liquidity</TitleBlock>
                        <SubtitleBlock>{availableLiq}</SubtitleBlock>
                        <DescriptionBlock>${toNumberWithDecimals(availableLiqWorth, 2)}</DescriptionBlock>
                    </TextBlock>
                    <TextBlock>
                        <TitleBlock>Total Borrowed</TitleBlock>
                        <SubtitleBlock>{borrowedAmount}</SubtitleBlock>
                        <DescriptionBlock>${toNumberWithDecimals(borrowedAmountWorth, 2)}</DescriptionBlock>
                    </TextBlock>
                </Cell>
                <Cell col={12} colLg={6}>
                    <UtilizationChart>
                        <TitleBlock>Utilization</TitleBlock>
                        <SubtitleBlock>{utilization % 1 !== 0 ? utilization.toFixed(2) : utilization}%</SubtitleBlock>
                    </UtilizationChart>
                </Cell>
            </RowContainer>

            <RowContainer>
                <StatsList>
                    <StatsItem>
                        <StatsName>Maximum LTV</StatsName>
                        <StatsDescription>{maxLTV}%</StatsDescription>
                    </StatsItem>
                    <StatsItem>
                        <StatsName>Liquidation threshold</StatsName>
                        <StatsDescription>{liquidationThreshold}%</StatsDescription>
                    </StatsItem>
                    <StatsItem>
                        <StatsName>Liquidation penalty</StatsName>
                        <StatsDescription>{liquidationBonus}%</StatsDescription>
                    </StatsItem>
                    <StatsItem>
                        <StatsName>Deposit APY</StatsName>
                        <StatsDescription>{depositApy}%</StatsDescription>
                    </StatsItem>
                </StatsList>
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

export default ReserveStatusPopup;
