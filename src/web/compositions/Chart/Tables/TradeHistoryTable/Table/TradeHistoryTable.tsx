import React, { memo, PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import Collapse from '@material-ui/core/Collapse'
import MdArrowDropUp from '@material-ui/icons/ArrowDropUp'
import MdArrowUpward from '@material-ui/icons/ArrowUpward'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  HeadCell,
  Cell,
} from '@storybook/components/OldTable/Table'
import { IProps, IState, ITicker } from './TradeHistoryTable.types'
import { Loading } from '@storybook/components/Loading'
import { TypographyFullWidth } from '@storybook/styles/cssUtils'

const OptimizedRow = memo(
  ({ ticker, background, numbersAfterDecimalForPrice, red, green }) => (
    <Row background={background.default}>
      <Cell style={{ padding: '0 0.2rem' }} width={'30%'}>
        <TypographyFullWidth noWrap={true} variant="caption" align="right">
          {Number(ticker.size).toFixed(4)}
        </TypographyFullWidth>
      </Cell>
      <Cell width={'40%'} style={{ padding: '0 0.2rem', display: 'flex' }}>
        <StyledArrow
          fontSize="small"
          color={ticker.fall ? red.main : green.main}
          direction={ticker.fall ? 'down' : 'up'}
        />
        <StyledTypography
          textColor={ticker.fall ? red.main : green.main}
          noWrap={true}
          variant="caption"
          align="right"
        >
          {Number(ticker.price).toFixed(numbersAfterDecimalForPrice)}
        </StyledTypography>
      </Cell>
      <Cell style={{ padding: '0 0.2rem' }} width={'30%'}>
        <TypographyFullWidth
          color="textSecondary"
          noWrap={true}
          variant="caption"
          align="right"
        >
          {ticker.time}
        </TypographyFullWidth>
      </Cell>
    </Row>
  ),
  (prevProps, nextProps) =>
    nextProps.ticker.id === prevProps.ticker.id &&
    nextProps.background === prevProps.background
)

const MemoizedHead = memo(
  ({ tableExpanded, primary, type, palette, onClick, quote }) => (
    <>
      <TriggerTitle
        data-e2e="tradeHistory__arrowButton"
        background={primary[type]}
        onClick={onClick}
      >
        <TypographyFullWidth
          textColor={palette.getContrastText(primary[type])}
          variant="subtitle1"
          align="center"
        >
          Trade history
        </TypographyFullWidth>

        <StyledArrowSign
          variant={{
            tableCollapsed: !tableExpanded,
            up: !tableExpanded,
          }}
          style={{
            marginRight: '0.5rem',
            color: palette.secondary.main,
          }}
        />
      </TriggerTitle>
      <Head background={palette.background.default} border={palette.divider}>
        <Row
          background={palette.background.default}
          isHead={true}
          style={{ height: '100%' }}
        >
          <HeadCell style={{ padding: '0 ' }} color="#9ca2aa" width={'30%'}>
            <TypographyFullWidth
              textColor={palette.getContrastText(palette.background.default)}
              variant="body2"
              align="right"
              noWrap={true}
            >
              Trade Size
            </TypographyFullWidth>
          </HeadCell>
          <HeadCell
            color="#9ca2aa"
            style={{ padding: '0 0.2rem' }}
            width={'40%'}
          >
            <TypographyFullWidth
              noWrap={true}
              textColor={palette.getContrastText(palette.background.default)}
              variant="body2"
              align="right"
            >
              Price {quote || 'Fiat'}
            </TypographyFullWidth>
          </HeadCell>
          <HeadCell
            style={{
              lineHeight: '32px',
              padding: '0 0.2rem',
            }}
            width={'30%'}
          >
            <TypographyFullWidth
              variant="body2"
              textColor={palette.getContrastText(palette.background.default)}
              align="right"
            >
              Time
            </TypographyFullWidth>
          </HeadCell>
        </Row>
      </Head>
    </>
  ),
  (prevProps, nextProps) =>
    nextProps.tableExpanded === prevProps.tableExpanded &&
    nextProps.type === prevProps.type &&
    nextProps.quote === prevProps.quote
)

class TradeHistoryTable extends PureComponent<IProps, IState> {
  state = {
    tableExpanded: true,
  }

  onClick = () => {
    this.setState((prevState) => ({
      tableExpanded: !prevState.tableExpanded,
    }))
  }

  render() {
    const {
      numbersAfterDecimalForPrice,
      quote,
      data,
      theme: { palette },
    } = this.props
    const { tableExpanded } = this.state
    const { background, primary, type, red, green } = palette
    const { onClick } = this

    return (
      <TradeHistoryTableCollapsible tableExpanded={tableExpanded}>
        <CollapseWrapper in={tableExpanded} collapsedHeight="2.5rem">
          <MemoizedHead
            {...{
              tableExpanded,
              primary,
              type,
              palette,
              onClick,
              quote,
            }}
          />
          <Body
            data-e2e="tradeHistory__body"
            background={background.default}
            height="42vh"
          >
            {data.length === 0 && tableExpanded ? (
              <Loading centerAligned={true} />
            ) : (
              <>
                {data.map((ticker: ITicker, i: number) => (
                  <OptimizedRow
                    key={ticker.id}
                    {...{
                      ticker,
                      background,
                      numbersAfterDecimalForPrice,
                      red,
                      green,
                    }}
                  />
                ))}
              </>
            )}
          </Body>
        </CollapseWrapper>
      </TradeHistoryTableCollapsible>
    )
  }
}

const StyledTypography = styled(TypographyFullWidth)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
  }
`

const TriggerTitle = styled(Title)`
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
  transition: opacity 0.75s ease-in-out;
  height: 2.875rem;
  &:hover {
    opacity: 0.85;
  }
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const CollapsibleTable = styled(Table)`
  position: absolute;
  bottom: 0;
  max-height: calc(70% - 37px);
  z-index: 10;
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

const TradeHistoryTableCollapsible = styled(CollapsibleTable)`
  max-height: 50%;

  @media (max-width: 1080px) {
    bottom: 0.5rem;
  }
`

const StyledArrowSign = styled(MdArrowDropUp)`
  font-size: 2rem;
  transform: ${(props) =>
    props.variant.up ? 'rotate(0deg)' : 'rotate(180deg)'};

  position: absolute;
  left: 0.25rem;

  bottom: 15%;
  transition: all 0.5s ease;

  ${TriggerTitle}:hover & {
    animation: ${(props) =>
        props.variant.tableCollapsed ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }
`

const JumpDownArrow = keyframes`
0% {
  bottom: 15%;
}
50% {
  bottom: -10%;
}
100% {
  bottom: 15%;

}
`
const JumpUpArrow = keyframes`
0% {
  bottom: 15%;
}
50% {
  bottom: 50%;
}
100% {
  bottom: 15%;
}
`

const StyledArrow = styled(MdArrowUpward)`
  min-width: 20%;
  color: ${(props: { direction: string; color: string }) => props.color};

  transform: ${(props: { direction: string; color: string }) =>
    props.direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)'};
`

export default TradeHistoryTable
