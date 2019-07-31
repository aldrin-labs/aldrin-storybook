import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Typography,
  Checkbox,
  Radio,
  Input,
  TextField,
  FormControlLabel
} from '@material-ui/core'

import Clear from '@material-ui/icons/Clear'

import { IProps, IState } from './SharePortfolioDialog.types'
import { withTheme } from '@material-ui/styles'

import {
  StyledButton,
  ButtonShare,
  TypographySectionTitle,
  TypographySubTitle,
  DialogFooter,
  ClearButton,
  TypographyTitle,
  TypographyFooter,
  Line,
  SLink,
  FormInputTemplate,
  StyledTextField
} from './SharePortfolioDialog.styles'

const tradingPortfolioTypes = [
  'Bull trading',
  'Bear trading',
  'Marketmake trading',
  'Long Term Investing',
  'Mid Term Investing',
]

const tradeFrequency = ['Irregularly', 'By Minute', 'Daily', 'Weekly', 'Hourly']



const KeyElement = ({
  name,
  checked,
  handleChange
}: {
  name: string;
  checked: boolean
  handleChange(): void;
}) => (
    <FormControlLabel
      value={name}
      onChange={handleChange}
      control={<Checkbox checked={checked} />}
      label={name}
      labelPlacement="start"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'auto',
        flexBasis: "45%"
      }}
    >
    </FormControlLabel>
  )

@withTheme()
export default class SharePortfolioDialog extends React.Component<
IProps,
IState
> {
  state: IState = {
    shareWithSomeoneTab: true,
    selectedUserEmail: null,
    showPortfolioValue: true,
    selectedAccounts: [],
  }

  onChangeUserEmail = (e) => {
    this.setState({ selectedUserEmail: e.target.value })
  }

  changeShowPortfolioValue = (bool: boolean) => {
    this.setState({ showPortfolioValue: bool });
  }

  toggleAccount = (name: string) => {
    const { selectedAccounts } = this.state;
    const isAccountChecked = selectedAccounts.includes(name);

    const newSelectedAccounts = isAccountChecked
      ? selectedAccounts.filter(acc => acc !== name)
      : selectedAccounts.concat(name);

    this.setState({
      selectedAccounts: newSelectedAccounts,
    });
  }

  toggleSharingTab = () => {
    this.setState((prevState) => ({
      shareWithSomeoneTab: !prevState.shareWithSomeoneTab,
    }))
  }

  sharePortfolioHandler = async (forAll?: boolean) => {
    const { sharePortfolioMutation, portfolioId } = this.props
    const { selectedUserEmail } = this.state

    const variables = {
      inputPortfolio: {
        id: portfolioId,
      },
      optionsPortfolio: {
        ...(forAll ? {} : { userId: selectedUserEmail.value }),
        ...(forAll ? { forAll: true } : { forAll: false }),
        accessLevel: 2,
      },
    }

    console.log('variables', variables)

    const result = await sharePortfolioMutation({
      variables,
    })

    console.log('result', result)
  }

  render() {
    const {
      sharePortfolioTitle,
      openSharePortfolioPopUp,
      handleCloseSharePortfolio,
      portfolioKeys,
      theme,
    } = this.props

    console.log('portfolioKeys', portfolioKeys);

    const {
      selectedUserEmail,
      shareWithSomeoneTab,
      showPortfolioValue,
      selectedAccounts
    } = this.state;

    return (
      <Dialog
        style={{ width: '750px', margin: 'auto' }}
        fullScreen={false}
        onClose={handleCloseSharePortfolio}
        open={openSharePortfolioPopUp}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          disableTypography
          id="responsive-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #E0E5EC',
            backgroundColor: theme.palette.grey.main,
            height: '40px',
            fontSize: '12px',
          }}
        >
          <TypographyTitle>{sharePortfolioTitle}</TypographyTitle>
          <ClearButton>
            <Clear fontSize="default" color="inherit" onClick={handleCloseSharePortfolio} />
          </ClearButton>
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            style={{ padding: '20px 0' }}
          >
            <ButtonShare
              active={shareWithSomeoneTab}
              onClick={this.toggleSharingTab}
            > SHARE WITH SOMEONE</ButtonShare>
            <ButtonShare
              active={!shareWithSomeoneTab}
              padding={'1rem 4rem'}
              onClick={this.toggleSharingTab}
            > SHARE VIA MARKET </ButtonShare>
          </Grid>
          <Grid
            container
            alignItems="center"
            justify="center"
            style={{ paddingBottom: '20px' }}
          >
            <TypographyTitle>Settings</TypographyTitle>
          </Grid>
          {shareWithSomeoneTab && (
            <>
              <Grid>
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    Select accounts to share
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <Grid container alignItems="center">
                  {portfolioKeys.map((el) => {
                    const checked = selectedAccounts.includes(el.name);

                    return (
                      <FormInputTemplate
                        key={el._id}
                        name={el.name}
                        handleChange={() => this.toggleAccount(el.name)}
                      >
                        <Checkbox checked={checked} />
                      </FormInputTemplate>
                    )
                  })}
                </Grid>
              </Grid>
              <Grid container style={{ padding: '.5rem 0', borderBottom: '1px solid #E0E5EC' }}>
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    How to display my portfolio
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <Grid container justify="space-between">
                  <FormInputTemplate
                    name={'Show my portfolio value'}
                    handleChange={() => this.changeShowPortfolioValue(true)}
                  >
                    <Radio checked={showPortfolioValue} />
                  </FormInputTemplate>

                  <FormInputTemplate
                    name={'Show only % allocation'}
                    handleChange={() => this.changeShowPortfolioValue(false)}
                  >
                    <Radio checked={!showPortfolioValue} />
                  </FormInputTemplate>
                </Grid>
              </Grid>
              <Grid container>
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  style={{ padding: '.5rem 0' }}
                >
                  <TypographySubTitle>
                    Share with anyone by the
                    <SLink to="/portfolio/main"> link</SLink>
                  </TypographySubTitle>
                  <StyledButton>
                    Copy link
                  </StyledButton>
                </Grid>
                <Grid container justify="space-between">
                  <StyledTextField
                    type="text"
                    value={selectedUserEmail}
                    placeholder="Share with someone by email"
                    onChange={this.onChangeUserEmail}
                  />
                  <StyledButton
                    padding=".5rem 1.85rem"
                    onClick={() => this.sharePortfolioHandler(false)}
                  >
                    Invite
                  </StyledButton>
                </Grid>
              </Grid>
            </>
          )}
          {!shareWithSomeoneTab && (
            <>
              <Grid style={{ paddingBottom: '20px' }}>
                <Typography>Set portfolio marketname</Typography>
                <Grid container alignItems="center">
                  <Input />
                </Grid>
              </Grid>

              <Grid style={{ paddingBottom: '20px' }}>
                <Typography>Select accounts to share</Typography>
                <Grid container alignItems="center">
                  {portfolioKeys.map((el, i) => (
                    <KeyElement key={el._id} name={el.name} checked={true} />
                  ))}
                </Grid>
              </Grid>

              <Grid container style={{ paddingBottom: '20px' }}>
                <Typography>How to display my portfolio</Typography>
                <Grid container justify="space-between">
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: 'auto' }}
                  >
                    <Typography>Show my portfolio value</Typography>
                    <Radio checked={true} />
                  </Grid>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: 'auto' }}
                  >
                    <Typography>Show only % allocation</Typography>
                    <Radio />
                  </Grid>
                </Grid>
              </Grid>

              <Grid container style={{ paddingBottom: '20px' }}>
                <Typography>Set type of your portfolio</Typography>
                <Grid container justify="space-between">
                  {tradingPortfolioTypes.map((el, i) => (
                    <RadioElement key={i} name={el} checked={i === 0} />
                  ))}
                </Grid>
              </Grid>

              <Grid container style={{ paddingBottom: '20px' }}>
                <Typography>Set your trading frequency</Typography>
                <Grid container justify="space-between">
                  {tradeFrequency.map((el, i) => (
                    <RadioElement key={i} name={el} checked={i === 0} />
                  ))}
                </Grid>
              </Grid>

              <Grid container style={{ paddingBottom: '20px' }}>
                <Typography>
                  Write short description of your portfolio
                </Typography>
                <Grid container justify="space-between">
                  <TextField />
                </Grid>
              </Grid>

              <Grid container style={{ paddingBottom: '20px' }}>
                <Typography>Set price of your portfolio</Typography>
                <Grid container justify="space-between">
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: 'auto' }}
                  >
                    <Typography>Free</Typography>
                    <Radio checked={true} />
                  </Grid>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: 'auto' }}
                  >
                    <Typography>Paid</Typography>
                    <TextField />
                    <Radio checked={false} />
                  </Grid>
                </Grid>
              </Grid>

              <Grid justify="center" alignItems="center">
                <Button
                  disabled={false}
                  onClick={() => this.sharePortfolioHandler(true)}
                >
                  Send to market
                </Button>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogFooter id="customized-dialog-title">
          <TypographyFooter>
            Go to Social portfolio manager
          </TypographyFooter>
        </DialogFooter>
      </Dialog>
    )
  }
}
