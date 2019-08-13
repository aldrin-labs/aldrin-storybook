import React, { Component } from 'react'
import StarRatingComponent from 'react-star-rating-component'
import {
  TypographyHeader,
  ButtonCustom,
  TypographyTariff,
  GridCell,
  TypographyTitle,
  GridMainContainer,
  Link,
} from './SocialPortfolioInfoPanel.styles'
import { Grid } from '@material-ui/core'
import { withTheme } from '@material-ui/core'

const getOwner = (str: string) => {
  if (!str) {
    return 'public'
  }

  const b = str.match(/(?<=\').*(?=')/gm)

  return (b && b[0]) || 'public'
}

@withTheme()
class SocialPortfolioInfoPanel extends Component {
  state = {
    rating: 0,
    isFollow: false,
    isFollowEnter: false,
  }

  onMouseEnterFollow = () => {
    this.setState({ isFollowEnter: !this.state.isFollowEnter })
  }

  onMouseLeaveFollow = () => {
    this.setState({ isFollowEnter: !this.state.isFollowEnter })
  }

  handleToggleFollowBtn = () => {
    const { id, unfollowPortfolioMutation } = this.props

    this.setState({ isFollow: !this.state.isFollow })
    unfollowPortfolioMutation({
      variables: {
        id,
      },
    })
  }

  onStarClick = (nextValue, prevValue, name) => {
    this.setState({ rating: nextValue })
  }

  render() {
    const { rating } = this.state
    const {
      theme,
      folioData,
      isFollowingTab,
      isStatsOpen,
      toggleStats,
    } = this.props

    return (
      <GridMainContainer
        container
        justify="space-between"
        alignItems="center"
        style={{ height: '70px' }}
      >
        <Grid item lg={2} justify="center">
          <TypographyHeader>{folioData.name}</TypographyHeader>
          {/* <TypographyHeader>George soros</TypographyHeader> */}
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
                {folioData.isPrivate
                  ? getOwner(folioData.ownerId)
                  : `Public portfolio`}
                {/* By <SpanCell>G.Soros</SpanCell> */}
              </TypographyTitle>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              lg={4}
            >
              <Grid>
                <StarRatingComponent
                  name="rate1"
                  starCount={5}
                  value={rating}
                  starColor={'#DEDB8E'}
                  emptyStarColor={'#E0E5EC'}
                  onStarClick={this.onStarClick}
                />
              </Grid>
              <TypographyTitle padding={'0 0 0 5px'}>
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
              widthCell={'100%'}
              item
              lg={1}
            >
              <TypographyTariff textColor={'#2F7619'}>Free</TypographyTariff>
            </GridCell>
          </Grid>
        </Grid>

        <Grid container lg={3} alignItems="flex-end" justify="flex-end">
          <Link
            to="/portfolio/rebalance"
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
            To Rebalance
          </Link>
          {isFollowingTab ? (
            <ButtonCustom
              btnMargin={'auto 2px'}
              btnWidth={'100px'}
              btnHeight={'26px'}
              btnTextColor={'#fff'}
              btnBorderColor={!this.state.isFollowEnter ? '#165BE0' : '#B93B2B'}
              btnBgColor={!this.state.isFollowEnter ? '#165BE0' : '#B93B2B'}
              btnHoverColor={this.state.isFollowEnter ? '#B93B2B' : '#165BE0'}
              btnHoverTextColor={'white'}
              btnRadius={'10px'}
              btnFontSize={'0.75rem'}
              onClick={this.handleToggleFollowBtn}
              onMouseEnter={this.onMouseEnterFollow}
              onMouseLeave={this.onMouseLeaveFollow}
            >
              {this.state.isFollowEnter ? 'unfollow' : 'following'}
              {/* {this.state.isFollow ? 'unfollow' : 'following'} */}
            </ButtonCustom>
          ) : (
            <ButtonCustom
              btnMargin={'auto 2px'}
              btnWidth={'100px'}
              btnHeight={'25px'}
              btnBorderColor={'#165BE0'}
              btnTextColor={'#165BE0'}
              btnBgColor={'transparent'}
              btnHoverColor={'#165BE0'}
              btnHoverTextColor={'#fff'}
              btnRadius={'10px'}
              btnFontSize={'0.75rem'}
              borderColor={'#165BE0'}
              onClick={toggleStats}
              isStats={true}
            >
              {isStatsOpen ? 'performance' : 'stats'}
            </ButtonCustom>
          )}
        </Grid>
      </GridMainContainer>
    )
  }
}

export default SocialPortfolioInfoPanel
