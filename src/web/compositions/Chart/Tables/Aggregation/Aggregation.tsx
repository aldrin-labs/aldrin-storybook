import React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import MdAddCircleOutline from '@material-ui/icons/AddCircleOutlined'

import { Row, Table, Head, Cell, HeadCell } from '@storybook/components/OldTable/Table'
import { IProps } from './Aggregation.types'
import { MASTER_BUILD } from '@core/utils/config'

const Aggregation = (props: IProps) => {
  const {
    aggregation,
    onButtonClick,
    theme: { palette },
  } = props

  return (
    <AggregationWrapper borderTopColor={palette.divider}>
      <AggHead border={'transparent'} background={palette.background.paper}>
        <Row background={palette.background.paper} isHead>
          <Cell width={'10%'} />
          <HeadCell width={'45%'}>
            <Typography color="textPrimary" variant="caption">
              Aggregation
            </Typography>
          </HeadCell>
          <HeadCell width={'20%'}>
            <Typography color="secondary" variant="caption">
              {aggregation.toFixed(2)}
            </Typography>
          </HeadCell>
          <HeadCell
            style={{
              zIndex: 1000,
            }}
            width={'25%'}
          >
            {!MASTER_BUILD && (
              <Button>
                <MdAddCircleOutline
                  onClick={onButtonClick}
                  style={{
                    color: palette.primary['light'],
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                />
              </Button>
            )}
          </HeadCell>
        </Row>
      </AggHead>
    </AggregationWrapper>
  )
}

const AggHead = styled(Head)`
  height: 26px;

  @media (max-width: 1080px) {
    height: 40px;
  }
`

const Button = styled.button`
  position: relative;
  bottom: 1px;

  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  text-align: inherit;
  color: white;
  background: transparent;

  line-height: normal;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
`

const AggregationWrapper = styled(Table)`
  z-index: 100;
  bottom: 0;
  border-top: 1px solid
    ${(props: { borderTopColor: string }) => props.borderTopColor};
  position: absolute;
  width: 100%;

  @media (max-width: 1080px) {
    z-index: 100;
    bottom: 0;
    position: absolute;
    width: 100%;
  }
`
export default Aggregation
