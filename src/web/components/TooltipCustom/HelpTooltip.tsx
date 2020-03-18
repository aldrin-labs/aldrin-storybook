import React from 'react'
import LightTooltip from '@sb/components/TooltipCustom/LightTooltip'
import Help from '@material-ui/icons/Help'

const HelpTooltip = ({ title, style }: { title: string; style: any }) => {
  return (
    <LightTooltip title={title} placement={'right-end'}>
      <Help
        style={{
          height: '1.5rem',
          width: '1.5rem',
          color: 'rgb(0, 93, 217)',
          ...style,
        }}
      />
    </LightTooltip>
  )
}

export default HelpTooltip
