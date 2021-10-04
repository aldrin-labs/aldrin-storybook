

import { Theme } from '@material-ui/core'
import { Line } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import React from 'react'
import { BlueInputTitle, SeparateInputTitle } from './styles'


export interface TradeInputHeaderProps {
    title: string
    padding: string
    needLine: boolean
    lineMargin: string
    needRightValue: boolean
    rightValue: string
    haveTooltip: boolean
    tooltipText: boolean
    onValueClick: () => void
    theme: Theme
}

export const TradeInputHeader = (props: TradeInputHeaderProps) => {
    const {
        title = 'Input',
        padding = '0 0 .8rem 0',
        needLine = true,
        lineMargin,
        needRightValue = false,
        rightValue = 'Value',
        haveTooltip = false,
        tooltipText = '',
        onValueClick = () => null,
        theme,
    } = props

    const separatorTitle = (
        <SeparateInputTitle
            theme={theme}
        >
            {title}
        </SeparateInputTitle>
    )

    return (
        <InputRowContainer
            justify={needRightValue ? 'space-between' : 'flex-start'}
            padding={padding}
        >
            {haveTooltip ? (
                <>
                    <DarkTooltip
                        title={tooltipText}
                        maxWidth={'30rem'}
                        placement="top"
                        enterDelay={10000}
                    >
                        {separatorTitle}
                    </DarkTooltip>
                </>
            ) : separatorTitle}
            {needLine && <Line theme={theme} lineMargin={lineMargin} />}
            {needRightValue && (
                <BlueInputTitle theme={theme} onClick={() => onValueClick()}>
                    {rightValue}
                </BlueInputTitle>
            )}
        </InputRowContainer>
    )
}