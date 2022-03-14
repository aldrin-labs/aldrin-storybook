import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TabPanel } from 'react-tabs'
import { compose } from 'recompose'

import { SvgIcon } from '@sb/components'
import { Cell, FlexBlock, Page } from '@sb/components/Layout'
import { Text } from '@sb/compositions/Addressbook'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import PlaceOrder from '@sb/compositions/Twamm/PlaceOrder/PlaceOrder'
import {
  BannerDescription,
  BannerLink,
  Banners,
  BannerWrapper,
  StyledA,
  TabListStyled,
  TabsListWrapper,
  TabsStyled,
  TabStyled,
  TabTitle,
  TextBlock,
  TextBlockWrapper,
  WideContentStyled,
} from '@sb/compositions/Twamm/styles'
import { useConnection } from '@sb/dexUtils/connection'
import { getOrderArray } from '@sb/dexUtils/twamm/getOrderArray'
import { getParsedPairSettings } from '@sb/dexUtils/twamm/getParsedPairSettings'
import { PairSettings } from '@sb/dexUtils/twamm/types'
import { useWallet } from '@sb/dexUtils/wallet'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'

import ArrowBanner from '@icons/arrowBanner.svg'
import BlackBanner from '@icons/blackBanner.png'
import PinkBanner from '@icons/pinkBanner.png'

import { ConnectWalletWrapper } from '../../components/ConnectWalletWrapper'
import { DEFAULT_FARMING_TICKET_END_TIME } from '../../dexUtils/common/config'
import { useAllStakingTickets } from '../../dexUtils/staking/useAllStakingTickets'
import { DexTokensPrices } from '../Pools/index.types'
import { OrdersHistoryWrapper } from './components/OrdersHistory/OrdersHistory.Wrapper'
import { RunningOrdersWrapper } from './components/RunningOrders/RunningOrders.Wrapper'
import GuideImg from './img/guideImg.svg'
import SdkImg from './img/sdkImg.svg'

const MIN_RIN = 100_000_000_000
const TwammComponent = ({
  theme,
  getDexTokensPricesQuery,
}: {
  theme: Theme
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const [pairSettings, setPairSettings] = useState<PairSettings[]>([])
  // change to 0 before prod
  const selectedPairSettings = pairSettings[0]
  const [orderArray, setOrderArray] = useState([])
  const [tabIndex, setTabIndex] = useState(0)
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)

  const handleGetOrderArray = async () => {
    try {
      const [pairSettingsRes, orderArrayRes] = await Promise.all([
        getParsedPairSettings({
          wallet,
          connection,
        }),
        getOrderArray({
          wallet,
          connection,
        }),
      ])

      setPairSettings(pairSettingsRes)
      setOrderArray(orderArrayRes)
    } catch (e) {
      console.warn('Unable to load orders:', e)
    }
  }
  useEffect(() => {
    handleGetOrderArray()
  }, [wallet.publicKey?.toString()])

  const [tickets] = useAllStakingTickets({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    onlyUserTickets: true,
  })

  const hasActiveTickets =
    tickets
      .filter((t) => t.endTime === DEFAULT_FARMING_TICKET_END_TIME)
      .reduce((acc, t) => acc + t.tokensFrozen, 0) >= MIN_RIN

  // console.log(
  //   'stake: ',
  //   tickets
  //     .filter((t) => t.endTime === DEFAULT_FARMING_TICKET_END_TIME)
  //     .reduce((acc, t) => acc + t.tokensFrozen, 0)
  // )
  if (!pairSettings.length) {
    return null
  }

  return (
    <Page>
      <WideContentStyled>
        <Banners>
          <Row width="100%" align="stretch">
            <Cell col={12} colSm={4}>
              <BannerWrapper image={PinkBanner}>
                <img src={GuideImg} alt="" />
                <BannerDescription>
                  <Text fontSize="1.6rem" fontFamily="Avenir Next Medium">
                    <span>Learn why and how to use Aldrin dTWAP.</span>
                  </Text>
                </BannerDescription>
                <BannerLink>
                  <StyledA
                    href="https://docs.aldrin.com/twamm/why-and-how-to-use-aldrin-twamm-guide-for-whales"
                    target="_blank"
                    rel="noopener noreferrer"
                    needHover
                    fontSize="1.6rem"
                    fontFamily="Avenir Next Bold"
                    whiteSpace="nowrap"
                  >
                    Open Guide{' '}
                    <SvgIcon
                      width="1.6rem"
                      height="0.89rem"
                      src={ArrowBanner}
                    />
                  </StyledA>
                </BannerLink>
              </BannerWrapper>
            </Cell>
            <Cell col={12} colSm={4}>
              <BannerWrapper image={BlackBanner}>
                <img src={SdkImg} alt="" />
                <BannerDescription>
                  <Text fontSize="1.6rem" fontFamily="Avenir Next Medium">
                    <span>Do you want to execute parts of dTWAP orders?</span>
                  </Text>
                </BannerDescription>
                <BannerLink>
                  <StyledA
                    href="https://github.com/aldrin-exchange/aldrin-sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    needHover
                    fontSize="1.6rem"
                    fontFamily="Avenir Next Bold"
                    whiteSpace="nowrap"
                  >
                    Open SDK{' '}
                    <SvgIcon
                      width="1.6rem"
                      height="0.89rem"
                      src={ArrowBanner}
                    />
                  </StyledA>
                </BannerLink>
              </BannerWrapper>
            </Cell>
            <Cell col={12} colSm={4}>
              <BannerWrapper image={BlackBanner}>
                <TextBlockWrapper>
                  <TextBlock fontSize="1.6rem" fontFamily="Avenir Next Bold">
                    Public Beta
                  </TextBlock>
                  <Text fontSize="1.6rem" fontFamily="Avenir Next Medium">
                    Undergoing an audit at this time. Use at your own risk.
                  </Text>
                </TextBlockWrapper>
              </BannerWrapper>
            </Cell>
          </Row>
        </Banners>
        <ConnectWalletWrapper>
          {hasActiveTickets ? (
            <TabsStyled
              selectedIndex={tabIndex}
              onSelect={(index: number) => setTabIndex(index)}
            >
              <TabsListWrapper>
                <TabListStyled>
                  <TabStyled>
                    <TabTitle>Place Time-Weighted Average Order</TabTitle>
                  </TabStyled>
                  <TabStyled>
                    <TabTitle>Running Orders</TabTitle>
                  </TabStyled>
                  <TabStyled>
                    <TabTitle>Order History</TabTitle>
                  </TabStyled>
                </TabListStyled>
                {/* <BtnCustom */}
                {/*  theme={theme} */}
                {/*  onClick={() => {}} */}
                {/*  needMinWidth={false} */}
                {/*  btnWidth="21.3rem" */}
                {/*  height="4rem" */}
                {/*  fontSize="1.4rem" */}
                {/*  borderRadius="1.1rem" */}
                {/*  borderColor="#45AC14" */}
                {/*  btnColor="#fff" */}
                {/*  backgroundColor="#45AC14" */}
                {/*  textTransform="none" */}
                {/*  margin="0" */}
                {/*  transition="all .4s ease-out" */}
                {/*  style={{ whiteSpace: 'nowrap' }} */}
                {/* > */}
                {/*  Trade on TWAMM */}
                {/* </BtnCustom> */}
              </TabsListWrapper>

              <TabPanel>
                <PlaceOrder
                  pairSettings={pairSettings}
                  selectedPairSettings={selectedPairSettings}
                  orderArray={orderArray}
                  handleGetOrderArray={handleGetOrderArray}
                  setTabIndex={setTabIndex}
                  setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
                />
              </TabPanel>
              <TabPanel>
                <RunningOrdersWrapper
                  pairSettings={pairSettings}
                  getDexTokensPricesQuery={getDexTokensPricesQuery}
                  setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
                />
              </TabPanel>
              <TabPanel>
                <OrdersHistoryWrapper />
              </TabPanel>
            </TabsStyled>
          ) : (
            <FlexBlock
              alignItems="center"
              justifyContent="center"
              style={{ height: '427px' }}
            >
              <Text fontSize="lg">
                {' '}
                No active staking. Please{' '}
                <Link style={{ color: 'white' }} to="/staking/rin">
                  stake at least 100 RIN
                </Link>{' '}
                first.
              </Text>
            </FlexBlock>
          )}
        </ConnectWalletWrapper>
      </WideContentStyled>
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </Page>
  )
}

export default compose(
  withTheme(),
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(TwammComponent)
