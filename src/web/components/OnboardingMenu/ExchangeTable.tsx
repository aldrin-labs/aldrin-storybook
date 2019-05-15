import * as React from 'react'
import { Paper, Grid, Typography } from '@material-ui/core'
import SvgIcon from '@sb/components/SvgIcon/'

import { withStyles } from '@material-ui/core/styles'
import BinanceLogo from '@icons/Binance_logo.svg'
import CoinBasePro from '@icons/CoinBasePro.svg'
import SelectedLogo from '@icons/Selected.png'

import {
  ExhangeButton,
  ExchangeGrid,
  ExhangeTypography,
  StyledLogo,
  Selected,
  SelectedContainer,
} from './styles'

const exchangeList = [
  {
    active: true,
    icon: BinanceLogo,
  },
  {
    icon: CoinBasePro,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  }
]

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
})

const Cell = ({active, icon, selected, selectExgange}) => (
  <>
    {selected &&
    <SelectedContainer>
      <Selected src={SelectedLogo}/>
    </SelectedContainer>
    }
    <ExhangeTypography
      align="center"
      variant="caption"
    >
      {active ? '\u00A0' : `Comming Soon`}
    </ExhangeTypography>
    <ExhangeButton active={active} onClick={selectExgange}>
      <SvgIcon src={icon} width={84} height={18} />
    </ExhangeButton>
  </>
)

export class ExchangeTable extends React.Component {

  render() {
    const { classes, selected, selectExgange } = this.props
    return (
      <Grid container spacing={0}>
        {exchangeList.map((exchange, index) => (
          <Grid item xs={4}>
            <Cell
              icon={exchange.icon}
              active={exchange.active}
              selectExgange={() => selectExgange(index)}
              selected={selected === index}
            />
          </Grid>
        ))}
      </Grid>

    )
  }
}

export default withStyles(styles)(ExchangeTable)
