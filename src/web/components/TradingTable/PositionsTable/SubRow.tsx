import React, { useState, useEffect } from 'react'
import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Input } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import { BalanceFuturesSymbol as Typography } from '@sb/compositions/Chart/components/Balances'

const SubRow = ({
  theme,
  getVariables,
  createOrderWithStatus,
  positionId,
  priceFromOrderbook,
  enqueueSnackbar,
  minFuturesStep,
}) => {
  const [price, updateClosePrice] = useState('')
  const [amount, updateCloseAmount] = useState('100')
  const [isClosingPositionProcessEnabled, closePosition] = useState(false)
  const [closingType, setClosingType] = useState('')

  useEffect(() => {
    if (priceFromOrderbook != null) {
      updateClosePrice(priceFromOrderbook)
    }
  }, [priceFromOrderbook])

  const isPriceFieldEmpty = price == ''

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Typography theme={theme}>close:</Typography>
        <Input
          theme={theme}
          width={'30%'}
          padding={'0 .5rem 0 1rem'}
          value={price}
          placeholder={'price'}
          onChange={(e) => {
            updateClosePrice(e.target.value)
          }}
          inputStyles={{
            textTransform: 'uppercase',
            fontSize: '1.2rem',
            color: theme.palette.blue.main,
          }}
        />
        <div style={{ position: 'relative', width: '25rem' }}>
          {/* <Input
            theme={theme}
            padding={'0'}
            width={'45%'}
            textAlign={'left'}
            symbol={'%'}
            value={amount}
            inputStyles={{
              textTransform: 'uppercase',
              fontSize: '1rem',
              color: theme.palette.blue.main,
            }}
            disabled={'none'}
          /> */}
          <Input
            theme={theme}
            width={'100%'}
            padding={'0 .5rem 0 1rem'}
            value={amount}
            onChange={(e) => {
              updateCloseAmount(e.target.value)
            }}
            inputStyles={{
              textTransform: 'uppercase',
              fontSize: '1.3rem',
              color: theme.palette.blue.main,
              paddingLeft: '7.5rem',
            }}
          />{' '}
          <div
            style={{
              position: 'absolute',
              left: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1rem',
              letterSpacing: '0',
              fontFamily: 'DM Sans',
              color: '#abbad1',
              // paddingBottom: '.3rem',
            }}
          >
            AMOUNT
          </div>
          <div
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.palette.grey.light,
              fontSize: '1.6rem',
            }}
          >
            %
          </div>
        </div>

        <BtnCustom
          btnWidth="30%"
          height="3rem"
          fontSize="1rem"
          padding=".5rem 0 .4rem 0"
          margin="0 .5rem 0 .5rem"
          borderRadius=".8rem"
          btnColor={
            isPriceFieldEmpty
              ? theme.palette.grey.text
              : theme.palette.blue.main
          }
          backgroundColor={theme.palette.white.background}
          hoverColor={
            isPriceFieldEmpty
              ? theme.palette.grey.text
              : theme.palette.white.main
          }
          hoverBackground={
            isPriceFieldEmpty
              ? theme.palette.white.background
              : theme.palette.blue.main
          }
          transition={'all .4s ease-out'}
          disabled={isClosingPositionProcessEnabled && closingType === 'limit'}
          onClick={async () => {
            if (isPriceFieldEmpty) {
              enqueueSnackbar('Enter limit price for closing position', {
                variant: 'error',
              })
            } else {
              setClosingType('limit')
              closePosition(true)
              const response = await createOrderWithStatus(
                getVariables('limit', +price, +amount),
                positionId
              )

              if (!response) {
                setClosingType('')
                closePosition(false)
              }
            }
          }}
        >
          limit
        </BtnCustom>
        <BtnCustom
          btnWidth="30%"
          height="3rem"
          fontSize="1rem"
          padding=".5rem 0 .4rem 0"
          borderRadius=".8rem"
          btnColor={theme.palette.blue.main}
          backgroundColor={theme.palette.white.background}
          hoverColor={'#fff'}
          hoverBackground={theme.palette.blue.main}
          transition={'all .4s ease-out'}
          disabled={isClosingPositionProcessEnabled && closingType === 'market'}
          onClick={async () => {
            setClosingType('market')
            closePosition(true)
            const response = await createOrderWithStatus(
              getVariables('market', +price, +amount),
              positionId
            )

            if (!response) {
              setClosingType('')
              closePosition(false)
            }
            console.log('amount', amount)
          }}
        >
          market
        </BtnCustom>
      </div>
    </div>
  )
}

export default SubRow
