import * as React from 'react'

import { Typography, Link, Grid } from '@material-ui/core'

import Layout from './Layout'

import {
  OptionButton,
} from './styles'

export class Page extends React.Component {
  state = {
    selected: 0,
  }

  select = (option) => {
    console.log('aaa')
    this.setState({selected: option})
  }
  render() {
    const {
      step,
      changeStep,
      changePage,
    } = this.props

    const { selected } = this.state

    console.log('selected', selected)

    return(
      <Layout
        step={step}
        question="How would you classify your expirence as a trader?"
        changeStep={changeStep}
        changePage={changePage}
      >
        <Grid>
          <Grid item>
            <OptionButton onCLick={() => this.select(1)} selected={selected === 1}>
              Beginner
            </OptionButton>
          </Grid>
          <Grid item>
            <OptionButton onCLick={() => this.select(2)} selected={selected === 2}>
              Intermediate
            </OptionButton>
          </Grid>
          <Grid item>
            <OptionButton onCLick={() => this.select(3)} selected={selected === 3}>
              Advanced
            </OptionButton>
          </Grid>
        </Grid>
      </Layout>
    )
  }
}

export default Page
