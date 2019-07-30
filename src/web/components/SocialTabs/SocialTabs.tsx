import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Typography, Input, Grid, Paper } from '@material-ui/core'

// import {
//   PortfolioName,
//   TypographyTitle,
//   TypographyPercentage,
//   FolioValuesCell,
// } from './SocialTabs.styles'

// import { compose } from 'recompose'
// import { queryRendererHoc } from '@core/components/QueryRenderer'
// import { GET_FOLLOWING_PORTFOLIOS } from '@core/graphql/queries/portfolio/getFollowingPortfolios'

// const getOwner = (str: string) => {
//   if (!str) {
//     return 'public'
//   }

//   const b = str.match(/(?<=\').*(?=')/gm)

//   return (b && b[0]) || 'public'
// }

// const PortfolioListItem = ({ el, onClick, isSelected }) => (
//   <Paper
//     style={{ padding: '10px', marginBottom: '20px' }}
//     elevation={isSelected ? 10 : 2}
//   >
//     <Grid container onClick={onClick} style={{ height: '120px' }}>
//       <Grid container alignItems="center" justify="space-between">
//         <PortfolioName textColor={'#16253D'} style={{ padding: '0' }}>
//           {el.name}
//           <TypographyTitle style={{ padding: '0', margin: '0' }}>
//             {el.isPrivate ? getOwner(el.ownerId) : `Public portfolio`}
//           </TypographyTitle>
//         </PortfolioName>
//       </Grid>
//       <Grid container alignItems="center" justify="space-between">
//         <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
//           <TypographyTitle>Assets</TypographyTitle>
//           <TypographyTitle>{el.portfolioAssets.length}</TypographyTitle>
//         </FolioValuesCell>
//         <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
//           <TypographyTitle>Month perform</TypographyTitle>
//           <TypographyTitle fontSize={'0.75rem'} textColor={'#97C15C'}>
//             {el.portfolioAssets.length}
//           </TypographyTitle>
//         </FolioValuesCell>
//         <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
//           <TypographyTitle>Exchanges</TypographyTitle>
//           <TypographyTitle>{el.portfolioAssets.length}</TypographyTitle>
//         </FolioValuesCell>
//       </Grid>
//     </Grid>
//   </Paper>
// )

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} >
      {children}
    </Typography>
  )
}

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 100,
  },
})

class SocialTabs extends React.Component {
  state = {
    value: 0,
    selectedPortfolio: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleChangeIndex = (index) => {
    this.setState({ value: index })
  }

  render() {
    const {
      classes,
      theme,
      children,
      //getFollowingPortfoliosQuery: { getFollowingPortfolios },
    } = this.props

    // const { selectedPortfolio = 0 } = this.state

    // //console.log('FOLIO LIST: ', getFollowingPortfolios)
    // const filteredList = getFollowingPortfolios //.filter(item => item ===;

    // const sharedPortfoliosList = filteredList.map((el, index) => (
    //   <PortfolioListItem
    //     key={index}
    //     isSelected={index === selectedPortfolio}
    //     el={el}
    //     onClick={() => {
    //       this.setState({ selectedPortfolio: index })
    //     }}
    //   />
    // ))

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Item One" style={{ color: 'black' }} />
            <Tab label="Item Two" style={{ color: 'black' }} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            {/* <Input fullWidth={true} /> */}
            {/* {sharedPortfoliosList} */}

            {children}
          </TabContainer>
          <TabContainer dir={theme.direction}>Item Two</TabContainer>
        </SwipeableViews>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SocialTabs)

// export default compose(
//   queryRendererHoc({
//     query: GET_FOLLOWING_PORTFOLIOS,
//     withOutSpinner: false,
//     withTableLoader: false,
//     name: 'getFollowingPortfoliosQuery',
//   })
// )(withStyles(styles, { withTheme: true })(SocialTabs))
