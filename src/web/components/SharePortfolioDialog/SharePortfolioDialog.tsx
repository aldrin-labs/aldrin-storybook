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
} from '@material-ui/core'

import { IProps, IState } from './SharePortfolioDialog.types'
import { withTheme } from '@material-ui/styles'

const tradingPortfolioTypes = [
  'Bull trading',
  'Bear trading',
  'Marketmake trading',
  'Long Term Investing',
  'Mid Term Investing',
]

const tradeFrequency = ['Irregularly', 'By Minute', 'Daily', 'Weekly', 'Hourly']

const KeyElement = ({ name, checked }: { name: string; checked: boolean }) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    style={{ width: 'auto' }}
  >
    <Typography>{name}</Typography>
    <Checkbox checked={checked} disabled={true} />
  </Grid>
)

const RadioElement = ({
  name,
  checked,
}: {
  name: string
  checked: boolean
}) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    style={{ width: 'auto' }}
  >
    <Typography>{name}</Typography>
    <Radio disabled={true} checked={checked} />
  </Grid>
)

@withTheme()
export default class SharePortfolioDialog extends React.Component<
  IProps,
  IState
> {
  state: IState = {
    shareWithSomeoneTab: true,
    selectedUserEmail: null,
  }

  onChangeUserEmail = (e) => {
    this.setState({ selectedUserEmail: e.target.value })
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

    const { selectedUserEmail, shareWithSomeoneTab } = this.state

    return (
      <Dialog
        fullScreen={false}
        onClose={handleCloseSharePortfolio}
        open={openSharePortfolioPopUp}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          style={{ backgroundColor: theme.palette.grey.main }}
        >
          {sharePortfolioTitle}
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            style={{ paddingBottom: '20px' }}
          >
            <Button onClick={this.toggleSharingTab}>SHARE WITH SOMEONE</Button>
            <Button onClick={this.toggleSharingTab}>SHARE VIA MARKET</Button>
          </Grid>
          <Grid
            container
            alignItems="center"
            justify="center"
            style={{ paddingBottom: '20px' }}
          >
            <Typography>Settings</Typography>
          </Grid>
          {shareWithSomeoneTab && (
            <>
              <Grid style={{ paddingBottom: '20px' }}>
                <Typography>Select accounts to share</Typography>
                <Grid container alignItems="center">
                  {portfolioKeys.map((el) => (
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
                    <Radio checked={true} disabled={true} />
                  </Grid>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: 'auto' }}
                  >
                    <Typography>Show only % allocation</Typography>
                    <Radio disabled={true} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container style={{ paddingBottom: '20px' }}>
                <Grid container justify="space-between">
                  <Typography>Share with anyone by the link</Typography>
                  <Button disabled={true}>Copy link</Button>
                </Grid>
                <Grid container justify="space-between">
                  <Grid item style={{ minWidth: '300px' }}>
                    <Input
                      value={selectedUserEmail}
                      onChange={this.onChangeUserEmail}
                    />
                  </Grid>
                  <Button
                    disabled={!selectedUserEmail}
                    onClick={() => this.sharePortfolioHandler(false)}
                  >
                    Invite
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          {!shareWithSomeoneTab && (
            <>
              <Grid style={{ paddingBottom: '20px' }}>
                <Typography>Set portfolio marketname</Typography>
                <Grid container alignItems="center">
                  <Input disabled={true} />
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
                    <Radio checked={true} disabled={true} />
                  </Grid>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: 'auto' }}
                  >
                    <Typography>Show only % allocation</Typography>
                    <Radio disabled={true} />
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
                    <Radio checked={true} disabled={true} />
                  </Grid>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: 'auto' }}
                  >
                    <Typography>Paid</Typography>
                    <TextField disabled={true} />
                    <Radio checked={false} disabled={true} />
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
      </Dialog>
    )
  }
}
