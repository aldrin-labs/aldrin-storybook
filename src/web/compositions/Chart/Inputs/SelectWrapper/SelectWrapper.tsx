import React from 'react'
import { Grid, Input } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'

import { TableWithSort } from '@sb/components'

import { IProps, IState } from './SelectWrapper.types'

import {
  selectWrapperColumnNames,
  combineSelectWrapperData,
} from './SelectWrapper.utils'

@withTheme()
class SelectWrapper extends React.PureComponent<IProps, IState> {
  state: IState = {
    processedSelectData: [],
  }

  componentDidMount() {
    const {
      data,
      favoritePairsMap,
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
    } = this.props

    const processedSelectData = combineSelectWrapperData({
      data,
      favoritePairsMap,
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
    })

    this.setState({
      processedSelectData,
    })
  }

  componentWillReceiveProps(nextProps: IProps) {
    const {
      data,
      favoritePairsMap,
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
    } = nextProps
    const { data: prevPropsData } = this.props

    const processedSelectData = combineSelectWrapperData({
      data,
      favoritePairsMap,
      updateFavoritePairsMutation,
      previousData: prevPropsData,
      onSelectPair,
      theme,
    })

    this.setState({
      processedSelectData,
    })
  }

  render() {
    const { processedSelectData } = this.state

    return (
      <Grid style={{ position: 'absolute', zIndex: 999, background: '#fff', }}>
        <Grid>
          <Grid>Favorite</Grid>
          <Grid>BTC</Grid>
          <Grid>
            <Grid>Alts</Grid>
            <Grid>Select</Grid>
          </Grid>
          <Grid>
            <Grid>Fiat</Grid>
            <Grid>Select</Grid>
          </Grid>
        </Grid>
        <Grid>
          <Input />
        </Grid>
        <Grid>
          <TableWithSort
            emptyTableText={`No coins available`}
            data={{ body: processedSelectData }}
            columnNames={selectWrapperColumnNames}
            withCheckboxes={false}
            style={{ borderRadius: 0, height: '100%' }}
            stylesForTable={{ backgroundColor: '#fff' }}
            tableStyles={{
              headRow: {
                borderBottom: '1px solid #e0e5ec',
                boxShadow: 'none',
              },
              heading: {
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#fff',
                color: '#16253D',
                boxShadow: 'none',
              },
              cell: {
                color: '#7284A0',
                fontSize: '1rem', // 1.2 if bold
                fontWeight: 'bold',
                letterSpacing: '1px',
                borderBottom: '1px solid #e0e5ec',
                boxShadow: 'none',
              },
              tab: {
                padding: 0,
                boxShadow: 'none',
              },
            }}
          />
        </Grid>
      </Grid>
    )
  }
}

export default SelectWrapper
