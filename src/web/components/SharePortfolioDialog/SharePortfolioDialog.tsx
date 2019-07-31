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

import {
  ButtonShare,
  TypographySectionTitle,
  TypographySubTitle,
  DialogFooter,
  ClearButton,
  TypographyTitle,
  Line
} from './SharePortfolioDialog.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

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
    justify="space-between"
    alignItems="center"
    style={{ width: 'auto', flexBasis: "45%" }}
  >
    <TypographySubTitle>{name}</TypographySubTitle>
    <Checkbox checked={checked} />
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
      justify="space-between"
      alignItems="center"
      style={{ width: 'auto', flexBasis: "45%" }}
    >
      <Typography>{name}</Typography>
      <Radio checked={checked} />
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
    showPortfolioValue: true,
    selectedAccounts: [],
  }

  onChangeUserEmail = (e) => {
    this.setState({ selectedUserEmail: e.target.value })
  }

  changeShowPortfolioValue = (bool) => {
    this.setState({ showPortfolioValue: bool });
  }

  toggleAccount = (e) => {

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

    const { selectedUserEmail, shareWithSomeoneTab, showPortfolioValue } = this.state;



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
          <ClearButton handleClick={handleCloseSharePortfolio} />
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
              <Grid style={{ paddingBottom: '20px' }}>
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    Select accounts to share
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <Grid container alignItems="center">
                  {portfolioKeys.map((el) => (
                    <KeyElement key={el._id} name={el.name} checked={false} />
                  ))}
                </Grid>
              </Grid>
              <Grid container style={{ paddingBottom: '20px' }}>
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    How to display my portfolio
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <Grid container justify="space-between">
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    style={{ width: 'auto', flexBasis: '45%' }}
                  >
                    <TypographySubTitle>
                      Show my portfolio value
                      </TypographySubTitle>
                    <Radio checked={showPortfolioValue} onChange={() => this.changeShowPortfolioValue(true)} />
                  </Grid>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    style={{ width: 'auto', flexBasis: '45%' }}
                  >
                    <TypographySubTitle>
                      Show only % allocation
                      </TypographySubTitle>
                    <Radio checked={!showPortfolioValue} onChange={() => this.changeShowPortfolioValue(false)} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container style={{ paddingBottom: '20px' }}>
                <Grid container justify="space-between">
                  <TypographySubTitle>
                    Share with anyone by the link
                  </TypographySubTitle>
                  <BtnCustom
                    btnWidth={'100px'}
                    height={'32px'}
                    btnColor={'#165BE0'}
                    borderRadius={'8px'}
                    fontSize={'0.75rem'}
                    color={'#165BE0'}
                  >
                    Copy link
                  </BtnCustom>
                </Grid>
                <Grid container justify="space-between">
                  <Grid item style={{ minWidth: '300px' }}>
                    <Input
                      value={selectedUserEmail}
                      onChange={this.onChangeUserEmail}
                    />
                  </Grid>
                  <BtnCustom
                    btnWidth={'100px'}
                    height={'32px'}
                    btnColor={'#165BE0'}
                    borderRadius={'8px'}
                    fontSize={'0.75rem'}
                    color={'#165BE0'}
                    disabled={!selectedUserEmail}
                    onClick={() => this.sharePortfolioHandler(false)}
                  >
                    Invite
                  </BtnCustom>
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
          <Typography
          // fontWeight={'bold'}
          // borderRadius={'10px'}
          // color={black.custom}
          >
            Go to Social portfolio manager
          </Typography>
        </DialogFooter>
      </Dialog>
    )
  }
}
