import React from 'react';
import { storiesOf } from '@storybook/react';

import { backgrounds } from './backgrounds';
import Tables from '../components/Tables';
import { mock } from '../components/Tables/mocks';
import { withInfo } from '@storybook/addon-info';
import { object } from '@storybook/addon-knobs/react';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';

const groupId = 'GROUP-ID11';

const props = { withCheckboxes: true };

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
            <Tables rows={mock} title="hi" {...{ ...object('props', props, groupId) }} />
          </Paper>
        </Grid>
      </Grid>
    )),
  );
