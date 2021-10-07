import React from 'react'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { TokenIcon } from '@sb/components/TokenIcon'

import AnalyticsIcon from '@icons/analytics.svg'
import BlueTwitterIcon from '@icons/blueTwitter.svg'
import favouriteSelected from '@icons/favouriteSelected.svg'
import favouriteUnselected from '@icons/favouriteUnselected.svg'
import Coinmarketcap from '@icons/coinmarketcap.svg'
import CoinGecko from '@icons/coingecko.svg'
import NomicsIcon from '@icons/nomics.svg'
import Inform from '@icons/inform.svg'

import { formatNumberToUSFormat, stripDigitPlaces } from '@core/utils/PortfolioTableUtils'


import { SvgIcon } from '@sb/components'
import { Column, Size, SortDirectionType, Table } from 'react-virtualized'
import { StyledTable, StyledAutoSizer, IconContainer, StyledSymbol, StyledTokenName, StyledColumn, StyledRow } from './SelectWrapperStyles'
import useMobileSize from '@webhooks/useMobileSize'
import { ITheme } from '../../../../types/materialUI'
import { ISelectUIDataItem } from './SelectWrapper.types'
import LinkToSolanaExp from '../../components/LinkToSolanaExp'
import { DarkTooltip } from '../../../../components/TooltipCustom/Tooltip'
import { LinkToAnalytics, LinkToTwitter } from '../../components/MarketBlock/MarketBlock.styles'

interface TableInnerProps {
  theme: ITheme
  isAdvancedSelectorMode: boolean
  data: ISelectUIDataItem[]
  // processedSelectData: any[]
  sort: (info: { sortBy: string; sortDirection: SortDirectionType }) => void;
  sortBy: string
  sortDirection: any
  toggleFavouriteMarket: (symbol: string) => void
  changeChoosenMarketData: (data: { symbol: string, marketAddress: string }) => void
  setIsMintsPopupOpen: (open: boolean) => void
  onSelectPair: (pair: { value: string, address: string, programId: string }) => any
}


const COLUMN_HEADER_STYLE: React.CSSProperties = {
  color: '#fff',
  paddingRight: 'calc(10px)',
  fontSize: '1.5rem',
  textAlign: 'left',
  fontFamily: 'Avenir Next Light',
}

const resolveIcon = (rowData: ISelectUIDataItem) =>
  rowData.marketCapLink.includes('coinmarketcap')
    ? Coinmarketcap
    : rowData.marketCapLink.includes('coingecko')
      ? CoinGecko
      : NomicsIcon

export const TableInner = (props: TableInnerProps) => {
  const {
    theme,
    isAdvancedSelectorMode,
    data,
    sortBy,
    sortDirection,
    sort,
    onSelectPair,
    toggleFavouriteMarket,
    changeChoosenMarketData,
    setIsMintsPopupOpen
  } = props
  const isMobile = useMobileSize()

  return (
    <StyledTable
      id="marketSelector"
      isAdvancedSelectorMode={isAdvancedSelectorMode}
    >
      <StyledAutoSizer>
        {({ width, height }: Size) => (
          <Table
            width={width}
            height={height}
            rowCount={data.length}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onRowClick={({ rowData }) => {
              onSelectPair({
                value: rowData.symbol,
                address: rowData.address,
                programId: rowData.programId,
              })
            }}
            gridStyle={{
              outline: 'none',
            }}
            rowClassName={'pairSelectorRow'}
            rowStyle={{
              outline: 'none',
              cursor: 'pointer',
              fontSize: '2rem',
              borderBottom: `0.05rem solid ${theme.palette?.grey.newborder}`,
            }}
            headerHeight={isMobile ? 0 : window.outerHeight / 25}
            headerStyle={{
              color: '#fff',
              paddingLeft: '.5rem',
              paddingTop: '.25rem',
              marginLeft: 0,
              marginRight: 0,
              letterSpacing: '.075rem',
              textTransform: 'capitalize',
              fontFamily: 'Avenir Next Light',
              fontSize: '2rem',
              outline: 'none',
              ...(isMobile ? { display: 'none' } : {}),
            }}
            rowHeight={
              isMobile ? window.outerHeight / 12 : window.outerHeight / 14
            }
            rowGetter={({ index }) => data[index]}
          >
            {!isMobile &&
              <Column
                label={` `}
                dataKey="favourite"
                headerStyle={COLUMN_HEADER_STYLE}
                width={width / 2}
                style={{
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ rowData }) =>
                  <SvgIcon
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavouriteMarket(rowData.symbol)
                    }}
                    src={
                      rowData.favourite
                        ? favouriteSelected
                        : favouriteUnselected
                    }
                    width="2.5rem"
                    height="auto"
                  />
                }
              />
            }
            <Column
              label={` `}
              dataKey="emoji"
              headerStyle={COLUMN_HEADER_STYLE}
              width={isMobile ? width / 4.5 : width / 2}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ rowData }) =>
                <IconContainer>
                  <TokenIcon
                    mint={rowData.mint}
                    width={'2.5rem'}
                    emojiIfNoLogo={true}
                    isAwesomeMarket={rowData.isAwesomeMarket}
                    isAdditionalCustomUserMarket={rowData.isCustomUserMarket}
                  />
                </IconContainer>
              }
            />

            <Column
              label={`Market`}
              dataKey="symbol"
              headerStyle={COLUMN_HEADER_STYLE}
              width={width * 1.8}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ rowData }) =>
                <Row direction={'column'} align={'initial'}>
                  {rowData.baseTokenInfo?.name && (
                    <StyledSymbol>
                      {rowData.baseTokenInfo.name === 'Cryptocurrencies.Ai'
                        ? 'Aldrin'
                        : rowData.baseTokenInfo.name.replace('(Sollet)', '')}
                    </StyledSymbol>
                  )}
                  <StyledTokenName>{rowData.marketName}</StyledTokenName>{' '}
                </Row>
              }
            />

            <Column
              label={`last price`}
              dataKey="closePrice"
              headerStyle={COLUMN_HEADER_STYLE}
              width={width * 2}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ rowData }) =>
                <>
                  <StyledColumn
                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                  >
                    <span
                      style={{
                        color: theme?.palette.green.main,
                      }}
                    >
                      {rowData.closePrice === 0
                        ? '-'
                        : formatNumberToUSFormat(
                          stripDigitPlaces(rowData.closePrice, rowData.pricePrecision)
                        )}
                    </span>
                    <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                      {rowData.quote}
                    </span>
                  </StyledColumn>
                  <StyledRow>
                    <span
                      style={{
                        color: theme.palette.green.main,
                      }}
                    >
                      {rowData.closePrice === 0
                        ? '-'
                        : formatNumberToUSFormat(
                          stripDigitPlaces(rowData.closePrice, rowData.pricePrecision)
                        )}
                    </span>
                    <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                      {rowData.quote}
                    </span>
                  </StyledRow>
                </>
              }
            />
            {/*
            {(isAdvancedSelectorMode && !isMobile) && <Column
              label={`change 24h`}
              dataKey="price24hChange"
              headerStyle={COLUMN_HEADER_STYLE}
              width={width * 1.8}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />}
            {!isMobile && isAdvancedSelectorMode && (
              <Column
                label={`Min 24h`}
                dataKey="min24h"
                headerStyle={COLUMN_HEADER_STYLE}
                width={width * 1.6}
                style={{
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
            )}
            {(!isMobile && isAdvancedSelectorMode) && (
              <Column
                label={`Max 24h`}
                dataKey="max24h"
                headerStyle={COLUMN_HEADER_STYLE}
                width={width * 1.4}
                style={{
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
            )}
            {(!isMobile && isAdvancedSelectorMode) && (
              <Column
                label={`volume 24h`}
                dataKey="volume24hChange"
                headerStyle={COLUMN_HEADER_STYLE}
                width={width * 1.3}
                style={{
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
            )}
            {(!isMobile && isAdvancedSelectorMode) && (
              <Column
                label={`trades 24h`}
                dataKey="trades24h"
                headerStyle={COLUMN_HEADER_STYLE}
                width={width * 1.3}
                style={{
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
            )}
            {(!isMobile && isAdvancedSelectorMode) && (
              <Column
                label={`Avg.Buy 14d`}
                dataKey="avgBuy14d"
                headerStyle={COLUMN_HEADER_STYLE}
                width={width * 1.4}
                style={{
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
            )}
            {(!isMobile && isAdvancedSelectorMode) && (
              <Column
                label={`Avg.Sell 14d`}
                dataKey="avgSell14d"
                headerStyle={COLUMN_HEADER_STYLE}
                width={width * 1.4}
                style={{
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
            )}
            */}
            {!isMobile && (
              <Column
                label={`Links`}
                dataKey="links"
                headerStyle={COLUMN_HEADER_STYLE}
                width={width * 2.1}
                style={{
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ rowData }) =>
                  <Row
                    style={{ flexWrap: 'nowrap' }}
                    justify={'flex-start'}
                    align={'baseline'}
                  >
                    <SvgIcon
                      onClick={(e) => {
                        e.stopPropagation()
                        changeChoosenMarketData({ symbol: rowData.marketName, marketAddress: rowData.marketAddress })
                        setIsMintsPopupOpen(true)
                      }}
                      src={Inform}
                      style={{ marginRight: '1.5rem', cursor: 'pointer' }}
                      width={'2.3rem'}
                      height={'2.3rem'}
                    />
                    <LinkToSolanaExp padding={'0'} marketAddress={rowData.marketAddress} />
                    <DarkTooltip title={'Show analytics for this market.'}>
                      <LinkToAnalytics
                        target="_blank"
                        rel="noopener noreferrer"
                        to={`/analytics/${rowData.symbol}`}
                      >
                        <SvgIcon
                          src={AnalyticsIcon}
                          width={'2.3rem'}
                          height={'2.3rem'}
                        />
                      </LinkToAnalytics>
                    </DarkTooltip>
                    {rowData.twitterLink && (
                      <DarkTooltip title={'Twitter profile of base token.'}>
                        <LinkToTwitter
                          target="_blank"
                          rel="noopener noreferrer"
                          href={rowData.twitterLink}
                        >
                          <SvgIcon
                            width={'2.5rem'}
                            height={'2.5rem'}
                            src={BlueTwitterIcon}
                          />
                        </LinkToTwitter>
                      </DarkTooltip>
                    )}
                    {rowData.marketCapLink && (
                      <a
                        style={{ marginLeft: '1.5rem' }}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={rowData.marketCapLink}
                      >
                        <SvgIcon
                          width={'2.5rem'}
                          height={'2.5rem'}
                          src={resolveIcon(rowData)}
                        />
                      </a>
                    )}
                  </Row>
                }
              />
            )}
          </Table>
        )}
      </StyledAutoSizer>
    </StyledTable>
  )
}
