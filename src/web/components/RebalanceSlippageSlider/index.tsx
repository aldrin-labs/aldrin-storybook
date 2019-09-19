import React from 'react'
import Slider from '@sb/components/Slider/Slider'
import Tooltip from '@material-ui/core/Tooltip'

import { TypographyCustomHeading } from '@sb/components/RebalanceDialogTransaction/RebalanceDialogTransaction.styles'
import { SliderTypography } from '@sb/components/RebalanceAccorionIndex/RebalanceAccordionIndex.styles'

const RebalanceSlippageSlider = ({
  slippageValue = 5,
  onChangeSlippage,
  disabled,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TypographyCustomHeading color="#7284A0">
        max slippage from market price
      </TypographyCustomHeading>
      <div style={{ display: 'flex', marginTop: '15px' }}>
        <Slider
          thumbWidth="25px"
          thumbHeight="25px"
          sliderWidth="18rem"
          sliderHeight="17px"
          sliderHeightAfter="20px"
          borderRadius="30px"
          borderRadiusAfter="30px"
          thumbBackground="#165BE0"
          borderThumb="2px solid white"
          trackAfterBackground="#E7ECF3"
          trackBeforeBackground={'#e0e5ec'}
          value={slippageValue}
          onChange={(e, value) => onChangeSlippage(value)}
          style={{ top: '1rem' }}
          disabled={disabled}
          min={0}
          max={100}
        />
        <Tooltip title={`${slippageValue.toFixed(4)}%`} placement="bottom-end">
          <SliderTypography
            fontWeight="bold"
            color={'#6d849e'}
            fontSize={`1.2rem`}
            marginLeft="15px"
          >
            {slippageValue.toFixed(0)}%
          </SliderTypography>
        </Tooltip>
      </div>
    </div>
  )
}

export default RebalanceSlippageSlider
