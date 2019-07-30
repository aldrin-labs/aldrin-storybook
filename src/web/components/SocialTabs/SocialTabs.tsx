import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Typography, Input, Grid, Paper } from '@material-ui/core'

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
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            style={{ background: 'transparent', boxShadow: 'none' }}
          >
            <Tab
              label="following"
              style={{
                fontSize: '1.2rem',
                color: 'black',
                borderTop: '1px solid #E0E5EC',
                borderLeft: '1px solid #E0E5EC',
                borderRight: '1px solid #E0E5EC',
                borderRadius: '22px 22px 0 0',
                width: '60px',
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
                borderRadius: '22px 22px 0 0',
                width: '60px',
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
            dir={theme.direction}
            style={{
              background: 'black',
              boxShadow: 'none',
              borderLeft: '1px solid #E0E5EC',
              borderRight: '1px solid #E0E5EC',
              borderBottom: '1px solid #E0E5EC',
              overflow: 'scroll'
            }}
          >
            {children}
          </TabContainer>
          <TabContainer dir={theme.direction}>Item Two</TabContainer>
        </SwipeableViews>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SocialTabs)
