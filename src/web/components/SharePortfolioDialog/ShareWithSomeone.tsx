import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Grid,
  Typography,
  Checkbox,
  Radio,
} from '@material-ui/core'

import SearchUserEmails from '@core/components/SearchUserEmails/SearchUserEmails'
import { IProps } from './ShareWithSomeone.types'

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

export const ShareWithSomeone = ({  }: IProps) => (
  <>
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
      <Grid container justify="space-between">
        <Typography>Share with anyone by the link</Typography>
        <Button disabled={true}>Copy link</Button>
      </Grid>
      <Grid container justify="space-between">
        <Grid item style={{ minWidth: '300px' }}>
          <SearchUserEmails
            isClearable={true}
            value={
              selectedUserEmail
                ? [
                    {
                      label: selectedUserEmail.label,
                      value: selectedUserEmail.value,
                    },
                  ]
                : null
            }
            onChange={this.onChangeUserEmail}
          />
        </Grid>
        <Button disabled={!selectedUserEmail}>Invite</Button>
      </Grid>
    </Grid>
  </>
)
