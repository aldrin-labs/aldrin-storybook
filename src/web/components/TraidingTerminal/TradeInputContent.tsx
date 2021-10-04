import { Theme } from '@material-ui/core'
import React, { ChangeEvent, CSSProperties, KeyboardEvent, SyntheticEvent } from 'react'
import { InputRowContainer } from '../../compositions/Chart/components/SmartOrderTerminal/styles'
import { DarkTooltip } from '../TooltipCustom/Tooltip'
import { AbsoluteInputTitle, TitleForInput, TradeInput, UpdatedCoin } from './styles'


interface InputContentProps {
    isValid?: boolean
    showErrors?: boolean
    disabled?: boolean
    haveSelector?: boolean
    needTitle?: boolean
    needPreSymbol?: boolean
    preSymbol?: string
    symbolRightIndent?: string
    title?: string
    symbol?: string
    value: string | number
    pattern?: string
    step?: string | number
    min?: number
    type?: string
    padding?: string | number
    width?: string | number
    fontSize?: string
    textAlign?: string
    onKeyDown?: (e: KeyboardEvent) => void
    header?: any
    inputStyles?: CSSProperties
    theme?: Theme
    textDecoration?: string
    needTooltip?: boolean
    titleForTooltip?: string
    needTitleBlock?: boolean
    onTitleClick?: any
}

interface TradeInputContentProps extends InputContentProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}


export const TradeInputContent = (props: TradeInputContentProps) => {
    const {
        isValid = true,
        showErrors = false,
        disabled = false,
        haveSelector = false,
        needTitle = false,
        needPreSymbol = false,
        symbolRightIndent = '',
        preSymbol = '',
        title = '',
        symbol = '',
        value = '',
        pattern = '',
        step = '',
        min = 0,
        type = 'number',
        padding = '0',
        width = '100%',
        fontSize = '',
        textAlign = 'right',
        onChange = () => null,
        onKeyDown = () => null,
        inputStyles,
        header = '',
        theme,
        needTooltip = false,
        textDecoration,
        titleForTooltip = '',
        needTitleBlock = false,
        onTitleClick,
    } = props
    const handleSelect = (e: SyntheticEvent<HTMLInputElement>) => {
        e.target.select()
    }

    return (
        <InputRowContainer
            padding={padding}
            width={width}
            style={{ position: 'relative' }}
        >
            {needTitle && (
                <AbsoluteInputTitle
                    onClick={() => onTitleClick()}
                    style={{ ...(fontSize ? { fontSize } : {}) }}
                >
                    {title}
                </AbsoluteInputTitle>
            )}
            {needPreSymbol ? (
                <UpdatedCoin style={{ width: 0 }} left={'2rem'}>
                    {preSymbol}
                </UpdatedCoin>
            ) : null}
            {needTitleBlock ? (
                <>
                    {needTooltip ? (
                        <DarkTooltip title={titleForTooltip}>
                            <TitleForInput theme={theme} textDecoration={textDecoration}>
                                {header}
                            </TitleForInput>
                        </DarkTooltip>
                    ) : (
                            <TitleForInput theme={theme} textDecoration={textDecoration}>
                                {header}
                            </TitleForInput>
                        )}
                </>
            ) : null}

            <TradeInput
                theme={theme}
                align={textAlign}
                type={type}
                pattern={pattern}
                step={step}
                min={min}
                isValid={showErrors ? isValid : true}
                value={value}
                symbolLength={symbol.length}
                disabled={disabled}
                onChange={onChange}
                needPadding={symbol !== ''}
                haveSelector={haveSelector}
                style={{ ...inputStyles, ...(fontSize ? { fontSize: fontSize } : {}) }}
                onClick={handleSelect}
                onKeyDown={onKeyDown}
            />
            <UpdatedCoin
                theme={theme}
                right={
                    !!symbolRightIndent
                        ? symbolRightIndent
                        : symbol.length <= 2
                            ? '2.5rem'
                            : '1rem'
                }
            >
                {symbol}
            </UpdatedCoin>
        </InputRowContainer>
    )
}

export interface DecimalInputProps extends InputContentProps {
    step: number
    onChange: (value: string) => void
}

const stepToDecimals = (step: number) => {
    return `${step}`.split('.')[1]?.length || 0;
}

const doubleRegexp = /^\d+(\.?)\d{0,}$/;

const validateValue = (v: string) => {
    const isNumber = !!v.match(doubleRegexp);
    if (!isNumber) {
        return false;
    }
    return true;
}

const round = (v: number, to: number): number => Math.round(v / to) * to

export const DecimalInput = (props: DecimalInputProps) => {
    const { step, value, onChange: onChangeFn, ...p } = props
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            const v = parseFloat(`${value}`)
            const newValue = round(v + step, step)
            changeHandler(newValue)
            e.preventDefault()
        }

        if (e.key === 'ArrowDown') {
            const min = p.min || 0
            const v = parseFloat(`${value}`)
            const newValue = round(v - step, step)
            if (newValue > min) {
                changeHandler(newValue)
            }
            e.preventDefault()
        }
    }

    const changeHandler = (v: string | number) => {
        const value = v ? `${v}`.replace(',', '.') : `${v}`;

        if (validateValue(value) || v === '') {
            const decimals = stepToDecimals(step)

            const split = value.split('.')
            const i = split[0]
            const d = split[1] || ''

            const decLength = Math.min(d.length, decimals)
            const hasDot = value.indexOf('.') > 0
            const dec = d.slice(0, decLength);
            const result = `${i}${hasDot ? '.' : ''}${dec}`
            onChangeFn(result)
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        changeHandler(e.target.value)
    }
    return <TradeInputContent {...p} value={value} onChange={onChange} onKeyDown={onKeyDown} />
}