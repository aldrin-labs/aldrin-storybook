import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Typography } from '@material-ui/core'
import {
  TabCustom,
  StyledTab,
  StyledTabs,
  StyledMyTab,
  StyledFollowingTab,
} from './SocialTabs.styles'

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir}>
      {children}
    </Typography>
  )
}

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderLeft: '1px solid #E0E5EC',
    borderRight: '1px solid #E0E5EC',
    borderBottom: '1px solid #E0E5EC',
    borderRadius: '22px 22px 22px 22px',
    margin: 'auto',
    width: '100%',
  },
})

class SocialTabs extends React.Component {
  state = {
    value: 0,
    selectedPortfolio: 0,
    //isTabSelected: true,
  }

  handleChange = (event, value) => {
    this.setState({ value })
    //, isTabSelected: !this.state.isTabSelected
  }

  handleChangeIndex = (index) => {
    this.setState({ value: index })
  }

  render() {
    const { classes, theme, children } = this.props

    return (
      <div className={classes.root}>
        <AppBar
          position="static"
          color="default"
          style={{ background: 'transparent', boxShadow: 'none' }}
        >
          <StyledTabs
            style={{
              background: 'transparent',
              boxShadow: 'none',
              // display: 'flex',
              // justifyContent: 'space-between',
            }}
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <StyledFollowingTab
              label="following"
              style={{
                fontSize: '1.2rem',
                color: '#7284A0',
                background:
                  this.state.value === 0
                    ? 'white'
                    : theme.palette.type === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.grey.main, //'#eef0f3',
                borderTop: '1px solid #E0E5EC',
                borderLeft: '1px solid #E0E5EC',
                borderRight: '1px solid #E0E5EC',
                borderRadius: '22px 0 0 0',
                width: '50%',
              }}
            />
            <StyledMyTab
              label="My"
              style={{
                fontSize: '1.2rem',
                color: '#7284A0',
                background:
                  this.state.value === 1
                    ? 'white'
                    : theme.palette.type === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.grey.main, //'#eef0f3',
                borderTop: '1px solid #E0E5EC',
                borderLeft: '1px solid #E0E5EC',
                borderRight: '1px solid #E0E5EC',
                borderRadius: '0 22px 0 0',
                width: '50%',
              }}
            />
          </StyledTabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer
            style={{
              boxShadow: 'none',
              borderLeft: '1px solid #e0e5ec',
              borderRight: '1px solid #e0e5ec',
              borderBottom: '1px solid #e0e5ec',
            }}
            dir={theme.direction}
          >
            {children}
          </TabContainer>
          <TabContainer
            style={{
              boxShadow: 'none',
              borderLeft: '1px solid #e0e5ec',
              borderRight: '1px solid #e0e5ec',
              borderBottom: '1px solid #e0e5ec',
            }}
            dir={theme.direction}
          >
            {children}
          </TabContainer>
        </SwipeableViews>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SocialTabs)
