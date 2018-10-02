import * as React from 'react'
import { History } from 'history'
import styled from 'styled-components'
import Btn from '@material-ui/core/Button'

import { customAquaScrollBar } from '@styles/cssUtils'
import Button from '@components/Elements/Button/Button'
import QueryRenderer from '@components/QueryRenderer'
import { CoinMarketCapQueryQuery } from '@containers/CoinMarketCap/annotations'
import { HomeQuery } from '@components/CoinMarketTable/api'

const kindBtns = ['All coins', 'Coins', 'Tokens']

const headers = [
  '№',
  'Name',
  'Symbol',
  'Price',
  'Change (24h)',
  'Market Cap',
  'Available Supply ',
]

export interface Props {
  data: CoinMarketCapQueryQuery
  location: Location
  history: History
  fetchMore: Function

  showFilterBns?: boolean
  onChangeSortArg?: Function
  redirectToProfile?: Function
}

export interface State {
  activeKind: number
}

class CoinMarketTable extends React.Component<Props, State> {
  state: State = {
    activeKind: 0,
  }

  fetchMore = () => {
    const { history, location, fetchMore } = this.props
    let page
    const query = new URLSearchParams(location.search)
    if (query.has('page')) {
      page = query.get('page')
    } else {
      query.append('page', '1')
      page = query.get('page')
    }
    page = (Number(page) || 1) + 1
    history.push({ search: `?page=${page}` })
    fetchMore({
      query: HomeQuery,
      variables: { page, perPage: 40 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return Object.assign({}, prev, {
          assetPagination: [
            ...prev.assetPagination,
            ...fetchMoreResult.assetPagination,
          ],
        })
      },
    })
  }

  onChangeKind = (index: number) => {
    this.setState({ activeKind: index })
  }

  formatNumber = (num: number) =>
    String(num).replace(/(\d)(?=(\d{3})+$)/g, '$1 ')

  onChangeSortArg = (index: number, header: string) => {
    const { onChangeSortArg } = this.props
    if (onChangeSortArg) onChangeSortArg(index, header)
  }

  redirectToProfile = (id: string) => {
    const { redirectToProfile } = this.props
    if (redirectToProfile) redirectToProfile(id)
  }

  render() {
    const { data, showFilterBns } = this.props
    const { assetPagination } = data

    return (
      <MarketWrapper>
        <Title>Cryptocurrency Market Capitalizations</Title>
        {showFilterBns && (
          <BtnsContainer>
            {kindBtns.map((kindBtn, i) => (
              <Button
                onClick={() => this.onChangeKind(i)}
                // active={i === activeKind}
                key={kindBtn}
                title={kindBtn}
                mRight
              />
            ))}
          </BtnsContainer>
        )}

        <Table style={{ marginBottom: 0 }}>
          <THead>
            <tr>
              {headers.map((header, i) => (
                <TH
                  key={header}
                  onClick={() => this.onChangeSortArg(i, header)}
                  // style={i === activeSortArg ? {} : { fontWeight: 500 }}
                >
                  {header}
                  {/*i === activeSortArg &&
                    i !== 0 && <WebIcon src={arrowIcon.replace(/"/gi, '')} />*/}
                </TH>
              ))}
            </tr>
          </THead>
        </Table>

        <ScrolledWrapper>
          <Table>
            <TBody>
              {assetPagination &&
                assetPagination.items &&
                assetPagination.items.map((item, i) => {
                  if (!item) return null
                  const {
                    _id,
                    icoPrice,
                    name,
                    symbol,
                    priceUSD,
                    percentChangeDay,
                    maxSupply,
                    availableSupply,
                  } = item

                  const img = (
                    <img
                      src={icoPrice}
                      key={_id}
                      style={{
                        paddingRight: '4px',
                        verticalAlign: 'bottom',
                        maxWidth: '20px',
                        maxHeight: '16px',
                        objectFit: 'contain',
                      }}
                    />
                  )

                  const color =
                    Number(percentChangeDay) >= 0 ? '#65c000' : '#ff687a'

                  return (
                    <TR key={_id} onClick={() => this.redirectToProfile(_id)}>
                      <TD>{`${i + 1}.`}</TD>
                      <TD>{[img, name]}</TD>
                      <TD>{symbol}</TD>
                      <TD>
                        {priceUSD ? `$ ${Number(priceUSD).toFixed(2)}` : '-'}
                      </TD>
                      <TD /*style={{ color }}*/>
                        {/*`${percentChangeDay}` || '-'*/}-
                      </TD>
                      <TD>
                        {maxSupply ? `$ ${this.formatNumber(maxSupply)}` : '-'}
                      </TD>
                      <TD>
                        {availableSupply
                          ? `${this.formatNumber(availableSupply)}`
                          : '-'}
                      </TD>
                    </TR>
                  )
                })}
            </TBody>
          </Table>
        </ScrolledWrapper>
        <MaterialBtn
          variant="flat"
          color="primary"
          disabled={!data.assetPagination.pageInfo.hasNextPage}
          onClick={this.fetchMore}
        >
          Show more
        </MaterialBtn>
      </MarketWrapper>
    )
  }
}

const ScrolledWrapper = styled.div`
  overflow-y: scroll;
  background-color: #393e44;
  margin-bottom: 50px;

  ${customAquaScrollBar};
`

const MaterialBtn = styled(Btn)`
  width: 20%;
`

const TBody = styled.tbody`
  width: 100%;
`

const TH = styled.th`
  font-family: Roboto, sans-serif;
  font-size: 14px;
  text-align: left;
  color: #fff;
  padding: 6px 0;
  cursor: pointer;
`

const THead = styled.thead`
  width: 100%;
  border-bottom: 1px solid #fff;
`

const Table = styled.table`
  display: table;
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
  margin-bottom: 36px;
  table-layout: fixed;
`

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
`

const MarketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
`

const Title = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
`

const TD = styled.td`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  text-align: left;
  color: #fff;
`

const TR = styled.tr`
  width: 100%;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  height: 2.4em;
  cursor: pointer;

  &:hover ${TD} {
    color: #4ed8da;
  }
`

export default function({
  location,
  history,
}: {
  location: Location
  history: History
}) {
  let page
  if (!location) {
    page = 1
  } else {
    const query = new URLSearchParams(location.search)
    if (query.has('page')) {
      page = query.get('page')
    } else {
      query.append('page', '1')
      page = query.get('page')
    }
  }

  const variables = { perPage: 40, page }

  return (
    <QueryRenderer
      component={CoinMarketTable}
      query={HomeQuery}
      variables={variables}
      location={location}
      history={history}
    />
  )
}
