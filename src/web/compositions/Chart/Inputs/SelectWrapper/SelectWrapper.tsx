import React from 'react'
import {
  Grid,
  Typography,
  Button,
  Link,
  Input,
  Table,
  Theme,
} from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'

import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { client } from '@core/graphql/apolloClient'
import { TableWithSort, SvgIcon } from '@sb/components'
import favoriteSelected from '@icons/favoriteSelected.svg'
import favoriteUnselected from '@icons/favoriteUnselected.svg'

export const selectWrapperColumnNames = [
  { label: '', id: 'favorite', isSortable: false },
  { label: 'Pair', id: 'pair' },
  { label: 'Last price', id: 'lastPrice' },
  { label: '24H change', id: '24hChange' },
  { label: '24H volume', id: '24hVolume' },
]

export type GetSelectorSettingsType = {
  getAccountSettings: {
    selectorSettings: {
      favoritePairs: string[]
    }
  }
}

export type ISelectData = {
  pair: string
  price: number
  price24hChange: number
  volume24hChange: number
}[]

export type UpdateFavoritePairsMutationType = (variableObj: {
  variables: {
    input: {
      favoritePairs: string[]
    }
  }
}) => Promise<void>

export const getUpdatedFavoritePairsList = (
  clonedData: GetSelectorSettingsType,
  pair: string
) => {
  const {
    getAccountSettings: {
      selectorSettings: { favoritePairs },
    },
  } = clonedData

  let updatedList
  const isAlreadyInTheList = favoritePairs.find((el) => el === pair)
  if (isAlreadyInTheList) {
    updatedList = favoritePairs.filter((el) => el !== pair)
  } else {
    updatedList = [...favoritePairs, pair]
  }

  return updatedList
}

export const updateFavoritePairsCache = (
  clonedData: GetSelectorSettingsType,
  updatedFavoritePairsList: string[]
) => {
  client.writeQuery({
    query: getSelectorSettings,
    data: {
      getAccountSettings: {
        selectorSettings: {
          favoritePairs: updatedFavoritePairsList,
        },
      },
    },
  })
}

export const updateFavoritePairsHandler = async (
  updateFavoritePairs: UpdateFavoritePairsMutationType,
  pair: string
) => {
  const favoritePairsData = client.readQuery(getSelectorSettings)
  const clonedData = JSON.parse(JSON.stringify(favoritePairsData))

  const updatedFavoritePairsList = getUpdatedFavoritePairsList(clonedData, pair)

  updateFavoritePairsCache(clonedData, updatedFavoritePairsList)

  try {
    await updateFavoritePairs({
      variables: { input: { favoritePairs: updatedFavoritePairsList } },
    })
  } catch (e) {
    console.log('update favorite pairs failed')
  }
}

export const combineSelectWrapperData = ({
  data,
  favoritePairsMap,
  updateFavoritePairsMutation,
  previousData,
  onSelectPair,
  theme,
}: {
  data: ISelectData
  favoritePairsMap: Map<string, string>
  updateFavoritePairsMutation: (variableObj: {
    variables: {
      input: {
        favoritePairs: string[]
      }
    }
  }) => Promise<void>
  previousData?: ISelectData
  onSelectPair: () => void
  theme: Theme
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const processedData = data.map((el) => {
    const {
      pair = '',
      price = 0,
      price24hChange = 0,
      volume24hChange = 0,
    } = el || {
      pair: '',
      price: 0,
      price24hChange: 0,
      volume24hChange: 0,
    }

    const isInFavoriteAlready = favoritePairsMap.has(pair)

    const priceColor = !!previousData ? '' : '' 

    return {
      id: `${pair}`,
      favorite: {
        render: (
          <SvgIcon
            onClick={() =>
              updateFavoritePairsHandler(updateFavoritePairsMutation, pair)
            }
            src={isInFavoriteAlready ? favoriteSelected : favoriteUnselected}
            width="1rem"
            height="auto"
          />
        ),
      },
      pair: {
        render: pair,
        onClick: onSelectPair,
      },
      price: {
        render: price,
        onClick: onSelectPair,
        style: { color: priceColor },
      },
      price24hChange: {
        render: price24hChange,
        onClick: onSelectPair,
      },
      volume24hChange: {
        render: volume24hChange,
        onClick: onSelectPair,
      },
    }
  })

  return processedData
}

export interface IState {
  processedSelectData: {
    id: string
    favorite: any
    pair: any
    price24hChange: any
    volume24hChange: any
  }[]
}

export interface IProps {
  data: ISelectData
  favoritePairsMap: Map<string, string>
  updateFavoritePairsMutation: UpdateFavoritePairsMutationType
  onSelectPair: () => void
  theme: Theme
}

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
      <Grid>
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
