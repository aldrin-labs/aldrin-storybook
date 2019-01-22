import React, { Component } from 'react'
import { Typography, CardContent } from '@material-ui/core'

import {
  IProps,
  IState,
} from './Table.types'
import {
  AddStyled,
  StyledCard,
  Input,
  Item,
  HeadItem,
  Head,
  TableInput,
  StyledTable,
  StyledTableWithoutInput,
  Col,
  Body,
  StyledDeleteIcon,
} from './Table.styles'

export default class Table extends Component<IProps, IState> {
  state = {
    name: '',
    value: null,
  }

  formatString = (str: string) => str.toUpperCase().replace(/\s+/g, '')

  handleChangeName = (event: any) => {
    if (event.target.value.length < 10) {
      this.setState({
        name: this.formatString(event.target.value),
      })
    }
  }
  handleChangeValue = (event: any) => {
    this.setState({
      value: this.formatString(event.target.value),
    })
  }

  onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.props.onPlusClick &&
        this.props.onPlusClick(this.state.name, this.state.value)

      this.setState({ name: '', value: '' })
    }
  }

  render() {
    const {
      withInput,
      data,
      onClickDeleteIcon,
      onPlusClick,
      optimizedData,
      filterValueSmallerThenPercentage,
      activeButton,
      theme: { palette },
    } = this.props
    const textColor: string = palette.getContrastText(palette.background.paper)

    if (withInput) {
      return (
        <StyledTable background={palette.background.paper}>
          <Head bottomCollor={textColor}>
            <HeadItem background={palette.background.paper}>
              <Typography variant="body1" align="center">
                {' '}
                Coin
              </Typography>
            </HeadItem>
            <HeadItem background={palette.background.paper}>
              <Typography variant="body1" align="center">
                Portfolio%
              </Typography>
            </HeadItem>
            <HeadItem background={palette.background.paper}>
              <Typography variant="body1" align="center">
                Optimized%
              </Typography>
            </HeadItem>
          </Head>
          <Body scrollBarWidth={5}>
            {data.length === 0 ? (
              <StyledCard>
                <CardContent>
                  <Typography variant="h3" align="center" color="secondary">
                    No Coins.
                  </Typography>
                  <Typography variant="h5" align="center" color="primary">
                    Add something to optimize.
                  </Typography>
                </CardContent>
              </StyledCard>
            ) : null}

            <Col>
              {data
                .filter((d) => d.percentage > filterValueSmallerThenPercentage)
                .map((item, i) => (
                  <Item
                    background={palette.background.paper}
                    evenBackground={palette.action.hover}
                    key={`percentage-opt-${item.coin}${item.percentage}${i}`}
                  >
                    <Typography variant="body1" align="center">
                      {item.coin}
                    </Typography>
                  </Item>
                ))}
            </Col>

            <Col>
              {data
                .filter((d) => d.percentage > filterValueSmallerThenPercentage)
                .map((item, i) => (
                  <Item
                    background={palette.background.paper}
                    evenBackground={palette.action.hover}
                    key={`percentage-opt-${item.coin}${item.percentage}${i}`}
                  >
                    <Typography variant="body1" align="center">
                      {`${Number(item.percentage).toFixed(2)}%`}{' '}
                    </Typography>
                  </Item>
                ))}
            </Col>
            {optimizedData.length >= 1 ? (
              <Col>
                {data
                  .filter(
                    (d) => d.percentage > filterValueSmallerThenPercentage
                  )
                  .map((item, i) => (
                    <Item
                      background={palette.background.paper}
                      evenBackground={palette.action.hover}
                      key={`percentage-opt-${item.coin}${item.percentage}${i}`}
                    >
                      <Typography variant="body1" align="center">
                        {item.optimizedPercentageArray &&
                        item.optimizedPercentageArray[activeButton]
                          ? `${item.optimizedPercentageArray[activeButton]}%`
                          : '-'}
                      </Typography>

                      <StyledDeleteIcon
                        onClick={() => {
                          if (onClickDeleteIcon) {
                            onClickDeleteIcon(i)
                          }
                        }}
                      />
                    </Item>
                  ))}
              </Col>
            ) : (
              <Col>
                {data
                  .filter(
                    (d) => d.percentage > filterValueSmallerThenPercentage
                  )
                  .map((item, i) => (
                    <Item
                      background={palette.background.paper}
                      evenBackground={palette.action.hover}
                      key={i}
                    >
                      <Typography variant="body1" align="center">
                        {'-'}{' '}
                      </Typography>
                      <StyledDeleteIcon
                        onClick={() => {
                          onClickDeleteIcon && onClickDeleteIcon(i)
                        }}
                      />{' '}
                    </Item>
                  ))}
              </Col>
            )}
          </Body>
          <TableInput>
            <Item background={palette.background.paper}>
              <Input
                id="AddCoinText"
                color={textColor}
                placeholder="Coin"
                type="text"
                value={this.state.name || ''}
                onChange={this.handleChangeName}
                onKeyDown={this.onKeyDown}
              />
            </Item>
            <Item background={palette.background.paper} />
            <Item
              background={palette.background.paper}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                // because of nth-child(even)
              }}
            >
              <AddStyled
                id="AddIcon"
                onClick={() => {
                  if (onPlusClick) {
                    onPlusClick(this.state.name, this.state.value)
                  }
                  this.setState({ name: '' })
                  this.setState({ value: '' })
                }}
              />
            </Item>
          </TableInput>
        </StyledTable>
      )
    } else {
      return (
        <StyledTableWithoutInput background={palette.background.paper}>
          <Head>
            <HeadItem>Coin</HeadItem>
            <HeadItem>Portfolio%</HeadItem>
          </Head>
          <Body scrollBarWidth={5}>
            <Col>
              {data.map((item, i) => (
                <Item key={i}>{item.coin}</Item>
              ))}
            </Col>

            <Col>
              {data.map((item, i) => (
                <Item key={i}>{`${Number(item.percentage).toFixed(2)}%`}</Item>
              ))}
            </Col>
          </Body>
        </StyledTableWithoutInput>
      )
    }
  }
}
