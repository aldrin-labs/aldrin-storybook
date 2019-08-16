import React, { Component } from 'react'
import _ from 'lodash'

import { Grid } from '@material-ui/core'
import {
  TypographyHeader,
  TypographyTitle,
  FolioValuesCell,
  FolioCard,
} from '@sb/compositions/Social/SocialPage.styles'

import SvgIcon from '@sb/components/SvgIcon'
import LineGraph from '@icons/LineGraph.svg'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_FOLLOWING_PORTFOLIOS } from '@core/graphql/queries/portfolio/getFollowingPortfolios'

import RebalanceDialogAdd from '@sb/components/RebalanceDialogAdd/RebalanceDialogAdd'

const transformData = (portfolios) =>
  portfolios.map(({ name, portfolioAssets, isPrivate }) => ({
    name,
    fromMarket: !isPrivate,
    perform: 1.46,
    assets: portfolioAssets.length,
    exchanges: _.uniqBy(portfolioAssets, (asset) => asset.where).length,
  }))

const CustomContentList = ({ data }) => (
  <>
    {data.map((portfolio) => (
      <FolioCard container key={portfolio._id}>
        <Grid container justify="space-between">
          <Grid item style={{ maxWidth: '70%' }}>
            <TypographyHeader textColor={'#16253D'}>
              {portfolio.name}
            </TypographyHeader>
            <TypographyTitle fontSize={'0.9rem'} textColor={'#7284A0'}>
              {portfolio.fromMarket ? 'From market' : 'Shared'}
            </TypographyTitle>
          </Grid>
          <SvgIcon
            width="10"
            height="10"
            src={LineGraph}
            styledComponentsAdditionalStyle="
                            @media(min-width: 1400px) {
                                padding: 1rem 0 2rem 0;
                            }
                    
                            @media(min-width: 1921px) {
                                width: 4.5rem;
                            }"
          />
        </Grid>
        <Grid container alignItems="center" justify="space-between">
          <FolioValuesCell item style={{ width: '30%', padding: '0 4rem' }}>
            <div>
              <TypographyTitle>Assets</TypographyTitle>
              <TypographyTitle fontSize={'1rem'} textColor={'#16253D'}>
                {portfolio.assets}
              </TypographyTitle>
            </div>
          </FolioValuesCell>
          <FolioValuesCell item style={{ width: '30%', padding: '0 4rem' }}>
            <div>
              <TypographyTitle>perform</TypographyTitle>
              <TypographyTitle fontSize={'1rem'} textColor={'#2F7619'}>
                + {portfolio.perform * 100}%
              </TypographyTitle>
            </div>
          </FolioValuesCell>
          <FolioValuesCell item style={{ width: '30%', padding: '0 4rem' }}>
            <div>
              <TypographyTitle>Exchanges</TypographyTitle>
              <TypographyTitle fontSize={'1rem'} textColor={'#16253D'}>
                {portfolio.exchanges}
              </TypographyTitle>
            </div>
          </FolioValuesCell>
        </Grid>
      </FolioCard>
    ))}
  </>
)
class RebalanceAddSocialPortfolio extends Component {
  state = {
      search: ''
  }

  render() {
    const {
      getFollowingPortfoliosQuery: { getFollowingPortfolios },
    } = this.props
    const { search } = this.state

    const transformedData = transformData(getFollowingPortfolios).filter(({ name }) => {
        return name.toLowerCase().startsWith(search.toLowerCase())
    })
    return (
      <RebalanceDialogAdd title={'ADD PORTFOLIO'} onSearch={e => {
          this.setState({
            search: e.target.value
          })
      }}>
        <CustomContentList data={transformedData} />
      </RebalanceDialogAdd>
    )
  }
}

export default queryRendererHoc({
  query: GET_FOLLOWING_PORTFOLIOS,
  // fetchPolicy: 'cache-and-network',
  // pollInterval: 30000,
  withOutSpinner: false,
  withTableLoader: false,
  name: 'getFollowingPortfoliosQuery',
})(RebalanceAddSocialPortfolio)
