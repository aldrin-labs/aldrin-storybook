import React, { useState } from 'react'
import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Input } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import { BalanceFuturesSymbol as Typography } from '@sb/compositions/Chart/components/Balances'

const SubRow = ({}) => {
  const [enableEdit, updateEnableEdit] = useState(false)
  const [price, updateClosePrice] = useState('')

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      {/* <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>enable edit:</Typography>
        <GreenSwitcher
          checked={enableEdit}
          handleToggle={() => updateEnableEdit(!enableEdit)}
        />
      </div> */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Typography>close:</Typography>
        <Input
          width={'30%'}
          padding={'0 .5rem 0 1rem'}
          value={price}
          placeholder={'price'}
          onChange={(e) => updateClosePrice(e.target.price)}
          inputStyles={{ textTransform: 'uppercase', color: '#ABBAD1' }}
        />
        <BtnCustom
          btnWidth="30%"
          height="3rem"
          fontSize="1rem"
          padding=".5rem 0 .4rem 0"
          margin="0 .5rem 0 .5rem"
          borderRadius=".8rem"
          btnColor={'#0B1FD1'}
          backgroundColor={'#fff'}
          hoverColor={'#fff'}
          hoverBackground={'#0B1FD1'}
          transition={'all .4s ease-out'}
        >
          limit
        </BtnCustom>
        <BtnCustom
          btnWidth="30%"
          height="3rem"
          fontSize="1rem"
          padding=".5rem 0 .4rem 0"
          borderRadius=".8rem"
          btnColor={'#0B1FD1'}
          backgroundColor={'#fff'}
          hoverColor={'#fff'}
          hoverBackground={'#0B1FD1'}
          transition={'all .4s ease-out'}
        >
          market
        </BtnCustom>
      </div>
    </div>
  )
}

export default SubRow
