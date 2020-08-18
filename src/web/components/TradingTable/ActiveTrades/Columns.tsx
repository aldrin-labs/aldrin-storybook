import React from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

import { InputTitle } from '@sb/components/TraidingTerminal/styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Theme } from '@material-ui/core'

export const SubColumnTitle = styled(InputTitle)`
  display: inline-block;
  width: 50%;
  padding: 0.4rem 0.5rem 0.4rem 0;
  text-align: left;
`

export const SubColumnValue = styled(InputTitle)`
  text-align: ${(props: { textAlign?: string; color?: string }) =>
    props.textAlign || 'left'};
  display: inline-block;
  width: 50%;
  padding: 0.4rem 0rem 0.4rem 0rem;
  color: ${(props: { textAlign?: string; color?: string }) =>
    props.color || props.theme.palette.dark.main};
`

export const BlockContainer = styled.div`
  width: 25%;
  display: inline-block;
  padding: 0 2.5%;
  border-right: ${(props) => props.theme.palette.border.main};
`

export const EntryOrderColumn = ({
  price,
  pair,
  side,
  order,
  trailing,
  amount,
  total,
  green,
  red,
  blue,
  enableEdit,
  editTrade,
  haveEdit,
  activatePrice,
  theme,
}: {
  price: number
  pair: string
  side: string
  order: string
  trailing: string | number
  amount: number
  activatePrice: number
  total: number
  green: string
  red: string
  enableEdit: boolean
  blue: {
    main: string
    main: string
  }
  haveEdit: boolean
  editTrade: () => void
  theme: Theme
}) => {
  return (
    <BlockContainer theme={theme}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SubColumnValue theme={theme}>entry point</SubColumnValue>
        {haveEdit && (
          <SubColumnTitle theme={theme} style={{ width: 'auto', padding: '0' }}>
            <BtnCustom
              disable={!enableEdit}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize=".9rem"
              padding=".1rem .5rem 0 .5rem"
              borderRadius=".8rem"
              borderColor={enableEdit ? blue.main : '#e0e5ec'}
              btnColor={'#fff'}
              backgroundColor={enableEdit ? blue.main : '#e0e5ec'}
              hoverBackground={enableEdit ? blue.main : '#e0e5ec'}
              transition={'all .4s ease-out'}
              onClick={enableEdit ? editTrade : () => {}}
              style={enableEdit ? {} : { cursor: 'default' }}
            >
              edit
            </BtnCustom>
          </SubColumnTitle>
        )}
      </div>

      <div>
        <SubColumnTitle theme={theme}>pair</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'}>
          {pair}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>side</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'}>
          <span style={{ color: side === 'buy' ? green : red }}>{side}</span>/
          {order}
        </SubColumnValue>
      </div>

      <div style={{ display: 'flex' }}>
        <SubColumnTitle theme={theme}>price</SubColumnTitle>
        <SubColumnValue
          theme={theme}
          style={{ display: 'block' }}
          textAlign={'right'}
        >
          {trailing ? (
            <span>
              Trailing <span style={{ color: green }}>{trailing}%</span>
            </span>
          ) : order === 'market' ? (
            'market'
          ) : (
            price
          )}
          {trailing ? (
            <span style={{ display: 'block' }}>{activatePrice}</span>
          ) : null}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>amount</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'}>
          {amount}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>total</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'}>
          {total.toFixed(2)}
        </SubColumnValue>
      </div>
    </BlockContainer>
  )
}

export const TakeProfitColumn = ({
  price,
  targets,
  order,
  trailing,
  timeoutProfit,
  timeoutProfitable,
  green,
  red,
  blue,
  editTrade,
  enableEdit,
  haveEdit,
  theme,
}: {
  price: number
  targets?: any
  order: string
  trailing: boolean
  timeoutProfit?: number
  timeoutProfitable?: number
  green: string
  red: string
  blue: {
    main: string
    main: string
  }
  haveEdit: boolean
  enableEdit: boolean
  editTrade: () => void
  theme: Theme
}) => {
  return (
    <BlockContainer theme={theme} style={{ position: 'absolute', left: '25%' }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SubColumnValue theme={theme}>take profit</SubColumnValue>
        {haveEdit && (
          <SubColumnTitle theme={theme} style={{ width: 'auto', padding: '0' }}>
            <BtnCustom
              disable={!enableEdit}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize=".9rem"
              padding=".1rem .5rem 0 .5rem"
              borderRadius=".8rem"
              borderColor={enableEdit ? blue.main : '#e0e5ec'}
              btnColor={'#fff'}
              backgroundColor={enableEdit ? blue.main : '#e0e5ec'}
              hoverBackground={blue.main}
              transition={'all .4s ease-out'}
              onClick={editTrade}
            >
              edit
            </BtnCustom>
          </SubColumnTitle>
        )}
      </div>
      <div>
        <SubColumnTitle theme={theme}>profit</SubColumnTitle>
        <SubColumnValue theme={theme} color={green} textAlign={'right'}>
          {trailing
            ? 'trailing'
            : targets[0] && targets[0].amount
            ? 'split'
            : price
            ? `+${price}%`
            : '-'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>targets</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'}>
          {targets.length || '-'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>order</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'}>
          {order}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>trailing</SubColumnTitle>
        <SubColumnValue
          theme={theme}
          textAlign={'right'}
          color={trailing ? green : red}
        >
          {trailing ? 'on' : 'off'}
        </SubColumnValue>
      </div>

      {/* <div>
        <SubColumnTitle theme={theme}>timeout</SubColumnTitle>
        <SubColumnValue 
theme={theme} 
 theme={theme} theme={theme} textAlign={'right'}>
          {timeoutProfit || '-'} / {timeoutProfitable || '-'}
        </SubColumnValue>
      </div> */}
    </BlockContainer>
  )
}

export const StopLossColumn = ({
  price,
  forced,
  order,
  timeoutWhenLoss,
  timeoutLoss,
  green,
  red,
  blue,
  editTrade,
  haveEdit,
  enableEdit,
  theme,
}: {
  price: number
  forced?: boolean
  order: string
  timeoutWhenLoss?: number
  timeoutLoss?: number
  green: string
  red: string
  blue: {
    main: string
    main: string
  }
  haveEdit: boolean
  enableEdit: boolean
  editTrade: () => void
  theme: Theme
}) => {
  return (
    <BlockContainer theme={theme} style={{ position: 'absolute', left: '50%' }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SubColumnValue theme={theme}>stop loss</SubColumnValue>
        {haveEdit && (
          <SubColumnTitle theme={theme} style={{ width: 'auto', padding: '0' }}>
            <BtnCustom
              disabled={!enableEdit}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize=".9rem"
              padding=".1rem .5rem 0 .5rem"
              borderRadius=".8rem"
              borderColor={enableEdit ? blue.main : '#e0e5ec'}
              btnColor={'#fff'}
              backgroundColor={enableEdit ? blue.main : '#e0e5ec'}
              hoverBackground={blue.main}
              transition={'all .4s ease-out'}
              onClick={editTrade}
            >
              edit
            </BtnCustom>
          </SubColumnTitle>
        )}
      </div>
      <div>
        <SubColumnTitle theme={theme}>loss</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'} color={red}>
          -{price}%
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>forced</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'} color={red}>
          {!!forced ? `-${forced}%` : 'off'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>order</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'}>
          {order}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>timeout</SubColumnTitle>
        <SubColumnValue theme={theme} textAlign={'right'}>
          {/* {timeoutWhenLoss || '-'} /  */}
          {timeoutLoss || '-'}
        </SubColumnValue>
      </div>
    </BlockContainer>
  )
}

export const DateColumn = ({ createdAt, theme }) => {
  return (
    <BlockContainer theme={theme} style={{ position: 'absolute', right: '0' }}>
      {dayjs(createdAt)
        .format('LT')
        .toLowerCase() !== 'invalid date' ? (
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', color: theme.palette.dark.main }}>
            {String(dayjs(createdAt).format('ll'))}
          </span>
          <span style={{ color: theme.palette.grey.text }}>
            {dayjs(createdAt).format('LT')}
          </span>
        </div>
      ) : (
        <>-</>
      )}
    </BlockContainer>
  )
}

export const StatusColumn = ({
  status,
  profitAmount,
  profitPercentage,
  green,
  red,
  blue,
  theme,
}: {
  status: string[]
  profitAmount: number
  profitPercentage: number
  green: string
  red: string
  blue: {
    main: string
    main: string
  }
  theme: Theme
}) => {
  return (
    <>
      <div>
        <SubColumnTitle theme={theme}>status</SubColumnTitle>
        <SubColumnValue
          theme={theme}
          style={{ textTransform: 'none' }}
          color={status[1]}
        >
          {status[0]}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle theme={theme}>pnl (roe)</SubColumnTitle>
        <SubColumnValue
          theme={theme}
          color={profitPercentage > 0 ? green : red}
        >
          {profitPercentage && profitAmount
            ? `${+profitAmount.toFixed(8)} / ${+profitPercentage.toFixed(2)}%`
            : '-'}
        </SubColumnValue>
      </div>
    </>
  )
}
