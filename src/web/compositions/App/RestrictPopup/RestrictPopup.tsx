import React from 'react'
import { withSnackbar } from 'notistack'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { Grid, Typography, withTheme, Link, Theme } from '@material-ui/core'
import { SvgIcon } from '@sb/components'

import { joinFuturesWarsRound } from '@core/graphql/mutations/futuresWars/joinFuturesWarsRound'
import { futuresTransfer } from '@core/graphql/mutations/keys/futuresTransfer'

import {
  DialogWrapper,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'
import sadSmile from '@icons/sadSmile.svg'

interface IProps {
  open: boolean
  theme: Theme
}

const RestrictPopup = ({
  open,
  theme,
}: IProps) => {

  return (
    <>
      <DialogWrapper
        theme={theme}
        aria-labelledby="customized-dialog-title"
        // onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          paddingTop: 0,
        }}
        PaperProps={{ style: { minWidth: '680px'} }}
      >
        <DialogContent
          theme={theme}
          justify="center"
          style={{
            padding: '3rem',
            backgroundColor: '#16253D',
            border: 0,
            textAlign: 'center',
          }}
        >
          <Grid>
          <Grid style={{ padding: '2rem 0 3rem 0' }}>
              <SvgIcon src={sadSmile} width="78px" height="auto" />
            </Grid>
            <Grid style={{ paddingBottom: '2rem' }}>
                <Typography
                    style={{
                      paddingBottom: '1.4rem',
                      fontSize: '3.2rem',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',

                    }}
                >
                    Sorry, your state law does not <br/> allow you to use our platform
                </Typography>  
            </Grid>
            <Grid style={{ paddingBottom: '2rem', textAlign: 'center' }}>
                <Typography
                    style={{
                      paddingBottom: '1.4rem',
                      color: '#ABBAD1',
                      fontSize: '1.6rem'
                    }}
                >
                    If you think we made a mistake or wish to contact us for another reason:
                </Typography>  
            </Grid>
            <Grid style={{ paddingBottom: '3rem' }}>
            <Link 
              target={'_blank'}
              rel={'noreferrer noopener'}
              href="mailto:contact@cryptocurrencies.ai"
              style={{
                width: '38%',
                borderRadius: '32px',
                border: '.1rem solid #fff',
                fontWeight: 'bold',
                fontSize: '1.4rem',
                height: '4rem',
                textTransform: 'uppercase',
                padding: '1.5rem 4rem',
                fontFamily: 'DM Sans',
                letterSpacing: '1px',
                textDecoration: 'none',
              }}
            >
              Contact us
            </Link>
            {/* <BtnCustom
                btnWidth={'38%'}
                borderRadius={'16px'}
                btnColor={'#FFFFFF'}
                // hoverColor={'transparent'}
                // hoverBackground={'transparent'}
                borderWidth={'.1rem'}
                fontWeight={'bold'}
                fontSize={'1.2rem'}
                height={'4rem'}
                onClick={undefined}
              >
                  Contact us
              </BtnCustom> */}
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default compose(
  withSnackbar,
  withTheme(),
  graphql(futuresTransfer, {
    name: 'futuresTransferMutation',
  }),
  graphql(joinFuturesWarsRound, {
    name: 'joinFuturesWarsRoundMutation',
  })
)(RestrictPopup)
