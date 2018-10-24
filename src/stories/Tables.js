import React from 'react';
import { storiesOf } from '@storybook/react';

import { backgrounds } from './backgrounds';
import Tables from '../components/Tables';
import { mock } from '../components/Tables/mocks';
import { withInfo } from '@storybook/addon-info';
import { object } from '@storybook/addon-knobs/react';

const groupId = 'GROUP-ID1';

const props = {};

storiesOf('TablesWithCheckbox', module)
  .addDecorator(backgrounds)
  .add(
    'Table',
    withInfo()(() => <Tables rows={mock} {...object('legends', props, groupId)} />),
  );
