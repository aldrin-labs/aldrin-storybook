import React from 'react'
import { Grid, Input, InputAdornment } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import stableCoins from '@core/config/stableCoins'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'
import favoriteSelected from '@icons/favoriteSelected.svg'
import search from '@icons/search.svg'

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
    // this.setState({ tab, tabSpecificCoin: '' })
    this.setState((prevState) => ({
      tab,
      tabSpecificCoin: prevState.tab !== tab ? '' : prevState.tabSpecificCoin,
    }))
  }

  onSpecificCoinChange = ({ value }: { value: string }) => {
    this.setState({ tabSpecificCoin: value })
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
        onSpecificCoinChange={this.onSpecificCoinChange}
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
      onSpecificCoinChange,
    } = this.props

    return (
      <Grid
        style={{
          left: 0,
          position: 'absolute',
          zIndex: 999,
          background: '#fff',
          minWidth: '35%',
          height: '350px',
          marginTop: '3rem',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px solid #E0E5EC',
          boxShadow: '0px 8px 12px rgba(8, 22, 58, 0.3)',
        }}
        // TODO: uncomment this line
        onMouseLeave={closeMenu}
      >
        <Grid container style={{ padding: '0.5rem' }}>
          <Grid
            style={{
              display: 'flex',
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
              fontSize: '1.2rem',
              color: '#7284A0',
              fontWeight: 'bold',
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
                  fontSize: '1.2rem',
                  color: '#7284A0',
                  fontWeight: 'bold',
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
                  fontSize: '1.2rem',
                  color: '#7284A0',
                  fontWeight: 'bold',
                }}
                onClick={() => onTabChange('alts')}
              >
                <Grid style={{ paddingRight: '1rem' }}>ALTS</Grid>
                <Grid style={{ width: '60px' }}>
                  <ReactSelectComponent
                    isSearchable={false}
                    valueContainerStyles={{ padding: 0 }}
                    placeholder="ALL"
                    onChange={onSpecificCoinChange}
                    options={[
                      { value: 'ETH', label: 'ETH' },
                      { value: 'TRX', label: 'TRX' },
                      { value: 'XRP', label: 'XRP' },
                      { label: 'ALL', value: 'ALL' },
                    ]}
                    value={
                      tabSpecificCoin === ''
                        ? { label: 'ALL', value: 'ALL' }
                        : tabSpecificCoin === 'ALL'
                        ? { label: 'ALL', value: 'ALL' }
                        : !['ETH', 'TRX', 'XRP'].includes(tabSpecificCoin)
                        ? { label: 'ALL', value: 'ALL' }
                        : undefined
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                style={{
                  display: 'flex',
                  padding: '1rem',
                  background: tab === 'fiat' ? '#F2F4F6' : '',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#7284A0',
                  fontWeight: 'bold',
                }}
                onClick={() => onTabChange('fiat')}
              >
                <Grid style={{ paddingRight: '1rem' }}>FIAT</Grid>
                <Grid style={{ width: '60px' }}>
                  <ReactSelectComponent
                    isSearchable={false}
                    valueContainerStyles={{ padding: 0 }}
                    placeholder="ALL"
                    onChange={onSpecificCoinChange}
                    options={[
                      ...stableCoins.map((el) => ({
                        value: el,
                        label: el,
                      })),
                      { label: 'ALL', value: 'ALL' },
                    ]}
                    value={
                      tabSpecificCoin === ''
                        ? { label: 'ALL', value: 'ALL' }
                        : tabSpecificCoin === 'ALL'
                        ? { label: 'ALL', value: 'ALL' }
                        : !stableCoins.includes(tabSpecificCoin)
                        ? { label: 'ALL', value: 'ALL' }
                        : undefined
                    }
                  />
                </Grid>
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
            endAdornment={
              <InputAdornment
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                disableTypography={true}
                position="end"
                autoComplete="off"
              >
                <SvgIcon src={search} width="1.5rem" height="auto" />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid style={{ overflow: 'hidden', height: 'calc(69% - 2rem)' }}>
          <AutoSizer>
            {({ width, height }: { width: number; height: number }) => (
              <Table
                width={width}
                height={height}
                rowCount={processedSelectData.length}
                onRowClick={({ event, index, rowData }) => {
                  rowData.symbol.onClick()
                }}
                gridStyle={{
                  outline: 'none',
                }}
                rowStyle={{
                  outline: 'none',
                  cursor: 'pointer',
                  color: '#7284A0',
                  borderBottom: '1px solid #E0E5EC',
                }}
                headerHeight={window.outerHeight / 40}
                headerStyle={{
                  color: '#16253D',
                  paddingLeft: '.5rem',
                  paddingTop: '.25rem',
                  marginLeft: 0,
                  marginRight: 0,
                  letterSpacing: '.075rem',
                  // borderBottom: '.1rem solid #e0e5ec',
                  fontSize: '1.2rem',
                }}
                rowHeight={40}
                rowGetter={({ index }) => processedSelectData[index]}
              >
                <Column
                  label=""
                  dataKey="favorite"
                  headerStyle={{
                    paddingLeft: 'calc(.5rem + 10px)',
                  }}
                  width={width / 5}
                  cellRenderer={({ cellData }) => (
                    <span onClick={(e) => e.stopPropagation()}>
                      {cellData.render}
                    </span>
                  )}
                />
                <Column
                  label={`Pair`}
                  dataKey="symbol"
                  headerStyle={{
                    textAlign: 'left',
                    paddingRight: '6px',
                    paddingLeft: '1rem',
                  }}
                  width={width}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                <Column
                  label={`price`}
                  dataKey="price"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
                    textAlign: 'left',
                  }}
                  width={width}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                <Column
                  label={`24H CHANGE`}
                  dataKey="price24hChange"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
                    textAlign: 'right',
                  }}
                  width={width}
                  style={{
                    textAlign: 'right',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                <Column
                  label={`24H VOLUME`}
                  dataKey="volume24hChange"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
                    textAlign: 'right',
                  }}
                  width={width}
                  style={{
                    textAlign: 'right',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
              </Table>
            )}
          </AutoSizer>
          {/* <TableWithSort
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
          /> */}
        </Grid>
        <Grid
          style={{
            display: 'flex',
            padding: '1rem',
            background: tab === 'fiat' ? '#F2F4F6' : '',
            alignItems: 'center',
            justifyContent: 'flex-end',
            cursor: 'pointer',
            fontSize: '1.4rem',
            color: '#7284A0',
            // fontWeight: 'bold',
            height: '3rem',
          }}
          onClick={() => onTabChange('fiat')}
        >
          Binance liquidity data
        </Grid>
      </Grid>
    )
  }
}

export default SelectWrapper
