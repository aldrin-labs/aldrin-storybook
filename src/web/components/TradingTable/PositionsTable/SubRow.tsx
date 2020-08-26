import React, { useState, useEffect } from 'react'
import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Input } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import { BalanceFuturesSymbol as Typography } from '@sb/compositions/Chart/components/Balances'
import { Loading } from '@sb/components/index'

const SubRow = ({
  theme,
  getVariables,
  createOrderWithStatus,
  positionId,
  priceFromOrderbook,
}) => {
  const [price, updateClosePrice] = useState('')
  const [isClosingPositionProcessEnabled, closePosition] = useState(false)
  const [closingType, setClosingType] = useState('')

  useEffect(() => {
    updateClosePrice(priceFromOrderbook)
  }, [priceFromOrderbook])

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
          inputStyles={{ textTransform: 'uppercase', color: theme.palette.blue.main }}
        />
        <BtnCustom
          btnWidth="30%"
          height="3rem"
          fontSize="1rem"
          padding=".5rem 0 .4rem 0"
          margin="0 .5rem 0 .5rem"
          borderRadius=".8rem"
          btnColor={theme.palette.blue.main}
          backgroundColor={theme.palette.white.background}
          hoverColor={'#fff'}
          hoverBackground={theme.palette.blue.main}
          transition={'all .4s ease-out'}
          disabled={isClosingPositionProcessEnabled && closingType === 'limit'}
          onClick={async () => {
            setClosingType('limit')
            closePosition(true)
            const response = await createOrderWithStatus(
              getVariables('limit', +price),
              positionId
            )

            if (!response) {
              setClosingType('')
              closePosition(false)
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
              getVariables('market'),
              positionId
            )

            if (!response) {
              setClosingType('')
              closePosition(false)
            }
          }}
        >
          market
        </BtnCustom>
      </div>
    </div>
  )
}

export default SubRow
