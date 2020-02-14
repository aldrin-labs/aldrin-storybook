import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withSnackbar } from 'notistack'
import { Grid, Button } from '@material-ui/core'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import { searchTelegramUsernameBySecretCode } from '@core/graphql/mutations/user/searchTelegramUsernameBySecretCode'
import { getTelegramUsername } from '@core/graphql/queries/user/getTelegramUsername'
import { client } from '@core/graphql/apolloClient'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'

import { StyledInputApiManagment } from '../ApiManagment/ApiManagment.styles'

const Telegram = (props) => {
  const [code, setCode] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')

  useEffect(() => {
    const { telegramUsername } = props.getTelegramUsername.getTelegramUsername
    if (telegramUsername !== null) {
      setTelegramUsername(telegramUsername)
    }
  }, [props.getTelegramUsername.getTelegramUsername.telegramUsername])

  const confirmCode = async (code: number) => {
    const {
      searchTelegramUsernameBySecretCodeMutation,
      enqueueSnackbar,
    } = props

    const data = await searchTelegramUsernameBySecretCodeMutation({
      variables: { code },
    })

    const username =
      data.data.searchTelegramUsernameBySecretCode.telegramUsername
    
    const { data: { searchTelegramUsernameBySecretCode: { status, message } } } = data

    if (username !== null && status === 'OK') {
      await setTelegramUsername(username)
      await enqueueSnackbar(`Telegram account successfully connected`, {
        variant: 'success',
      })
    } else {
      enqueueSnackbar(`${message}`, { variant: 'error' })
    }
  }

  return (
    <>
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{
          height: '100%',
          padding: '5% 1%',
          border: '2px solid #E0E5EC',
          boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
          borderRadius: '32px',
          marginBottom: '2%',
        }}
      >
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{
            width: '100%',
            height: !telegramUsername ? '30%' : '15%',
            marginBottom: '10rem',
          }}
        >
          {!telegramUsername ? (
            <>
              <Grid style={{ width: '100%' }}>
                <Grid
                  style={{
                    width: '40%',
                    margin: '0 auto',
                    textAlign: 'center',
                  }}
                >
                  <h2
                    style={{
                      textTransform: 'uppercase',
                      color: '#16253d',
                      fontFamily: 'DM Sans',
                      letterSpacing: '1.5px',
                    }}
                  >
                    Visit our telegram bot and get the code to input it here:
                  </h2>
                </Grid>
              </Grid>
              <Grid style={{ padding: '1rem 0 2rem 0', width: '40%' }}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={'https://t.me/FuturesWars_bot'}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      backgroundColor: '#f9fbfd',
                      padding: '1.5rem 0',
                      width: '100%',
                      color: '#16253d',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      letterSpacing: '1.5px',
                      borderRadius: '.4rem',
                      border: '.1rem solid #e0e5ec',
                      boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
                    }}
                  >
                    @FuturesWars_bot
                  </Button>
                </a>
              </Grid>
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ width: '100%' }}
              >
                <StyledInputApiManagment
                  placeholder="INPUT CODE HERE"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ width: '30%' }}
                />
                <Grid style={{ padding: '0 0 0 1rem', width: '10%' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      backgroundColor: '#0B1FD1',
                      padding: '2rem 0',
                      width: '100%',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      lineHeight: '109.6%',
                      letterSpacing: '1.5px',
                      borderRadius: '4px',
                      boxShadow: '0px 8px 12px rgba(8, 22, 58, 0.3)',
                    }}
                    onClick={() => {
                      console.log('onlick')
                      confirmCode(+code)
                    }}
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid style={{ width: '100%' }}>
                <Grid
                  style={{
                    width: '40%',
                    margin: '0 auto',
                    textAlign: 'center',
                  }}
                >
                  <h2
                    style={{
                      textTransform: 'uppercase',
                      color: '#29AC80',
                      fontSize: '2rem',
                      fontFamily: 'DM Sans',
                      letterSpacing: '1.5px',
                    }}
                  >
                    Account{' '}
                    <span style={{ color: '#0B1FD1' }}>{telegramUsername}</span>{' '}
                    attached
                  </h2>
                </Grid>
              </Grid>

              <Grid style={{ width: '100%' }}>
                <Grid
                  style={{
                    width: '40%',
                    margin: '0 auto',
                    textAlign: 'center',
                  }}
                >
                  <AddAccountDialog
                    isFuturesWars={true}
                    existCustomButton={true}
                    CustomButton={({
                      handleClick,
                    }: {
                      handleClick: () => void
                    }) => (
                      <Button
                        onClick={handleClick}
                        disabled={!telegramUsername}
                        style={{
                          width: '100%',
                          color: !!telegramUsername ? '#0B1FD1' : '#7284A0',
                          fontWeight: 'bold',
                          fontFamily: 'DM Sans',
                          border: !!telegramUsername
                            ? '.1rem solid #0B1FD1'
                            : '.1rem solid #7284A0',
                          borderRadius: '1.6rem',
                        }}
                      >
                        join futures wars
                      </Button>
                    )}
                  />
                  {/* <Button
                    style={{
                      width: '100%',
                      color: '#0B1FD1',
                      fontWeight: 'bold',
                      fontFamily: 'DM Sans',
                      border: '.1rem solid #0B1FD1',
                      borderRadius: '1.6rem',
                    }}
                  >
                    join futures wars
                  </Button> */}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default compose(
  withSnackbar,
  queryRendererHoc({
    query: getTelegramUsername,
    name: 'getTelegramUsername',
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
  }),
  graphql(searchTelegramUsernameBySecretCode, {
    name: 'searchTelegramUsernameBySecretCodeMutation',
  })
)(Telegram)
