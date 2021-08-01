import React from 'react'
import Attention from '@icons/attention.svg';
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles';
import SvgIcon from '../SvgIcon';
import { Title, ColorText } from './AttentionComponent.styles';

const AttentionComponent = ({
  blockHeight = '12rem',
  iconStyle = {
    height: '80%'
  },
  textStyle = {},
  text = '',
}) => {
  return (
    <RowContainer>
      <ColorText
        width={'100%'}
        height={blockHeight}
        background={'rgba(242, 154, 54, 0.5)'}
      >
        <SvgIcon alt={'Attention'} src={Attention} height={iconStyle.height || '50%'} style={iconStyle} />
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '87%',
            justifyContent: 'space-around',
            padding: '.5rem 0',
          }}
        >
          <Title
            fontSize={'1.2rem'}
            textAlign={'inherit'}
            style={{ ...textStyle, paddingRight: '1rem' }}
          >
            {text}
          </Title>
        </span>
      </ColorText>
    </RowContainer>
  );
};

export default AttentionComponent;
