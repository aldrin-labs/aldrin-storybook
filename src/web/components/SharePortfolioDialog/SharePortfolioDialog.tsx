import React from 'react'
import { Dialog, DialogTitle, Grid, FormControl } from '@material-ui/core'

import Clear from '@material-ui/icons/Clear'
import MiniSuccessPopup from '@sb/components/MiniSuccessPopup'

import { IProps, IState } from './SharePortfolioDialog.types'
import { withTheme } from '@material-ui/styles'

import {
  StyledDialogContent,
  StyledButton,
  ButtonShare,
  TypographySectionTitle,
  TypographySubTitle,
  DialogFooter,
  ClearButton,
  ShareButton,
  TypographyTitle,
  TypographyFooter,
  Line,
  SButton,
  SRadio,
  SCheckbox,
  StyledPaper,
  FormInputTemplate,
  StyledInputTemplate,
  StyledInput,
  StyledTextArea,
  StyledSearch,
} from './SharePortfolioDialog.styles'

const tradingPortfolioTypes = [
  'Bull trading',
  'Bear trading',
  'Marketmake trading',
  'Long Term Investing',
  'Mid Term Investing',
]

const tradeFrequencies = [
  'Irregularly',
  'By Minute',
  'Daily',
  'Weekly',
  'Hourly',
]

@withTheme()
export default class SharePortfolioDialog extends React.Component<
  IProps,
  IState
> {
  state: IState = {
    selectedUsername: null,
    shareWithSomeoneTab: true,
    showPortfolioValue: true,
    isPortfolioFree: true,
    openLinkPopup: false,
    openInvitePopup: false,
    isEnableToInvite: false,
    portfolioPrice: '',
    tradeFrequency: 'Irregularly',
    marketName: '',
    portfolioDescription: '',
    selectedAccounts: [],
    selectedPortfolioTypes: ['Bull trading'],
  }

  onChangeUsername = (
    optionSelected: { label: string; value: string } | null
  ) => {
    const selectedUsername =
      optionSelected && !Array.isArray(optionSelected)
        ? { label: optionSelected.label, value: optionSelected.value }
        : null

    this.setState({ selectedUsername })
  }

  openLinkPopup = () => {
    this.setState({ openLinkPopup: true })
    setTimeout(() => this.setState({ openLinkPopup: false }), 2000)
  }

  openInvitePopup = async () => {
    const isInvited = await this.sharePortfolioHandler(false)

    this.setState({ openInvitePopup: isInvited.data.sharePortfolio })
    setTimeout(() => this.setState({ openInvitePopup: false }), 2000)
  }

  // onChangeUserEmail = (e) => {
  //   this.setState({ selectedUsername: e.target.value })
  // }

  changeShowPortfolioValue = (bool: boolean) => {
    this.setState({ showPortfolioValue: bool })
  }

  toggleCheckboxArray = (arr: string[], name: string) => {
    const isChecked = arr.includes(name)

    const newSelectedArr = isChecked
      ? arr.filter((item) => item !== name)
      : arr.concat(name)

    return newSelectedArr
  }

  changeAccountsToShare = (name) => {
    const { selectedAccounts } = this.state
    const newSelectedAccounts = this.toggleCheckboxArray(selectedAccounts, name)

    this.setState({ selectedAccounts: newSelectedAccounts })
  }

  changePortfolioTypes = (name) => {
    const { selectedPortfolioTypes } = this.state
    const newSelectedTypes = this.toggleCheckboxArray(
      selectedPortfolioTypes,
      name
    )

    this.setState({ selectedPortfolioTypes: newSelectedTypes })
  }

  toggleSharingTab = () => {
    this.setState((prevState) => ({
      shareWithSomeoneTab: !prevState.shareWithSomeoneTab,
    }))
  }

  changePortfolioDescription = (e) => {
    this.setState({
      portfolioDescription: e.target.value,
    })
  }

  changeTradeFrequency = (frequency) => {
    this.setState({
      tradeFrequency: frequency,
    })
  }

  changeMarketName = (e) => {
    this.setState({
      marketName: e.target.value,
    })
  }

  // type string || event
  changePortfolioPrice = (e) => {
    const newPrice = e.target.value

    this.setState({
      portfolioPrice: newPrice,
      isPortfolioFree: false,
    })
  }

  sharePortfolioHandler = async (forAll?: boolean) => {
    const { sharePortfolioMutation, portfolioId } = this.props
    const { selectedUsername } = this.state

    const variables = {
      inputPortfolio: {
        id: portfolioId,
      },
      optionsPortfolio: {
        ...(forAll ? {} : { userId: selectedUsername.value }),
        ...(forAll ? { forAll: true } : { forAll: false }),
        accessLevel: 2,
      },
    }

    console.log('variables', variables)

    const result = await sharePortfolioMutation({
      variables,
    })

    console.log('result', result)

    return result
  }

  render() {
    const {
      sharePortfolioTitle,
      openSharePortfolioPopUp,
      handleCloseSharePortfolio,
      portfolioKeys,
      theme,
    } = this.props

    const {
      selectedUsername,
      shareWithSomeoneTab,
      showPortfolioValue,
      selectedAccounts,
      selectedPortfolioTypes,
      tradeFrequency,
      isPortfolioFree,
      portfolioPrice,
      marketName,
      portfolioDescription,
      openInvitePopup,
      openLinkPopup,
      isEnableToInvite,
    } = this.state

    return (
      <Dialog
        PaperComponent={StyledPaper}
        style={{ width: '75rem', margin: 'auto' }}
        fullScreen={false}
        onClose={handleCloseSharePortfolio}
        maxWidth={'md'}
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
            height: '4rem',
          }}
        >
          <TypographyTitle>{`SHARE ${sharePortfolioTitle}`}</TypographyTitle>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleCloseSharePortfolio}
            />
          </ClearButton>
        </DialogTitle>
        <StyledDialogContent>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            style={{ padding: '3rem 0' }}
          >
            <ButtonShare
              active={shareWithSomeoneTab}
              onClick={this.toggleSharingTab}
            >
              {' '}
              SHARE WITH SOMEONE
            </ButtonShare>
            <ButtonShare
              active={!shareWithSomeoneTab}
              padding={'1.6rem 6.4rem'}
              onClick={this.toggleSharingTab}
            >
              {' '}
              SHARE VIA MARKET{' '}
            </ButtonShare>
          </Grid>
          {shareWithSomeoneTab && (
            <>
              <Grid
                container
                alignItems="center"
                justify="center"
                style={{ paddingBottom: '1rem' }}
              >
                <TypographyTitle>Settings</TypographyTitle>
              </Grid>
              <Grid style={{ padding: '.5rem 0' }}>
                <Grid
                  style={{ padding: '.8rem 0' }}
                  container
                  alignItems="center"
                  wrap="nowrap"
                >
                  <TypographySectionTitle>
                    Select accounts to share
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid container alignItems="center" justify="space-between">
                    {portfolioKeys.map((el) => {
                      const checked = selectedAccounts.includes(el.name)

                      return (
                        <FormInputTemplate
                          key={el._id}
                          name={el.name}
                          handleChange={() =>
                            this.changeAccountsToShare(el.name)
                          }
                        >
                          <SCheckbox checked={checked} />
                        </FormInputTemplate>
                      )
                    })}
                  </Grid>
                </FormControl>
              </Grid>
              <Grid
                container
                style={{
                  padding: '.5rem 0',
                  borderBottom: '1px solid #E0E5EC',
                }}
              >
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    How to display my portfolio
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid container justify="space-between">
                    <FormInputTemplate
                      name={'Show my portfolio value'}
                      handleChange={() => this.changeShowPortfolioValue(true)}
                    >
                      <SRadio checked={showPortfolioValue} />
                    </FormInputTemplate>

                    <FormInputTemplate
                      name={'Show only % allocation'}
                      handleChange={() => this.changeShowPortfolioValue(false)}
                    >
                      <SRadio checked={!showPortfolioValue} />
                    </FormInputTemplate>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid container>
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  style={{ padding: '1.5rem 0' }}
                >
                  <TypographySubTitle>
                    Share with anyone by the
                    <SButton onClick={this.openLinkPopup}> link</SButton>
                  </TypographySubTitle>
                  <StyledButton onClick={this.openLinkPopup}>
                    Copy link
                  </StyledButton>
                </Grid>
                <Grid container justify="space-between">
                  <StyledSearch
                    width="80"
                    isClearable={true}
                    value={
                      selectedUsername
                        ? [
                            {
                              label: selectedUsername.label,
                              value: selectedUsername.value,
                            },
                          ]
                        : null
                    }
                    onChange={this.onChangeUsername}
                    onFocus={() => this.setState({ isEnableToInvite: true })}
                  />
                  <StyledButton
                    padding=".8rem 3rem"
                    onClick={this.openInvitePopup}
                    disabled={!isEnableToInvite && selectedUsername !== ''}
                  >
                    Invite
                  </StyledButton>
                </Grid>
              </Grid>
            </>
          )}
          {!shareWithSomeoneTab && (
            <>
              <Grid
                container
                alignItems="center"
                justify="center"
                style={{
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #E0E5EC',
                }}
              >
                <TypographyTitle>Settings</TypographyTitle>
              </Grid>
              <Grid style={{ paddingBottom: '1.5rem' }}>
                <Grid
                  style={{ padding: '1rem' }}
                  container
                  alignItems="center"
                  wrap="nowrap"
                >
                  <TypographySectionTitle>
                    Set portfolio marketname
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid container alignItems="center">
                    <StyledInput
                      type="text"
                      width="100"
                      value={marketName}
                      onChange={(e) => this.changeMarketName(e)}
                      placeholder="Type name..."
                      style={{ marginLeft: '0rem' }}
                    />
                  </Grid>
                </FormControl>
              </Grid>

              <Grid style={{ paddingBottom: '1.5rem' }}>
                <Grid
                  style={{ padding: '1rem 0' }}
                  container
                  alignItems="center"
                  wrap="nowrap"
                >
                  <TypographySectionTitle>
                    Select accounts to share
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid container alignItems="center">
                    {portfolioKeys.map((el) => {
                      const checked = selectedAccounts.includes(el.name)

                      return (
                        <FormInputTemplate
                          key={el._id}
                          name={el.name}
                          handleChange={() =>
                            this.changeAccountsToShare(el.name)
                          }
                        >
                          <SCheckbox checked={checked} />
                        </FormInputTemplate>
                      )
                    })}
                  </Grid>
                </FormControl>
              </Grid>

              <Grid container style={{ padding: '.5rem 0' }}>
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    How to display my portfolio
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid container justify="space-between">
                    <FormInputTemplate
                      name={'Show my portfolio value'}
                      handleChange={() => this.changeShowPortfolioValue(true)}
                    >
                      <SRadio checked={showPortfolioValue} />
                    </FormInputTemplate>

                    <FormInputTemplate
                      name={'Show only % allocation'}
                      handleChange={() => this.changeShowPortfolioValue(false)}
                    >
                      <SRadio checked={!showPortfolioValue} />
                    </FormInputTemplate>
                  </Grid>
                </FormControl>
              </Grid>

              <Grid container style={{ paddingBottom: '1.5rem' }}>
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    Set type of your portfolio
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid container justify="space-between">
                    {tradingPortfolioTypes.map((type) => {
                      const checked = selectedPortfolioTypes.includes(type)

                      return (
                        <FormInputTemplate
                          key={type}
                          name={type}
                          handleChange={() => this.changePortfolioTypes(type)}
                        >
                          <SCheckbox checked={checked} />
                        </FormInputTemplate>
                      )
                    })}
                  </Grid>
                </FormControl>
              </Grid>

              <Grid container style={{ paddingBottom: '1.5rem' }}>
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    Set your trading frequency
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid container justify="space-between">
                    {tradeFrequencies.map((el) => (
                      <FormInputTemplate
                        key={el}
                        name={el}
                        handleChange={() => this.changeTradeFrequency(el)}
                      >
                        <SRadio checked={tradeFrequency === el} />
                      </FormInputTemplate>
                    ))}
                  </Grid>
                </FormControl>
              </Grid>

              <Grid container style={{ paddingBottom: '1.5rem' }}>
                <Grid
                  style={{ paddingBottom: '.5rem' }}
                  container
                  alignItems="center"
                  wrap="nowrap"
                >
                  <TypographySectionTitle>
                    Write short description of your portfolio
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid container justify="space-between">
                    <StyledTextArea
                      placeholder="Type something here"
                      value={portfolioDescription}
                      onChange={(e) => this.changePortfolioDescription(e)}
                    />
                  </Grid>
                </FormControl>
              </Grid>

              <Grid container style={{ paddingBottom: '1.5rem' }}>
                <Grid container alignItems="center" wrap="nowrap">
                  <TypographySectionTitle>
                    Set price of your portfolio
                  </TypographySectionTitle>
                  <Line />
                </Grid>
                <FormControl fullWidth required>
                  <Grid
                    style={{
                      paddingBottom: '1.5rem',
                      borderBottom: '2px solid #E0E5EC',
                    }}
                    container
                    justify="space-between"
                    wrap="nowrap"
                  >
                    <StyledInputTemplate
                      value={'Free'}
                      label={'Free'}
                      labelPlacement="start"
                      control={<SRadio checked={isPortfolioFree} />}
                      onChange={() => this.setState({ isPortfolioFree: true })}
                      style={{ justifyContent: 'flex-end' }}
                    />
                    <Grid
                      container
                      justify="flex-end"
                      alignItems="center"
                      style={{ width: 'auto', flexDirection: 'row' }}
                    >
                      <TypographySubTitle style={{ paddingRight: '2rem' }}>
                        Paid
                      </TypographySubTitle>
                      <StyledInput
                        type="number"
                        width="30"
                        value={portfolioPrice}
                        onChange={(e) => this.changePortfolioPrice(e)}
                        style={{ marginLeft: '0rem' }}
                      />
                      <StyledInputTemplate
                        value={'/ Mo'}
                        label={'/ Mo'}
                        labelPlacement="start"
                        control={<SRadio checked={!isPortfolioFree} />}
                        onChange={() =>
                          this.setState({ isPortfolioFree: false })
                        }
                        style={{
                          justifyContent: 'flex-end',
                          marginLeft: '1.5rem',
                        }}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
                <Grid container justify="center" alignItems="center">
                  <ShareButton
                    padding=""
                    onClick={() => this.sharePortfolioHandler(true)}
                  >
                    Send to market
                  </ShareButton>
                </Grid>
              </Grid>
            </>
          )}
        </StyledDialogContent>
        <DialogFooter id="customized-dialog-title">
          <TypographyFooter to={'/portfolio/social'}>
            Go to Social portfolio manager
          </TypographyFooter>
        </DialogFooter>

        <MiniSuccessPopup
          isOpen={openLinkPopup}
          text="Link copied to clipboard"
        />

        <MiniSuccessPopup
          isOpen={openInvitePopup}
          text={`Invite link sent to ${
            selectedUsername ? selectedUsername.label : 'unchoosen user'
          }`}
        />
      </Dialog>
    )
  }
}
