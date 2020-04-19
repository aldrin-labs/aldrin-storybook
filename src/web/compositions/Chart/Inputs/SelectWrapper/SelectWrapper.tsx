import React from 'react'
import { Grid, Input } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'

import favoriteSelected from '@icons/favoriteSelected.svg'
import { TableWithSort, SvgIcon } from '@sb/components'

import {
  IProps,
  IState,
  IPropsSelectPairListComponent,
  IStateSelectPairListComponent,
  SelectTabType,
} from './SelectWrapper.types'

import {
  selectWrapperColumnNames,
  combineSelectWrapperData,
} from './SelectWrapper.utils'

@withTheme()
class SelectWrapper extends React.PureComponent<IProps, IState> {
  state: IState = {
    searchValue: '',
    tab: 'all',
    tabSpecificCoin: '',
  }

  onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: e.target.value })
  }

  onTabChange = (tab: SelectTabType) => {
    this.setState({ tab })
  }

  render() {
    const { searchValue, tab, tabSpecificCoin } = this.state

    return (
      <SelectPairListComponent
        searchValue={searchValue}
        tab={tab}
        tabSpecificCoin={tabSpecificCoin}
        onChangeSearch={this.onChangeSearch}
        onTabChange={this.onTabChange}
        {...this.props}
      />
    )
  }
}

class SelectPairListComponent extends React.PureComponent<
  IPropsSelectPairListComponent,
  IStateSelectPairListComponent
> {
  state: IStateSelectPairListComponent = {
    processedSelectData: [],
  }

  componentDidMount() {
    const {
      data,
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      stableCoinsPairsMap,
      btcCoinsPairsMap,
      altCoinsPairsMap,
      favoritePairsMap,
    } = this.props

    console.log('componentDidMount searchValue', searchValue)

    const processedSelectData = combineSelectWrapperData({
      data,
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      stableCoinsPairsMap,
      btcCoinsPairsMap,
      altCoinsPairsMap,
      favoritePairsMap,
    })

    this.setState({
      processedSelectData,
    })
  }

  componentWillReceiveProps(nextProps: IPropsSelectPairListComponent) {
    const {
      data,
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      stableCoinsPairsMap,
      btcCoinsPairsMap,
      altCoinsPairsMap,
      favoritePairsMap,
    } = nextProps
    const { data: prevPropsData } = this.props

    console.log('componentWillReceiveProps searchValue', searchValue)

    const processedSelectData = combineSelectWrapperData({
      data,
      updateFavoritePairsMutation,
      previousData: prevPropsData,
      onSelectPair,
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      stableCoinsPairsMap,
      btcCoinsPairsMap,
      altCoinsPairsMap,
      favoritePairsMap,
    })

    this.setState({
      processedSelectData,
    })
  }

  render() {
    const { processedSelectData } = this.state
    const {
      searchValue,
      tab,
      tabSpecificCoin,
      onChangeSearch,
      onTabChange,
      marketType,
      closeMenu,
    } = this.props

    return (
      <Grid
        style={{
          left: 0,
          position: 'absolute',
          zIndex: 999,
          background: '#fff',
          minWidth: '35%',
          height: '300px',
          marginTop: '3rem',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
        // onMouseLeave={closeMenu}
      >
        <Grid container style={{ padding: '0.5rem' }}>
          <Grid
            style={{
              padding: '1rem',
              background: tab === 'favorite' ? '#F2F4F6' : '',
              cursor: 'pointer',
            }}
            onClick={() => onTabChange('favorite')}
          >
            <SvgIcon src={favoriteSelected} width="2rem" height="auto" />
          </Grid>
          <Grid
            style={{
              padding: '1rem',
              background: tab === 'all' ? '#F2F4F6' : '',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => onTabChange('all')}
          >
            ALL
          </Grid>
          {marketType === 0 && (
            <>
              <Grid
                style={{
                  padding: '1rem',
                  background: tab === 'btc' ? '#F2F4F6' : '',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => onTabChange('btc')}
              >
                BTC
              </Grid>
              <Grid
                style={{
                  display: 'flex',
                  padding: '1rem',
                  background: tab === 'alts' ? '#F2F4F6' : '',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => onTabChange('alts')}
              >
                <Grid style={{ paddingRight: '1rem' }}>Alts</Grid>
                <Grid>Select</Grid>
              </Grid>
              <Grid
                style={{
                  display: 'flex',
                  padding: '1rem',
                  background: tab === 'fiat' ? '#F2F4F6' : '',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => onTabChange('fiat')}
              >
                <Grid style={{ paddingRight: '1rem' }}>Fiat</Grid>
                <Grid>Select</Grid>
              </Grid>
            </>
          )}
        </Grid>
        <Grid container style={{ padding: '1rem 0' }}>
          <Input
            placeholder="Search..."
            disableUnderline={true}
            style={{ width: '100%', background: '#F2F4F6' }}
            value={searchValue}
            onChange={onChangeSearch}
            inputProps={{
              style: {
                paddingLeft: '1rem',
              },
            }}
          />
        </Grid>
        <Grid style={{ overflow: 'scroll', height: '75%' }}>
          <TableWithSort
            rowWithHoverBorderRadius={false}
            emptyTableText={`No pairs for such criteria`}
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
