import React, { Component } from 'react'

import { withTheme, withStyles } from '@material-ui/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import { components } from 'react-select'

import { Loading } from '@sb/components/index'

import LayoutError from '@sb/components/LayoutError'

import { SaveLayoutDialog } from '@sb/components/SaveLayoutDialog'
import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'

import {
  SelectR,
  SelectContainer,
  OptionContainer,
} from './styles'

const ActionButton = withStyles(() => ({
  root: { padding: 6 },
}))(IconButton)

class LayoutSelectorComponent extends Component {

  state = {
    layoutSaving: false,
    errorOpen: false,
  }

  handleErrorOpen = () => {
    this.setState({ errorOpen: true })
  }

  handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ errorOpen: false })
  }

  saveLayoutWithCharts = async (name: string) => {
    const {
      saveLayout,
      charts,
      userId,
      themeMode,
      chartApiUrl,
    } = this.props
    saveLayout(name)
    if (charts.length > 0) {
      let i = 0
      const savingOnCallback = (event) => {
        i = i + 1
        if (event.data) {
          const resp = JSON.parse(event.data)
          if (resp.status !== 'ok') {
            this.handleErrorOpen()
            i = charts.length
          }
        }
        if (i === charts.length) {
          window.removeEventListener('message', savingOnCallback)
          this.setState({layoutSaving: false})
          return null
        }

        const chart = charts[i]
        const [base, quote] = chart.split('_')
        const frame = document.getElementById(`name${i}`)
          ? document.getElementById(`name${i}`).contentWindow
          : null
        if (frame) {
          setTimeout(async () => 
            frame.postMessage(JSON.stringify({
              action: 'save',
              name: `${name}index${i}`,
            }),
              `https://${chartApiUrl}/?symbol=${base}/${quote}&user_id=${userId}&theme=${themeMode}`
            ), 100)}
        }

      window.addEventListener('message', savingOnCallback)
      this.setState({layoutSaving: true})

      const chart = charts[0]
      const [base, quote] = chart.split('_')
      const frame = document.getElementById(`name0`)
        ? document.getElementById(`name0`).contentWindow
        : null
      if (frame) {
        frame.postMessage(JSON.stringify({
          action: 'save',
          name: `${name}index${i}`,
        }),
          `https://${chartApiUrl}/?symbol=${base}/${quote}&user_id=${userId}&theme=${themeMode}`
        )
      }
    }
  }


  loadLayoutWithCharts = (name: string) => {
    const {
      layouts,
      userId,
      themeMode,
      loadLayout,
      chartApiUrl,
    } = this.props
    loadLayout(name)
    const chartsInLayout = layouts ? layouts.find((layout => layout.name === name)).charts: []

    setTimeout(() => {
      chartsInLayout.forEach((chart, index) => {
      const [base, quote] = chart.split('_')
      const frame = document.getElementById(`name${index}`)
        ? document.getElementById(`name${index}`).contentWindow
        : null
      if (frame) {
        frame.postMessage(JSON.stringify({
          action: 'load',
          name: `${name}index${index}`,
        }),
          `https://${chartApiUrl}/?symbol=${base}/${quote}&user_id=${userId}&theme=${themeMode}`
        )
      }
    })}, 1000)
  }

  handleChange = ({ value }: {value: string}) => {
    if (!value) {
      return
    }
    this.loadLayoutWithCharts(value)
  }

  render() {
    const {
      layouts,
      saveLayout,
      theme: {
        palette: { divider },
      },
      setTopMarkets,
      setTopCoinInPortfolio,
      removeLayout,
      charts,
      userId,
      themeMode,
      loadLayout,
      chartApiUrl,
    } = this.props

    const { errorOpen } = this.state

    let suggestions = []

    if (layouts) {
      suggestions = layouts
        .map((suggestion: any) => ({
          value: suggestion.name,
          label: suggestion.name,
        }))
    }


    const Option = (optionProps: any) => (
      <OptionContainer>
        <components.Option {...optionProps} />
        <ActionButton aria-label="Delete" onClick={() => { removeLayout(optionProps.value); } }>
          <DeleteIcon fontSize="small" />
        </ActionButton>
      </OptionContainer>
    )
    return (
      <>
        {this.state.layoutSaving && <Loading centerAligned={true} />}
        <TransparentExtendedFAB
          onClick={setTopMarkets}
        >
          Top Marketcap Charts
        </TransparentExtendedFAB>
        <TransparentExtendedFAB
          onClick={setTopCoinInPortfolio}
        >
          Top Portfolio Charts
        </TransparentExtendedFAB>
        <SaveLayoutDialog
          saveLayout={this.saveLayoutWithCharts}
        />
        <SelectContainer
          border={divider}
        >
          <SelectR
            components={{ Option }}
            value=""
            placeholder="Select layout"
            fullWidth={true}
            options={suggestions}
            onChange={this.handleChange}
          />
        </SelectContainer>
        <LayoutError
          open={errorOpen}
          handleErrorOpen={this.handleErrorOpen}
          handleClose={this.handleErrorClose}
        />
      </>
    )
  }
}

export default withTheme(LayoutSelectorComponent)
