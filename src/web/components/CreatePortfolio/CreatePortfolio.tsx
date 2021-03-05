import React from 'react'

import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Grid, Typography } from '@material-ui/core'
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
import { getPortfolioData } from '@core/graphql/queries/portfolio/main/getPortfolioData'
import { createPortfolioMutation } from '@core/graphql/mutations/user/createPortfolioMutation'
import { renamePortfolio } from '@core/graphql/mutations/portfolio/renamePortfolio'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { IProps, IState } from './CreatePortfolio.types'
// import { portfolioMainSteps } from '@sb/config/joyrideSteps'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'
import Steps from '@sb/components/Onboarding/Steps/Steps'
import { DialogContent } from '@sb/styles/Dialog.styles'
import ThemeWrapper from '@sb/compositions/App/ThemeWrapper/ThemeWrapper'

@withTheme()
class CreatePortfolio extends React.Component<IProps, IState> {
  state: IState = {
    open: false,
    isSelected: true,
    error: '',
    portfolioName: '',
  }

  handleChange = (inputValue: string) => {
    this.setState({ portfolioName: inputValue })
  }

  handleSubmit = async () => {
    const {
      createPortfolio,
      renamePortfolio,
      onboarding,
      portfolioId,
      setCurrentStep,
    } = this.props

    const { portfolioName: name } = this.state
    const trimmedName = name.trim()

    if (trimmedName.length < 3) {
      this.setState({ error: 'Please enter name with at least 3 characters ' })
      return false
    }

    if (trimmedName.length > 20) {
      this.setState({ error: 'Please limit name to 20 characters ' })
      return false
    }

    if (onboarding) {
      const variablesRename = {
        inputPortfolio: {
          id: portfolioId,
          name: trimmedName,
        },
      }

      const { data } = await renamePortfolio({
        variables: variablesRename,
      })

      const { executed, error } = data.renamePortfolio

      if (!executed) {
        this.setState({ error })
        return false
      }

      setCurrentStep('addAccount')
    } else {
      const variables = {
        inputPortfolio: {
          name: trimmedName,
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
      onboarding = false,
      open = false,
      CustomButton,
      existCustomButton = false,
    } = this.props

    const { error, portfolioName } = this.state

    return (
      <>
        {onboarding ? (
          <>
            {/* <JoyrideOnboarding
                  steps={portfolioMainSteps}
                  open={this.state.openOnboarding}
                />
            */}
          </>
        ) : existCustomButton ? (
          <CustomButton handleClick={this.handleClickOpen} />
        ) : (
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
        )}

        <DialogWrapper
          style={{ borderRadius: '50%' }}
          onClose={() => {
            if (!onboarding) {
              this.handleClose()
            }
          }}
          open={onboarding ? open : this.state.open}
          aria-labelledby="customized-dialog-title"
        >
          <DialogTitleCustom
            id="customized-dialog-title"
            style={{
              border: 'none',
              background: 'none',
              display: 'flex',
              justifyContent: 'center',
              height: '5rem',
            }}
            onClose={() => {
              if (!onboarding) {
                this.handleClose()
              }
            }}
          >
            <TypographyCustomHeading
              style={{
                textTransform: 'none',
                fontFamily: 'Avenir Next Medium',
                fontSize: '2.2rem',
                letterSpacing: '-0.65px',
                color: this.props.theme.palette.grey.onboard,
              }}
              fontWeight={'700'}
              borderRadius={'1rem'}
              color={black.custom}
            >
              {onboarding ? (
                <>
                  Set your portfolio name - <Steps current={1} />
                </>
              ) : (
                'Create  Additional Portfolio'
              )}
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
                <InputBaseCustom
                  placeholder="Select portfolio name"
                  maxLength={'24'}
                  input="text"
                  name="portfolioName"
                  onChange={(e) => this.handleChange(e.target.value)}
                  value={portfolioName}
                />
                <Typography color="error">{error}</Typography>
              </GridCustom>
            </Grid>

            {/* <Grid container justify="flex-end" alignItems="center">
              <BtnCustom
                btnWidth={'85px'}
                borderRadius={'32px'}
                btnColor={blue.custom}
                onClick={async () => {
                  const response = await this.handleSubmit()
                  if (response) {
                    if (!onboarding) {
                      this.handleClose()
                    }
                  }
                }}
              >
                {onboarding ? 'SAVE' : 'CREATE'}
              </BtnCustom>
            </Grid> */}
            <Grid
              theme={this.props.theme}
              container
              alignItems="center"
              justify="space-between"
              wrap="nowrap"
              style={{ paddingTop: '2rem' }}
            >
              <BtnCustom
                theme={this.props.theme}
                height={'3.7rem'}
                btnWidth={'48%'}
                backgroundColor={'transparent'}
                color={this.props.theme.palette.grey.onboard}
                borderColor={this.props.theme.palette.grey.onboard}
                borderRadius={'1rem'}
                borderWidth={'0.1rem'}
                fontSize={'1.3rem'}
                textTransform={'capitalize'}
                onClick={() => {}}
              >
                Cancel
              </BtnCustom>
              <BtnCustom
                theme={this.props.theme}
                height={'3.7rem'}
                btnWidth={'48%'}
                borderColor={'none'}
                backgroundColor={this.props.theme.palette.blue.main}
                color={'#fff'}
                borderRadius={'1rem'}
                textTransform={'capitalize'}
                fontSize={'1.3rem'}
                onClick={async () => {
                  const response = await this.handleSubmit()
                  if (response) {
                    if (!onboarding) {
                      this.handleClose()
                    }
                  }
                }}
              >
                Create{' '}
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
        { query: getPortfolioData },
      ],
    }),
  }),
  graphql(renamePortfolio, {
    name: 'renamePortfolio',
    options: ({ baseCoin }) => ({
      refetchQueries: [
        { query: getMyPortfoliosQuery, variables: { baseCoin } },
      ],
    }),
  })
)(CreatePortfolio)
