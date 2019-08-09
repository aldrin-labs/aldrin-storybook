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
import SwitchOnOff from '@sb/components/SwitchOnOff'

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
    } else if (type === 'number') {
      value = Number(e.target.value)
    } else if (type === 'object') {
      try {
        value = String(e.target.value)
      } catch (e) {
        //console.log(e)
      }
    }

    updateProperties({
      ...propertiesState,
      [name]: { value, type },
    })
  }

  const handleBoolean = (name, type, bool) => {
    updateProperties({
      ...propertiesState,
      [name]: { value: !bool, type },
    })
  }

  const resetValue = (name, type, value) => {
    if (type === 'number') {
      value = Number(value)
    }

    updateProperties({
      ...propertiesState,
      [name]: { value, type },
    })
  }

  const createUpdatedData = () => {
    const arr = Object.entries(propertiesState).map(
      ([name, { type, value }]) => {
        if (type === 'object') {
          try {
            return [name, type, JSON.parse(value)]
          } catch (e) {}
        }
        return [name, type, value]
      }
    )

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
        console.log(propertiesState)
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
                let [name, type, value] = property
                if (type === 'object') value = JSON.stringify(value)

                return (
                  <SignalPropertyGrid>
                    <PropertyName>{name}</PropertyName>
                    {type !== 'boolean' ? (
                      <>
                        <PropertyInput
                          width="60"
                          placeholder={value}
                          type={type}
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
                          <Refresh
                            color="inherit"
                            style={{ margin: '0 auto' }}
                          />
                        </RefreshButton>
                      </>
                    ) : (
                      <SwitchOnOff
                        enabled={
                          propertiesState[name]
                            ? propertiesState[name].value
                            : updateProperties({
                                ...propertiesState,
                                [name]: { value, type },
                              })
                        }
                        _id={name}
                        onChange={() => handleBoolean(name, type, value)}
                      />
                    )}
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
