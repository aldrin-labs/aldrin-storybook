import React from 'react';
import { Grid, TextField, InputAdornment, Button } from '@material-ui/core'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

import { IProps } from './types'

import {
  Container,
  NameHeader,
  InputContainer,
  TitleContainer,
  PriceButton,
  GridContainer,
  ButtonContainer,
  ByButtonContainer,
} from './styles'

export const TraidingTerminal = (props: IProps) => {
  console.log(props)
  const typeIsBuy = props.type === 'buy'
  const {
    pair,
    amount,
    marketPrice,
  } = props
  return (
    <Container>
      <div>
        <NameHeader>
        <TypographyWithCustomColor
          textColor
          variant="subtitle1"
        >
          {
            typeIsBuy
            ? `Buy ${pair[0]}`
            : `Sell ${pair[0]}`
          }
        </TypographyWithCustomColor>
        <TypographyWithCustomColor
          textColor
          variant="subtitle1"
          align="left"
        >
          {`${amount} ${pair[1]}`}
        </TypographyWithCustomColor>
        </NameHeader>
      <GridContainer>
      <Grid container spacing={0}>
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle2"
          >
            Price:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        <Grid item xs={9}>
        <InputContainer>
        <TextField
          type="number"
          defaultValue={marketPrice}
          InputProps={{
            endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
          }}
        />
        </InputContainer>
        </Grid>
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle2"
          >
            Amount:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        <Grid item xs={9}>
        <InputContainer>
        <TextField
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
          }}
        />
        </InputContainer>
        </Grid>
        <Grid item xs={3}>
          {''}
        </Grid>
        <Grid item xs={9}>
        <Grid container spacing={8}>
          <Grid item xs>
          <ButtonContainer>
          <PriceButton>
            25%
          </PriceButton>
          </ButtonContainer>
          </Grid>
          <Grid item xs>
          <ButtonContainer>
          <PriceButton >
            50%
          </PriceButton>
          </ButtonContainer>
          </Grid>
          <Grid item xs>
          <ButtonContainer>
          <PriceButton>
            75%
          </PriceButton>
          </ButtonContainer>
          </Grid>
          <Grid item xs>
          <ButtonContainer>
          <PriceButton>
            100%
          </PriceButton>
          </ButtonContainer>
          </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle2"
          >
            Total:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        <Grid item xs={9}>
        <InputContainer>
        <TextField
          type="number"
          defaultValue="12324"
          InputProps={{
            endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
          }}
        />
        </InputContainer>
        </Grid>
        <Grid item xs={12}>
          <ByButtonContainer>
            <Button variant="outlined">
              Buy
            </Button>
          </ByButtonContainer>
        </Grid>
      </Grid>
      </GridContainer>
      </div>
    </Container>
  )
}

export default TraidingTerminal
