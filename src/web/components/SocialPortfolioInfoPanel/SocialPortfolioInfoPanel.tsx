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
import { withTheme } from '@material-ui/styles'

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
    const {
      id,
      unfollowedPortfolios,
      unfollowPortfolio,
      followPortfolio,
    } = this.props

    const isFollowingPortfolio = !unfollowedPortfolios.includes(id)

    isFollowingPortfolio ? unfollowPortfolio(id) : followPortfolio(id)
    // this.setState({ isFollow: !this.state.isFollow })
  }

  onStarClick = (nextValue, prevValue, name) => {
    this.setState({ rating: nextValue })
  }

  render() {
    const { rating, isFollowEnter } = this.state
    const {
      theme,
      id,
      folioData,
      isFollowingTab,
      isStatsOpen,
      toggleStats,
      unfollowedPortfolios,
    } = this.props
    const isFollowingPortfolio = !unfollowedPortfolios.includes(id)

    let textToShow

    if (isFollowEnter) {
      textToShow = isFollowingPortfolio ? 'unfollow' : 'following'
    } else {
      textToShow = isFollowingPortfolio ? 'following' : 'unfollow'
    }

    const buttonStyle = isFollowingPortfolio
      ? {
          btnBgColor: '#165BE0',
          btnBorderColor: '#165BE0',
          btnHoverColor: '#B93B2B',
        }
      : {
          btnBgColor: '#B93B2B',
          btnBorderColor: '#B93B2B',
          btnHoverColor: '#165BE0',
        }

    // if 0 portfolio disable button follow unfollow
    return (
      <GridMainContainer
        container
        justify="space-between"
        alignItems="center"
        style={{ height: '70px' }}
      >
        <Grid item xs={2} justify="center">
          <TypographyHeader>{folioData.name}</TypographyHeader>
          {isFollowingTab ? (
            <TypographyHeader>portfolio</TypographyHeader>
          ) : null}
        </Grid>

        <Grid item xs={7}>
          <Grid container justify="center" alignItems="center">
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              xs={3}
            >
              <TypographyTitle
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {folioData.isPrivate
                  ? getOwner(folioData.ownerId)
                  : `Public portfolio`}
              </TypographyTitle>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              item
              xs={4}
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
              xs={3}
            >
              <TypographyTitle>8500 Subscribers</TypographyTitle>
            </GridCell>
            <GridCell
              item
              border={`1px solid ${theme.palette.divider}`}
              widthCell={'100%'}
              item
              xs={1}
            >
              <TypographyTariff textColor={'#2F7619'}>Free</TypographyTariff>
            </GridCell>
          </Grid>
        </Grid>

        <Grid container xs={3} alignItems="flex-end" justify="flex-end">
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
              btnTextColor={'#fff'}
              btnHoverTextColor={'white'}
              btnRadius={'10px'}
              btnFontSize={'0.75rem'}
              disabled={!id}
              onClick={this.handleToggleFollowBtn}
              onMouseEnter={this.onMouseEnterFollow}
              onMouseLeave={this.onMouseLeaveFollow}
              {...buttonStyle}
            >
              {textToShow}
            </ButtonCustom>
          ) : (
            <ButtonCustom
              btnMargin={'auto 2px'}
              btnWidth={'100px'}
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
              isStatsOpen={isStatsOpen}
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
