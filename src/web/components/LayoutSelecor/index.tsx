import React from 'react'

import { withTheme, withStyles } from '@material-ui/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import { components } from 'react-select'

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

const LayoutSelecorComponent = ({...props}) => {

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
  } = props

  let suggestions = []

  if (layouts) {
    suggestions = layouts
      .map((suggestion: any) => ({
        value: suggestion.name,
        label: suggestion.name,
      }))
  }

  const saveLayoutWithCharts = (name: string) => {
    saveLayout(name)
    if (charts.length > 0) {
      let i = 0
      let id = null
      const func = (event) => {
        i = i + 1
        if (i === charts.length) {
          window.removeEventListener('message', func)
          return null
        }

        const chart = charts[i]
        const [base, quote] = chart.split('_')
        const frame = document.getElementById(`name${i}`)
          ? document.getElementById(`name${i}`).contentWindow
          : null
        if (frame) {
          setTimeout(() => {frame.postMessage(JSON.stringify({
            action: 'save',
            name: `${name}index${i}`,
          }),
            `http://${chartApiUrl}/?symbol=${base}/${quote}&user_id=${userId}&theme=${themeMode}`
          )}, 2000)
        }
      }

      window.addEventListener('message', func)

      const chart = charts[0]
      const [base, quote] = chart.split('_')
      const frame = document.getElementById(`name0`)
        ? document.getElementById(`name0`).contentWindow
        : null
      if (frame) {
        frame.postMessage(JSON.stringify({
          action: 'save',
          name: `${name}index0`,
        }),
          `http://${chartApiUrl}/?symbol=${base}/${quote}&user_id=${userId}&theme=${themeMode}`
        )
      }
    }
  }

  const loadLayoutWithCharts = (name: string) => {
    loadLayout(name)
    const chartsInLayout = layouts ? layouts.find((layout => layout.name === name)).charts: []
    setTimeout(() => {
      console.log('loadEvent')
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
          `http://${chartApiUrl}/?symbol=${base}/${quote}&user_id=${userId}&theme=${themeMode}`
        )
      }
    })}, 1000)
  }

  const handleChange = ({ value }: {value: string}) => {
    if (!value) {
      return
    }
    loadLayoutWithCharts(value)
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
        saveLayout={saveLayoutWithCharts}
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
          onChange={handleChange}
        />
      </SelectContainer>
    </>
  )
}

export default withTheme()(LayoutSelecorComponent)
