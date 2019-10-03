import LightTooltip from '@sb/components/TooltipCustom/LightTooltip'
import Help from '@material-ui/icons/Help'

const HelpTooltip = ({ title, style }: { title: string; style: any }) => {
  return (
    <LightTooltip title={title} placement={'right-end'}>
      <Help
        style={{
          ...style,
        }}
      />
    </LightTooltip>
  )
}

export default HelpTooltip
