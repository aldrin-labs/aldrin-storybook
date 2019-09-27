import React from 'react'

import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { withTheme } from '@material-ui/styles'

import {
  TypographyCustomHeading,
  GridCustom,
  InputBaseCustom,
  DialogWrapper,
  DialogTitleCustom,
  Legend,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { createPortfolioMutation } from '@core/graphql/mutations/user/createPortfolioMutation'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { IProps, IState } from './CreatePortfolio.types'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

@withTheme()
class CreatePortfolio extends React.Component<IProps, IState> {
  state: IState = {
    open: false,
    isSelected: true,
    error: '',
    portfolioName: '',
  }

  handleRadioBtn = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    })
  }

  handleChange = (inputValue: string) => {
    this.setState({ portfolioName: inputValue })
  }

  handleSubmit = async () => {
    const { createPortfolio } = this.props
    const { portfolioName: name } = this.state

    if (name.length > 20) {
      this.setState({ error: 'Please limit name to 20 characters ' })
      return false
    }

    const variables = {
      inputPortfolio: {
        name,
      },
    }

    const { data } = await createPortfolio({
      variables,
    })

    const { executed, error } = data.createPortfolio

    if (!executed) {
      this.setState({ error })
      return false
    }

    return true
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    })
  }

  handleClose = () => {
    this.setState({ open: false, portfolioName: '', error: '' })
  }

  render() {
    const {
      theme: {
        palette: { blue, black },
      },
    } = this.props

    const { error, portfolioName } = this.state

    return (
      <>
        <BtnCustom
          btnWidth={'17rem'}
          height={'3.5rem'}
          btnColor={'#16253D'}
          backgroundColor="white"
          borderRadius={'1rem'}
          padding={'0'}
          fontSize={'1.175rem'}
          letterSpacing="1px"
          onClick={this.handleClickOpen}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '1.5rem',
            transform: 'translateX(-50%)',
            border: '2px solid #E0E5EC',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* <AddIcon fontSize={`small`} /> */}Create portfolio
        </BtnCustom>
        <DialogWrapper
          style={{ borderRadius: '50%' }}
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <DialogTitleCustom id="customized-dialog-title">
            <TypographyCustomHeading
              fontWeight={'700'}
              borderRadius={'1rem'}
              color={black.custom}
            >
              Create Portfolio
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent
            //justify="center"
            style={{
              padding: '0 3rem 3rem',
            }}
          >
            <Grid style={{ width: '440px' }}>
              <GridCustom>
                <Legend>Portfolio name</Legend>
                <InputBaseCustom
                  placeholder=""
                  name="portfolioName"
                  onChange={(e) => this.handleChange(e.target.value)}
                  value={portfolioName}
                />
                <Typography color="error">{error}</Typography>
              </GridCustom>
            </Grid>

            <Grid container justify="flex-end" alignItems="center">
              <BtnCustom
                btnWidth={'85px'}
                borderRadius={'32px'}
                btnColor={blue.custom}
                onClick={async () => {
                  const response = await this.handleSubmit()
                  if (response) this.handleClose()
                }}
              >
                CREATE
              </BtnCustom>
            </Grid>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default compose(
  graphql(createPortfolioMutation, {
    name: 'createPortfolio',
    options: ({ baseCoin }: { baseCoin: 'USDT' | 'BTC' }) => ({
      refetchQueries: [
        { query: getMyPortfoliosQuery, variables: { baseCoin } },
      ],
    }),
  })
)(CreatePortfolio)
