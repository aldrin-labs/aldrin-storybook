import * as React from 'react'
import { Paper, Grid, Typography } from '@material-ui/core'
import SvgIcon from '@sb/components/SvgIcon/'

import Add from '@material-ui/icons/Add'


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
  AddContainer,
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
    addButton: true,
  },
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

const Cell = ({active, icon, selected, selectExgange, addButton}) => (
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
    <ExhangeButton active={active} addButton={addButton} onClick={selectExgange}>
      {icon && <SvgIcon src={icon} width={84} height={18} />}
      {addButton && (<AddContainer>
        <Add fontSize="small" color="secondary"/>
        <Typography color="secondary">
           ADD
        </Typography>
        </AddContainer>)}
    </ExhangeButton>
  </>
)

export class ExchangeTable extends React.Component {

  render() {
    const { classes, selected, selectExgange, addExhange } = this.props
    return (
      <Grid container spacing={0}>
        {exchangeList.map((exchange, index) => (
          <Grid item xs={4}>
            <Cell
              icon={exchange.icon}
              active={exchange.active}
              selectExgange={exchange.addButton
                ? addExhange
                : exchange.active
                ? () => selectExgange(index)
                : () => null
              }
              selected={selected === index}
              addButton={exchange.addButton}
            />
          </Grid>
        ))}
      </Grid>

    )
  }
}

export default ExchangeTable
