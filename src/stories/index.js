import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import styled from 'styled-components';
import App from '../App.js';
import Button from '../components/Button/Button.js';
import Input from '../components/Input/Input.js';

storiesOf('Form', module)
	.add('App', () => <App/>)
	.add('Input', () => <Input placeholder="test"/>)
	.add('Button', () => <Button text="click"/>);

