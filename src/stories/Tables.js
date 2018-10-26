import React from 'react'
import { storiesOf } from '@storybook/react'

import { backgrounds } from './backgrounds'
import Tables from '../components/Tables'
import { mock } from '../components/Tables/mocks'
import { withInfo } from '@storybook/addon-info'
import {
  object,
  number,
  boolean,
  text,
  array,
} from '@storybook/addon-knobs/react'
import Paper from '@material-ui/core/Paper'
import { Grid } from '@material-ui/core'
import Sort from '../components/Tables/sort'

const groupId = 'GROUP-ID11'

const props = { withCheckboxes: true }

storiesOf('TablesWithCheckbox', module)
  .addDecorator(backgrounds)
  .add(
    'Table',
    withInfo()(() => (
      <Grid container style={{ height: '25rem' }}>
        <Grid item xs={12}>
          <Paper
            style={{
              height: '100%',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Sort
              title="Title"
              sort={{
                sortColumn: 2,
                sortDirection: 'desc',
                sortHandler: () => {
                  console.log('sorted')
                },
              }}
              rows={mock}
            />
          </Paper>
        </Grid>
      </Grid>
    ))
  )
