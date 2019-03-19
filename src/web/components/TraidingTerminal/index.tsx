import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, TextField } from '@material-ui/core'

import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

import { Table, Row, Title, Head, HeadCell } from '@sb/components/OldTable/Table'


import {
  ChartContainer,
  NameHeader,
  InputContainer,
  TitleContainer,
} from './styles'


export const TraidingTerminal = (props) => {
  return (
    <ChartContainer>
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
      <Grid container spacing={0}>
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle1"
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
        />
        </InputContainer>
        </Grid>
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle1"
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
        />
        </InputContainer>
        </Grid>
      </Grid>
      </div>
    </ChartContainer>
  )
}

export default TraidingTerminal
