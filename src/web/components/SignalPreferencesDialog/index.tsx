import React, { useState } from 'react'
import { Dialog, DialogTitle, Grid } from '@material-ui/core'
import { Clear, Refresh } from '@material-ui/icons'

// import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import {
  StyledPaper,
  TypographyTitle,
  StyledDialogContent,
  Line,
  ClearButton,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import {
  SignalPropertyGrid,
  PropertyName,
  SectionTitle,
  PropertyInput,
  SaveButton,
  RefreshButton,
} from './SignalPreferencesDialog.styles'

import { Query } from 'react-apollo'
import { GET_SIGNAL_PROPERTIES } from '@core/graphql/queries/signals/getSignalProperties'

const SignalPreferencesDialog = ({
  isDialogOpen,
  closeDialog,
  signalId,
  updateSignalMutation,
}) => {
  const [propertiesState, updateProperties] = useState({})

  const handleChange = (name, type, e) => {
    let value

    if (e.target.value === '') {
      value = ''
    } else if (type === 'float') {
      value = Number(Math.round(e.target.value * 1000) / 1000)
    } else if (type === 'int') {
      value = Number(parseInt(e.target.value, 10).toFixed(0))
    } else value = e.target.value

    updateProperties({
      ...propertiesState,
      [name]: { value, type },
    })
  }

  const resetValue = (name, type, value) => {
    if (type === 'float') {
      value = Number(Math.round(value * 1000) / 1000)
    } else if (type === 'int') {
      value = parseInt(value, 10).toFixed(0)
    }

    updateProperties({
      ...propertiesState,
      [name]: { value, type },
    })
  }

  const createUpdatedData = () => {
    const arr = Object.entries(propertiesState).map(([name, value]) => {
      return [name, value.type, value.value]
    })

    return JSON.stringify(arr.reverse())
  }

  return (
    <Query
      query={GET_SIGNAL_PROPERTIES}
      variables={{ signalId }}
      fetchPolicy="network-only"
    >
      {({ data, loading, error }) => {
        let { getSignalInputs } = data

        if (!getSignalInputs) return null
        const properties = JSON.parse(getSignalInputs)
        console.log(properties, signalId)
        return (
          <Dialog
            PaperComponent={StyledPaper}
            style={{ width: '100%', margin: 'auto' }}
            fullScreen={false}
            onClose={closeDialog}
            maxWidth={'md'}
            open={isDialogOpen}
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
                backgroundColor: '#F2F4F6',
                height: '4rem',
              }}
            >
              <TypographyTitle>signal preferences</TypographyTitle>
              <ClearButton>
                <Clear
                  style={{ fontSize: '2rem' }}
                  color="inherit"
                  onClick={closeDialog}
                />
              </ClearButton>
            </DialogTitle>
            <StyledDialogContent>
              <Grid
                style={{ padding: '.8rem 0' }}
                container
                alignItems="center"
                wrap="nowrap"
              >
                <SectionTitle>signal properties</SectionTitle>
                <Line />
              </Grid>
              {properties.map((property) => {
                const [name, type, value] = property
                let step
                let inputType = 'number'

                if (type === 'int') step = 1
                else if (type === 'float') step = 'any'
                else {
                  step = false
                  inputType = 'string'
                }

                return (
                  <SignalPropertyGrid>
                    <PropertyName>{name}</PropertyName>
                    <PropertyInput
                      width="60"
                      placeholder={value}
                      type={inputType}
                      step={step}
                      value={
                        propertiesState[name]
                          ? propertiesState[name].value
                          : updateProperties({
                              ...propertiesState,
                              [name]: { value, type },
                            })
                      }
                      onChange={(e) => handleChange(name, type, e)}
                    />
                    <RefreshButton
                      onClick={() => resetValue(name, type, value)}
                    >
                      <Refresh color="inherit" style={{ margin: '0 auto' }} />
                    </RefreshButton>
                  </SignalPropertyGrid>
                )
              })}
            </StyledDialogContent>
            <Grid
              item
              container
              justify="center"
              style={{ paddingBottom: '2rem' }}
            >
              <SaveButton
                padding=""
                onClick={() => {
                  console.log(signalId, createUpdatedData())
                  updateSignalMutation({
                    variables: {
                      signalId,
                      conditions: createUpdatedData(),
                    },
                  })
                }}
              >
                Save
              </SaveButton>
            </Grid>
          </Dialog>
        )
      }}
    </Query>
  )
}

export default SignalPreferencesDialog
