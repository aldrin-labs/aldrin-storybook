import React from 'react'
import styled from 'styled-components'
import { InputTitle } from '@sb/components/TraidingTerminal/styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const SubColumnTitle = styled(InputTitle)`
  display: inline-block;
  width: 50%;
  padding: 0.4rem 0.5rem 0.4rem 0;
  text-align: left;
`

const SubColumnValue = styled(InputTitle)`
  display: inline-block;
  width: 50%;
  padding: 0.4rem 0rem 0.4rem 0.5rem;
  text-align: right;
  color: ${(props) => props.color || '#16253D'};
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
}: {
  price: number
  pair: string
  side: string
  order: string
  trailing: boolean
  amount: number
  total: number
  green: string
  red: string
  enableEdit: boolean
  blue: {
    first: string
    second: string
  }
  editTrade: () => void
}) => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <SubColumnTitle style={{ width: '75%' }}>
          <BtnCustom
            disable={!enableEdit}
            needMinWidth={false}
            btnWidth="40%"
            height="auto"
            fontSize=".9rem"
            padding=".1rem 0 0 0"
            borderRadius=".8rem"
            borderColor={blue.first}
            btnColor={'#fff'}
            backgroundColor={blue.second}
            hoverBackground={blue.first}
            transition={'all .4s ease-out'}
            onClick={editTrade}
          >
            edit
          </BtnCustom>
        </SubColumnTitle>
      </div>

      <div>
        <SubColumnTitle>pair</SubColumnTitle>
        <SubColumnValue>{pair}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>side</SubColumnTitle>
        <SubColumnValue color={side === 'buy' ? green : red}>
          {side}/{order}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>price</SubColumnTitle>
        <SubColumnValue>
          {trailing ? `Trailing ${trailing}%` : price}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>amount</SubColumnTitle>
        <SubColumnValue>{amount}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>total</SubColumnTitle>
        <SubColumnValue>{total.toFixed(2)}</SubColumnValue>
      </div>
    </>
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
    first: string
    second: string
  }
  editTrade: () => void
}) => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <SubColumnTitle style={{ width: '75%' }}>
          <BtnCustom
            needMinWidth={false}
            btnWidth="40%"
            height="auto"
            fontSize=".9rem"
            padding=".1rem 0 0 0"
            borderRadius=".8rem"
            borderColor={blue.first}
            btnColor={'#fff'}
            backgroundColor={blue.second}
            hoverBackground={blue.first}
            transition={'all .4s ease-out'}
            onClick={editTrade}
          >
            edit
          </BtnCustom>
        </SubColumnTitle>
      </div>
      <div>
        <SubColumnTitle>profit</SubColumnTitle>
        <SubColumnValue color={green}>
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
        <SubColumnTitle>targets</SubColumnTitle>
        <SubColumnValue>{targets.length || '-'}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>order</SubColumnTitle>
        <SubColumnValue>{order}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>trailing</SubColumnTitle>
        <SubColumnValue color={trailing ? green : red}>
          {trailing ? 'on' : 'off'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>timeout</SubColumnTitle>
        <SubColumnValue>
          {timeoutProfit || '-'} / {timeoutProfitable || '-'}
        </SubColumnValue>
      </div>
    </>
  )
}

export const StopLossColumn = ({
  price,
  forced,
  order,
  trailing,
  timeoutLoss,
  timeoutLossable,
  green,
  red,
  blue,
  editTrade,
}: {
  price: number
  forced?: boolean
  order: string
  trailing: boolean
  timeoutLoss?: number
  timeoutLossable?: number
  green: string
  red: string
  blue: {
    first: string
    second: string
  }
  editTrade: () => void
}) => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <SubColumnTitle style={{ width: '75%' }}>
          <BtnCustom
            needMinWidth={false}
            btnWidth="40%"
            height="auto"
            fontSize=".9rem"
            padding=".1rem 0 0 0"
            borderRadius=".8rem"
            borderColor={blue.first}
            btnColor={'#fff'}
            backgroundColor={blue.second}
            hoverBackground={blue.first}
            transition={'all .4s ease-out'}
            onClick={editTrade}
          >
            edit
          </BtnCustom>
        </SubColumnTitle>
      </div>
      <div>
        <SubColumnTitle>loss</SubColumnTitle>
        <SubColumnValue color={red}>-{price}%</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>forced</SubColumnTitle>
        <SubColumnValue color={forced ? green : red}>
          {forced ? 'on' : 'off'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>order</SubColumnTitle>
        <SubColumnValue>{order}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>trailing</SubColumnTitle>
        <SubColumnValue color={trailing ? green : red}>
          {trailing ? 'on' : 'off'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>timeout</SubColumnTitle>
        <SubColumnValue>
          {timeoutLoss || '-'} / {timeoutLossable || '-'}
        </SubColumnValue>
      </div>
    </>
  )
}

export const StatusColumn = ({
  status,
  profitAmount,
  profitPercentage,
  green,
  red,
  blue,
}: {
  status: string[]
  profitAmount: number
  profitPercentage: number
  green: string
  red: string
  blue: {
    first: string
    second: string
  }
}) => {
  return (
    <>
      <div>
        <SubColumnTitle>status</SubColumnTitle>
        <SubColumnValue color={status[1]}>{status[0]}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>pnl (roe)</SubColumnTitle>
        <SubColumnValue color={profitPercentage > 0 ? green : red}>
          {profitPercentage && profitAmount
            ? `${+profitAmount.toFixed(8)} / ${+profitPercentage.toFixed(2)}%`
            : '-'}
        </SubColumnValue>
      </div>
    </>
  )
}
