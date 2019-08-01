import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Typography } from '@material-ui/core'
import { TabContainerCustom } from './SocialTabs.styles'

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
  }

  handleChange = (event, value) => {
    this.setState({ value })
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
          <Tabs
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
            <Tab
              label="following"
              style={{
                fontSize: '1.2rem',
                color: 'black',
                borderTop: '1px solid #E0E5EC',
                borderLeft: '1px solid #E0E5EC',
                borderRight: '1px solid #E0E5EC',
                borderRadius: '22px 0 0 0',
                width: '50%',
              }}
            />
            <Tab
              label="My"
              style={{
                fontSize: '1.2rem',
                color: 'black',
                borderTop: '1px solid #E0E5EC',
                borderLeft: '1px solid #E0E5EC',
                borderRight: '1px solid #E0E5EC',
                borderRadius: '0 22px 0 0',
                width: '50%',
              }}
            />
          </Tabs>
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
