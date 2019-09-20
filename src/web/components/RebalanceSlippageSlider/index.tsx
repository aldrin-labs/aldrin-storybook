import React from 'react'
import Slider from '@sb/components/Slider/Slider'

import { TooltipCustom } from '@sb/components/index'
import { TypographyCustomHeading } from '@sb/components/RebalanceDialogTransaction/RebalanceDialogTransaction.styles'
import { SliderTypography } from '@sb/components/RebalanceAccorionIndex/RebalanceAccordionIndex.styles'

const RebalanceSlippageSlider = ({
  slippageValue,
  onChangeSlippage,
  disabled,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TypographyCustomHeading style={{ color: '#7284A0', fontSize: '1.4rem' }}>
        max slippage from market price
      </TypographyCustomHeading>
      <div style={{ display: 'flex', marginTop: '15px' }}>
        <div style={{ position: 'relative' }}>
          <TooltipCustom
            title={'You can not change slippage while rebalance is executing'}
            placement="top"
            disableHoverListener={!disabled}
            component={
              <Slider
                // add responsive for all sliders
                thumbWidth="2.4rem"
                thumbHeight="2.4rem"
                sliderWidth="18rem"
                sliderHeight="1.7rem"
                sliderHeightAfter="20px"
                borderRadius="3rem"
                borderRadiusAfter="3rem"
                thumbBackground="#165BE0"
                borderThumb={`2px solid ${!disabled ? 'white' : '#165BE0'}`}
                trackAfterBackground="#7284A0"
                trackBeforeBackground={'#2F7619'}
                value={slippageValue}
                onChange={(e, value) => onChangeSlippage(value)}
                style={{ top: '1rem' }}
                disabled={disabled}
                disabledText={''}
                min={0}
                max={100}
                step={1}
              />
            }
          />
        </div>

        <SliderTypography
          fontWeight="bold"
          color={'#16253D'}
          fontSize={`1.2rem`}
          marginLeft="15px"
        >
          {slippageValue.toFixed(0)}%
        </SliderTypography>
      </div>
    </div>
  )
}

export default RebalanceSlippageSlider
