// TODO: remove that

class _SelectPairListComponent extends React.PureComponent<
    IPropsSelectPairListComponent,
    IStateSelectPairListComponent
> {
    state: IStateSelectPairListComponent = {
        processedSelectData: [],
        showAddMarketPopup: false,
        left: 0,
        sortBy: 'volume24hChange',
        sortDirection: SortDirection.DESC,
        choosenMarketData: {},
        isMintsPopupOpen: false,
        isFeedBackPopupOpen: false,
    }

    changeChoosenMarketData = ({ symbol, marketAddress }) => {
        this.setState({ choosenMarketData: { symbol, marketAddress } })
    }

    setIsMintsPopupOpen = (isMintsPopupOpen) => {
        this.setState({ isMintsPopupOpen })
    }

    setIsFeedbackPopupOpen = (isFeedBackPopupOpen) => {
        this.setState({ isFeedBackPopupOpen })
    }

    componentDidMount() {
        const {
            data,
            toggleFavouriteMarket,
            onSelectPair,
            theme,
            searchValue,
            tab,
            getSerumTradesDataQuery,
            customMarkets,
            market,
            tokenMap,
            markets,
            allMarketsMap,
            favouritePairsMap,
            marketType,
        } = this.props

        const serumMarketsDataMap = new Map()

        const { left } = document
            .getElementById('ExchangePair')
            ?.getBoundingClientRect()

        const {
            sortBy,
            sortDirection,
            isMintsPopupOpen,
            isFeedBackPopupOpen,
        } = this.state

        getSerumTradesDataQuery?.getSerumTradesData?.forEach((el) =>
            serumMarketsDataMap.set(el.pair, el)
        )

        const processedSelectData = combineSelectWrapperData({
            data,
            toggleFavouriteMarket,
            onSelectPair,
            favouritePairsMap,
            theme,
            searchValue,
            tab,
            customMarkets,
            market,
            tokenMap,
            serumMarketsDataMap,
            allMarketsMap,
            isMintsPopupOpen,
            setIsMintsPopupOpen: this.setIsMintsPopupOpen,
            changeChoosenMarketData: this.changeChoosenMarketData,
        })

        const sortedData = this._sortList(
            sortBy,
            sortDirection,
            this.props.tab,
            processedSelectData,
            this.props.marketType
        )

        this.setState({
            processedSelectData: sortedData,
            left,
        })
    }

    componentWillReceiveProps(nextProps: IPropsSelectPairListComponent) {
        const {
            data,
            toggleFavouriteMarket,
            onSelectPair,
            theme,
            searchValue,
            tab,
            favouritePairsMap,
            marketType,
            markets,
            customMarkets,
            market,
            tokenMap,
            getSerumTradesDataQuery,
            allMarketsMap,
            onTabChange,
        } = nextProps
        const { data: prevPropsData } = this.props
        const {
            sortBy,
            sortDirection,
            isMintsPopupOpen,
            isFeedBackPopupOpen,
        } = this.state

        const serumMarketsDataMap = new Map()

        getSerumTradesDataQuery?.getSerumTradesData?.forEach((el) =>
            serumMarketsDataMap?.set(el.pair, el)
        )
        const processedSelectData = combineSelectWrapperData({
            data,
            toggleFavouriteMarket,
            previousData: prevPropsData,
            onSelectPair,
            theme,
            searchValue,
            tab,
            favouritePairsMap,
            marketType,
            market,
            tokenMap,
            serumMarketsDataMap: serumMarketsDataMap,
            allMarketsMap,
            isMintsPopupOpen,
            setIsMintsPopupOpen: this.setIsMintsPopupOpen,
            changeChoosenMarketData: this.changeChoosenMarketData,
        })

        const sortedData = this._sortList(
            sortBy,
            sortDirection,
            this.props.tab,
            processedSelectData,
            this.props.marketType
        )

        this.setState({
            processedSelectData: sortedData,
        })
    }


    _sortList = dataSorter

    _sort = ({ sortBy, sortDirection }) => {
        const processedSelectData = this._sortList(sortBy, sortDirection, this.props.tab, this.state.processedSelectData, this.props.marketType)
        this.setState({ sortBy, sortDirection, processedSelectData })
    }

    render() {
        const {
            processedSelectData,
            showAddMarketPopup,
            choosenMarketData,
            isMintsPopupOpen,
            isFeedBackPopupOpen,
        } = this.state

        const {
            theme,
            searchValue,
            tab,
            id,
            onChangeSearch,
            // history,
            tokenMap,
            selectorMode,
            favouritePairsMap,
            setSelectorMode,
            // setCustomMarkets,
            // customMarkets,
            allMarketsMap,
            // getSerumMarketDataQueryRefetch,
            onTabChange,
            marketName,
            // closeMenu,
        } = this.props

        const isAdvancedSelectorMode = selectorMode === 'advanced'

        // const onAddCustomMarket = (customMarket: any) => {
        //   const marketInfo = [...allMarketsMap.values()].some(
        //     (m) => m.address.toBase58() === customMarket.address
        //   )

        //   if (marketInfo) {
        //     notify({
        //       message: `A market with the given ID already exists`,
        //       type: 'error',
        //     })

        //     return false
        //   }

        //   const newCustomMarkets = [...customMarkets, customMarket]
        //   setCustomMarkets(newCustomMarkets)
        //   history.push(`/chart/spot/${customMarket.name.replace('/', '_')}`)
        //   console.log('onAddCustomMarket', newCustomMarkets)
        //   return true
        // }

        return (

            <StyledGrid
                theme={theme}
                id={id}
                isAdvancedSelectorMode={isAdvancedSelectorMode}
            >
                <TableHeader
                    theme={theme}
                    tab={tab}
                    favouritePairsMap={favouritePairsMap}
                    tokenMap={tokenMap}
                    data={this.props.data}
                    onTabChange={onTabChange}
                    allMarketsMap={allMarketsMap}
                    isAdvancedSelectorMode={isAdvancedSelectorMode}
                    setSelectorMode={setSelectorMode}
                />
                <Grid container style={{ justifyContent: 'flex-end', width: '100%' }}>
                    <StyledInput
                        placeholder="Search"
                        disableUnderline={true}
                        value={searchValue}
                        onChange={onChangeSearch}
                        inputProps={SEARCH_INPUT_PROPS}
                        endAdornment={
                            <InputAdornment
                                style={SEARCH_ADORMENT_STYLE}
                                disableTypography={true}
                                position="end"
                            >
                                <SvgIcon src={search} width="1.5rem" height="auto" />
                            </InputAdornment>
                        }
                    />
                </Grid>
                <TableInner
                    theme={theme}
                    selectorMode={selectorMode}
                    processedSelectData={processedSelectData}
                    isAdvancedSelectorMode={isAdvancedSelectorMode}
                    sort={this._sort}
                    sortBy={this.state.sortBy}
                    sortDirection={this.state.sortDirection}
                    selectedPair={marketName?.replace('/', '_')}
                    onRowClick={() => {
                        onChangeSearch({ target: { value: '' } })
                    }}
                />
                <TableFooter container>
                    <Row
                        style={{
                            padding: '0 2rem',
                            height: '4rem',
                            fontFamily: 'Avenir Next Medium',
                            color: theme?.palette.blue.serum,
                            alignItems: 'center',
                            fontSize: '1.5rem',
                            textTransform: 'none',
                            textDecoration: 'underline',
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            this.setIsFeedbackPopupOpen(true)
                        }}
                    >
                        Found an error in the catalog? Let us know!
                    </Row>
                    {/* <Row
            style={{
              padding: '0 2rem',
              height: '4rem',
              fontFamily: 'Avenir Next Medium',
              color: theme.palette.blue.serum,
              alignItems: 'center',
              fontSize: '1.5rem',
              textTransform: 'none',
            }}
            onClick={async (e) => {
              e.stopPropagation()
              if (publicKey === '') {
                notify({
                  message: 'Connect your wallet first',
                  type: 'error',
                })
                wallet.connect()
                return
              }

              this.setState({ showAddMarketPopup: true })
              closeMenu()
            }}
          >
            + Add Market
          </Row> */}
                </TableFooter>
                {/* <CustomMarketDialog
        theme={theme}
        open={showAddMarketPopup}
        onClose={() => this.setState({ showAddMarketPopup: false })}
        onAddCustomMarket={onAddCustomMarket}
        getSerumMarketDataQueryRefetch={getSerumMarketDataQueryRefetch}
      /> */}
                <WarningPopup theme={theme} />
                <MintsPopup
                    theme={theme}
                    symbol={choosenMarketData?.symbol}
                    marketAddress={choosenMarketData?.marketAddress}
                    open={isMintsPopupOpen}
                    onClose={() => this.setIsMintsPopupOpen(false)}
                />
                <MarketsFeedbackPopup
                    theme={theme}
                    open={isFeedBackPopupOpen}
                    onClose={() => this.setIsFeedbackPopupOpen(false)}
                />
            </StyledGrid>

        )
    }
}
