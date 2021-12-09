import React, { useEffect, useState } from 'react'

import { Theme, withTheme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import CloseIcon from '@icons/closeIcon.svg'

import {
    BlueButton,
    StyledPaper,
    Title,
} from "@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles";
import {WhiteButton} from "@sb/components/TraidingTerminal/ConfirmationPopup";
import {createTokens} from "@sb/dexUtils/createTokens";
import {Cell} from "@sb/components/Layout";
import CurrentMarketSize from "@sb/compositions/BorrowLending/Markets/components/CurrentMarketSize/CurrentMarketSize";
import BorrowedLent from "@sb/compositions/BorrowLending/Markets/components/BorrowedLent/BorrowedLent";
import MarketComposition from "@sb/compositions/BorrowLending/Markets/components/MarketComposition/MarketComposition";
import {RootRow} from "@sb/compositions/Pools/components/Charts/styles";

const ReserveStatusPopup = ({
     theme,
     onClose,
     open,
 }: {
    theme: Theme
    onClose: () => void
    open: boolean
}) => {

    return (
        <DialogWrapper
            theme={theme}
            PaperComponent={StyledPaper}
            fullScreen={false}
            onClose={onClose}
            PaperProps={{ width: '135rem', height: '75rem' }}
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
                    {/*<TextBlock>*/}
                    {/*    <TitleBlock>Available Liquidity</TitleBlock>*/}
                    {/*    <SubtitleBlock>1,568,333</SubtitleBlock>*/}
                    {/*    <DescriptionBlock>$1,569,587.37</DescriptionBlock>*/}
                    {/*</TextBlock>*/}
                </Cell>
                <Cell col={12} colLg={6}>
                    <h3>dsadsad</h3>
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

export default ReserveStatusPopup;
