import React, { Component } from 'react'
import StarRatingComponent from 'react-star-rating-component'
import {
  TypographyHeader,
  ButtonCustom,
  TypographyTariff,
  GridCell,
  TypographyTitle,
  GridMainContainer,
  SpanCell,
} from './SocialPortfolioInfoPanel.styles'
import { Grid, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/core'

@withTheme()
class SocialPortfolioInfoPanel extends Component {
  state = {
    rating: 0,
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue })
  }

  render() {
    const { rating } = this.state
    const { theme } = this.props
    return (
      <GridMainContainer
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item lg={2} justify="center">
          <TypographyHeader>George soros</TypographyHeader>
          <TypographyHeader>portfolio</TypographyHeader>
        </Grid>

        <Grid item lg={7}>
          <Grid container justify="center" alignItems="center">
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              lg={3}
            >
              <TypographyTitle>
                By <SpanCell>G.Soros</SpanCell>
              </TypographyTitle>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              lg={4}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Grid>
                <StarRatingComponent
                  name="rate1"
                  starCount={5}
                  value={rating}
                  starColor={'#DEDB8E'}
                  emptyStarColor={'#E0E5EC'}
                  onStarClick={this.onStarClick.bind(this)}
                />
              </Grid>
              <TypographyTitle style={{ padding: '0 0 0 5px' }}>
                4324 votes
              </TypographyTitle>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              lg={3}
            >
              <TypographyTitle>8500 Subscribers</TypographyTitle>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              style={{ width: '100%' }}
              item
              lg={1}
            >
              <TypographyTariff textColor={'#2F7619'}>
                Free
              </TypographyTariff>
            </GridCell>
          </Grid>
        </Grid>

        <Grid container lg={3} alignItems="flex-end" justify="flex-end">
          <ButtonCustom
            btnMargin={'auto 2px'}
            btnWidth={'100px'}
            btnHeight={'26px'}
            btnBorderColor={'#165BE0'}
            btnTextColor={'#165BE0'}
            btnBgColor={'transparent'}
            btnHoverColor={'#165BE0'}
            btnHoverTextColor={'#fff'}
            btnRadius={'10px'}
            btnFontSize={'0.75rem'}
            borderColor={'#165BE0'}
          >
            to rebalance
          </ButtonCustom>
          <ButtonCustom
            btnMargin={'auto 2px'}
            btnWidth={'100px'}
            btnHeight={'26px'}
            btnBorderColor={'#165BE0'}
            btnTextColor={'#fff'}
            btnBgColor={'#165BE0'}
            btnHoverColor={'#B93B2B'}
            btnHoverTextColor={'#fff'}
            btnRadius={'10px'}
            btnFontSize={'0.75rem'}
          >
            following
          </ButtonCustom>
        </Grid>
      </GridMainContainer>
    )
  }
}

export default SocialPortfolioInfoPanel
