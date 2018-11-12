import React from 'react'
import { storiesOf } from '@storybook/react'
import MoreVertIcon from '@material-ui/icons/NetworkCellSharp'
import { action } from '@storybook/addon-actions'

import { backgrounds } from './backgrounds'
import { mock } from '../components/Tables/mocks'
import { withInfo } from '@storybook/addon-info'
import { object, number, boolean, text, array } from '@storybook/addon-knobs'
import Paper from '@material-ui/core/Paper'
import { Grid } from '@material-ui/core'
import Sort from '../components/Tables/WithSort'

storiesOf('TablesWithCheckbox', module)
  .addDecorator(backgrounds)
  .add('Table', () => (
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
            withCheckboxes={boolean('witchCheckboxes', true)}
            title="Title"
            data={mock.data}
            checkedRows={['1']}
            columnNames={mock.head}
            actionsColSpan={number('actionsColSpan', 1)}
            actions={[
              {
                id: '1',
                icon: <MoreVertIcon />,
                onClick: action('1'),
                color: 'primary',
              },
              {
                id: '2',
                icon: <MoreVertIcon />,
                onClick: action('2'),
              },
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  ))
