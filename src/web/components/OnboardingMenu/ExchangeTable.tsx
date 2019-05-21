import * as React from 'react'
import { Paper, Grid, Typography } from '@material-ui/core'
import SvgIcon from '@sb/components/SvgIcon/'

import Add from '@material-ui/icons/Add'

import SelectedLogo from '@icons/Selected.png'

import {
  ExhangeButton,
  ExchangeGrid,
  ExhangeTypography,
  StyledLogo,
  Selected,
  SelectedContainer,
  AddContainer,
  LogoContainer,  
} from './styles'


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
      {(active || addButton)? '\u00A0' : `Comming Soon`}
    </ExhangeTypography>
    <ExhangeButton active={active} addButton={addButton} onClick={selectExgange}>
      {icon && <StyledLogo src={icon} width={84} />}
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
    const { classes, selected, selectExgange, addExhange, exchangeList } = this.props
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
