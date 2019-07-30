import React, { Component } from 'react'
import StarRatingComponent from 'react-star-rating-component'
import {
  TypographyHeader,
  ButtonCustom,
  TypographyTariff,
  GridCell,
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
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{ marginTop: '50px' }}
      >
        <Grid item lg={3}>
          <TypographyHeader>
            {/* <TypographyHeader textColor={theme.palette.primary.dark}> */}
            George soros portfolio
          </TypographyHeader>
        </Grid>

        <Grid item lg={6}>
          <Grid container justify="center" alignItems="center">
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              lg={3}
            >
              <Typography>By</Typography>
              <Typography>G.Soros</Typography>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              lg={3}
            >
              <StarRatingComponent
                name="rate1"
                starCount={5}
                value={rating}
                starColor={'#DEDB8E'}
                emptyStarColor={'#E0E5EC'}
                onStarClick={this.onStarClick.bind(this)}
              />
              <Typography>4324 votes</Typography>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              lg={3}
            >
              <Typography>8500 Subscribers</Typography>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              lg={3}
            >
              <TypographyTariff textColor={'#2F7619'}>Free</TypographyTariff>
            </GridCell>
          </Grid>
        </Grid>

        <Grid item lg={3} alignItems="flex-end">
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
            btnFontSize={'0.5625rem'}
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
            btnFontSize={'0.5625rem'}
          >
            following
          </ButtonCustom>
        </Grid>
      </Grid>
    )
  }
}

export default SocialPortfolioInfoPanel
