import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { InputTitle } from '@sb/components/TraidingTerminal/styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

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
    props.color || '#16253D'};
`

export const BlockContainer = styled.div`
  width: 25%;
  display: inline-block;
  padding: 0 2.5%;
  border-right: 0.1rem solid #e0e5ec;
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
}: {
  price: number
  pair: string
  side: string
  order: string
  trailing: boolean
  amount: number
  activatePrice: number
  total: number
  green: string
  red: string
  enableEdit: boolean
  blue: {
    first: string
    second: string
  }
  haveEdit: boolean
  editTrade: () => void
}) => {
  return (
    <BlockContainer>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SubColumnValue>entry point</SubColumnValue>
        {haveEdit && (
          <SubColumnTitle style={{ width: 'auto', padding: '0' }}>
            <BtnCustom
              disable={!enableEdit}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize=".9rem"
              padding=".1rem .5rem 0 .5rem"
              borderRadius=".8rem"
              borderColor={enableEdit ? blue.first : '#e0e5ec'}
              btnColor={'#fff'}
              backgroundColor={enableEdit ? blue.second : '#e0e5ec'}
              hoverBackground={enableEdit ? blue.first : '#e0e5ec'}
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
        <SubColumnTitle>pair</SubColumnTitle>
        <SubColumnValue textAlign={'right'}>{pair}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>side</SubColumnTitle>
        <SubColumnValue textAlign={'right'}>
          <span style={{ color: side === 'buy' ? green : red }}>{side}</span>/
          {order}
        </SubColumnValue>
      </div>

      <div style={{ display: 'flex' }}>
        <SubColumnTitle>price</SubColumnTitle>
        <SubColumnValue style={{ display: 'block' }} textAlign={'right'}>
          {trailing ? (
            <span>
              Trailing <span style={{ color: green }}>{trailing}%</span>
            </span>
          ) : order === 'market' ? (
            'market'
          ) : (
            price
          )}
          {trailing && (
            <span style={{ display: 'block' }}>{activatePrice}</span>
          )}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>amount</SubColumnTitle>
        <SubColumnValue textAlign={'right'}>{amount}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>total</SubColumnTitle>
        <SubColumnValue textAlign={'right'}>{total.toFixed(2)}</SubColumnValue>
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
  haveEdit: boolean
  enableEdit: boolean
  editTrade: () => void
}) => {
  return (
    <BlockContainer style={{ position: 'absolute', left: '25%' }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SubColumnValue>take profit</SubColumnValue>
        {haveEdit && (
          <SubColumnTitle style={{ width: 'auto', padding: '0' }}>
            <BtnCustom
              disable={!enableEdit}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize=".9rem"
              padding=".1rem .5rem 0 .5rem"
              borderRadius=".8rem"
              borderColor={enableEdit ? blue.first : '#e0e5ec'}
              btnColor={'#fff'}
              backgroundColor={enableEdit ? blue.second : '#e0e5ec'}
              hoverBackground={blue.first}
              transition={'all .4s ease-out'}
              onClick={editTrade}
            >
              edit
            </BtnCustom>
          </SubColumnTitle>
        )}
      </div>
      <div>
        <SubColumnTitle>profit</SubColumnTitle>
        <SubColumnValue color={green} textAlign={'right'}>
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
        <SubColumnValue textAlign={'right'}>
          {targets.length || '-'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>order</SubColumnTitle>
        <SubColumnValue textAlign={'right'}>{order}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>trailing</SubColumnTitle>
        <SubColumnValue textAlign={'right'} color={trailing ? green : red}>
          {trailing ? 'on' : 'off'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>timeout</SubColumnTitle>
        <SubColumnValue textAlign={'right'}>
          {timeoutProfit || '-'} / {timeoutProfitable || '-'}
        </SubColumnValue>
      </div>
    </BlockContainer>
  )
}

export const StopLossColumn = ({
  price,
  forced,
  order,
  timeoutLoss,
  timeoutLossable,
  green,
  red,
  blue,
  editTrade,
  haveEdit,
  enableEdit,
}: {
  price: number
  forced?: boolean
  order: string
  timeoutLoss?: number
  timeoutLossable?: number
  green: string
  red: string
  blue: {
    first: string
    second: string
  }
  haveEdit: boolean
  enableEdit: boolean
  editTrade: () => void
}) => {
  return (
    <BlockContainer style={{ position: 'absolute', left: '50%' }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SubColumnValue>stop loss</SubColumnValue>
        {haveEdit && (
          <SubColumnTitle style={{ width: 'auto', padding: '0' }}>
            <BtnCustom
              disabled={!enableEdit}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize=".9rem"
              padding=".1rem .5rem 0 .5rem"
              borderRadius=".8rem"
              borderColor={enableEdit ? blue.first : '#e0e5ec'}
              btnColor={'#fff'}
              backgroundColor={enableEdit ? blue.second : '#e0e5ec'}
              hoverBackground={blue.first}
              transition={'all .4s ease-out'}
              onClick={editTrade}
            >
              edit
            </BtnCustom>
          </SubColumnTitle>
        )}
      </div>
      <div>
        <SubColumnTitle>loss</SubColumnTitle>
        <SubColumnValue textAlign={'right'} color={red}>
          -{price}%
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>forced</SubColumnTitle>
        <SubColumnValue textAlign={'right'} color={forced ? green : red}>
          {forced ? 'on' : 'off'}
        </SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>order</SubColumnTitle>
        <SubColumnValue textAlign={'right'}>{order}</SubColumnValue>
      </div>

      <div>
        <SubColumnTitle>timeout</SubColumnTitle>
        <SubColumnValue textAlign={'right'}>
          {timeoutLoss || '-'} / {timeoutLossable || '-'}
        </SubColumnValue>
      </div>
    </BlockContainer>
  )
}

export const DateColumn = ({ createdAt }) => {
  return (
    <BlockContainer style={{ position: 'absolute', right: '0' }}>
      {moment(createdAt)
        .format('LT')
        .toLowerCase() !== 'invalid date' ? (
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', color: '#16253D' }}>
            {String(moment(createdAt).format('DD-MM-YYYY')).replace(/-/g, '.')}
          </span>
          <span style={{ color: '#7284A0' }}>
            {moment(createdAt).format('LT')}
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
        <SubColumnValue style={{ textTransform: 'none' }} color={status[1]}>
          {status[0]}
        </SubColumnValue>
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
