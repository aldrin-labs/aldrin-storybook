import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import React, { useEffect, useState } from 'react'
import { TabPanel } from 'react-tabs'
import { compose } from 'recompose'

import { SvgIcon } from '@sb/components'
import { Cell, Page } from '@sb/components/Layout'
import { Text } from '@sb/compositions/Addressbook'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
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
  TabTitle, TextBlock, TextBlockWrapper,
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

import { DexTokensPrices } from '../Pools/index.types'
import { OrdersHistoryWrapper } from './components/OrdersHistory/OrdersHistory.Wrapper'
import { RunningOrdersWrapper } from './components/RunningOrders/RunningOrders.Wrapper'
import GuideImg from './img/guideImg.svg'
import SdkImg from './img/sdkImg.svg'
import {ConnectWalletPopup} from "@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup";

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

  useEffect(() => {
    getParsedPairSettings({
      wallet,
      connection,
    }).then((pairSettingsRes) => {
      setPairSettings(pairSettingsRes)
    })
    handleGetOrderArray()
  }, [wallet.publicKey])

  const handleGetOrderArray = () => {
    getOrderArray({
      wallet,
      connection,
    }).then((orderArrayRes) => {
      setOrderArray(orderArrayRes)
    })
  }

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
        <TabsStyled selectedIndex={tabIndex} onSelect={(index: number) => setTabIndex(index)}>
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
