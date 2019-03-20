import React from 'react';
import { Grid, TextField, InputAdornment } from '@material-ui/core'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

import {
  Container,
  NameHeader,
  InputContainer,
  TitleContainer,
  PriceButton,
  GridContainer,
  ButtonContainer,
} from './styles'

export const TraidingTerminal = (props) => {
  return (
    <Container>
      <div>
        <NameHeader>
        <TypographyWithCustomColor
          textColor
          variant="subtitle1"
        >
          Buy BTC
        </TypographyWithCustomColor>
        <TypographyWithCustomColor
          textColor
          variant="subtitle1"
          align="left"
        >
          0.00000000 USDT
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
          defaultValue="12324"
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
            Price:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        <Grid item xs={9}>
        <InputContainer>
        <TextField
          type="number"
          defaultValue="12324"
          style={{ fontSize: '63px' }}
          InputProps={{
            endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
          }}
        />
        </InputContainer>
        </Grid>
        <Grid item xs={3}>
          {''}
        </Grid>
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
      </GridContainer>
      </div>
    </Container>
  )
}

export default TraidingTerminal
