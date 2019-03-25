import React, { PureComponent } from 'react'

import { compose } from 'recompose'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import { withFormik } from 'formik'

import Yup from 'yup'


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

@withTheme()

class TraidingTerminal extends PureComponent<IProps> {

render() {
  const {
    pair,
    wallet,
    marketPrice,
    byType,
    priceType,
    theme: { palette },
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
  } = this.props

  const onTotalChange = (e) => {
    const amount = e.target.value / values.price
    setFieldValue('total', e.target.value)
    setFieldValue('amount', amount, false)
  }

  const onAmountChange = (e) => {
    const total = e.target.value * values.price
    setFieldValue('amount', e.target.value)
    setFieldValue('total', total, false)
  }



  const { background, primary, type } = palette

  const typeIsBuy = byType === 'buy'
  return (
    <Container background={background.default}>
      <div>
        <NameHeader background={primary[type]}>
        <Grid container spacing={0}>
        <Grid item xs={1}>
          {''}
        </Grid>
        <Grid item xs>
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
        </Grid>
        <Grid item xs>
          <TypographyWithCustomColor
            align="right"
            textColor
            variant="subtitle1"
          >
            {`${wallet} ${pair[1]}`}
          </TypographyWithCustomColor>
          </Grid>
          </Grid>
        </NameHeader>
      <GridContainer>
      <Grid container spacing={0}>
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle2"
          >
            {priceType === 'stop-limit'
              ? 'Stop:'
              : 'Price:'}
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        <Grid item xs={9}>
        <InputContainer>
        <TextField
          fullWidth
          name={priceType === 'stop-limit'
            ? 'stop'
            : 'price'
          }
          value={priceType === 'stop-limit'
          ? values.stop || ''
          : values.price || ''
          }
          id={priceType === 'stop-limit'
          ? 'stop'
          : 'price'
          }
          type="number"
          defaultValue={priceType === 'market'
            ? 'Market Price'
            : marketPrice
          }
          onChange={handleChange}
          disabled={priceType === 'market'}
          InputProps={{
            endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
          }}
        />
        </InputContainer>
        </Grid>
        {priceType === 'stop-limit' &&
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle2"
          >
            Limit:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        }
        {priceType === 'stop-limit' &&
        <Grid item xs={9}>
        <InputContainer>
        <TextField
          fullWidth
          id="limit"
          name="limit"
          value={values.limit || ''}
          onChange={handleChange}
          type="number"
          defaultValue={marketPrice}
          InputProps={{
            endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
          }}
        />
        </InputContainer>
        </Grid>
        }
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
          fullWidth
          id="amount"
          name="amount"
          value={values.amount || ''}
          onChange={onAmountChange}
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
            <Grid item sm={3} xs={6}>
              <ButtonContainer>
                <PriceButton>
                  25%
                </PriceButton>
              </ButtonContainer>
            </Grid>
            <Grid item sm={3} xs={6}>
              <ButtonContainer>
                <PriceButton >
                  50%
                </PriceButton>
              </ButtonContainer>
            </Grid>
            <Grid item sm={3} xs={6}>
              <ButtonContainer>
                <PriceButton>
                  75%
                </PriceButton>
              </ButtonContainer>
            </Grid>
            <Grid item sm={3} xs={6}>
              <ButtonContainer>
                <PriceButton>
                  100%
                </PriceButton>
              </ButtonContainer>
            </Grid>
          </Grid>
        </Grid>
        {priceType !== 'market' &&
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle2"
          >
            Total:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>}
        {priceType !== 'market' &&
        <Grid item xs={9}>
          <InputContainer>
            <TextField
              fullWidth
              value={values.total || ''}
              onChange={onTotalChange}
              id="total"
              name="total"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
              }}
            />
          </InputContainer>
        </Grid>}
        <Grid item xs={12}>
          <ByButtonContainer>
            <Button
              variant="outlined"
              onClick={handleSubmit}
              >
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
}

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
  }),
  mapPropsToValues: (props: any) => ({
    type: props.byType,
    price: props.marketPrice,
    stop: props.marketPrice,
    limit: props.marketPrice,
    amount: '',
    total: '',
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    console.log(values)
  },
})


export default compose(
  withErrorFallback,
  formikEnhancer
)(TraidingTerminal)
