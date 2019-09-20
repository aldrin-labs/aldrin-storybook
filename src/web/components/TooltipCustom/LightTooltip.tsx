import { Tooltip, withStyles } from '@material-ui/core'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#fff',
    color: '#16253D',
    boxShadow: '0px 0px 8px rgba(8, 22, 58, 0.1);',
    fontSize: '1.2rem',
    top: '200%',
  },
}))(Tooltip)

export default LightTooltip
