import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import React, { useEffect, useState } from 'react'
import { TabPanel } from 'react-tabs'
import { compose } from 'recompose'

import { SvgIcon } from '@sb/components'
import { Cell, Page } from '@sb/components/Layout'
import { StyledLink, Text } from '@sb/compositions/Addressbook'
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
  TabTitle,
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
  const [orderArray, setOrderArray] = useState([])

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

  if (!pairSettings.length || !orderArray.length) {
    return null
  }

  // useEffect(() => {
  //   if (wallet.publicKey) {
  //     getAllAccounts()
  //   }
  // }, [wallet.publicKey])

  return (
    <Page>
      <WideContentStyled>
        <Banners>
          <Row width="100%" align="stretch">
            <Cell col={12} colSm={4}>
              <BannerWrapper image={PinkBanner}>
                <img src={GuideImg} alt="" />
                <BannerDescription>
                  <Text fontSize="1.3rem" fontFamily="Avenir Next Light">
                    <span>Learn why and how to use Aldrin TWAMM.</span>
                  </Text>
                </BannerDescription>
                <BannerLink>
                  <StyledLink
                    to="/pools"
                    needHover
                    fontSize="1.3rem"
                    fontFamily="Avenir Next Bold"
                    whiteSpace="nowrap"
                  >
                    Open Guide{' '}
                    <SvgIcon
                      width="1.7rem"
                      height="0.89rem"
                      src={ArrowBanner}
                    />
                  </StyledLink>
                </BannerLink>
              </BannerWrapper>
            </Cell>
            <Cell col={12} colSm={4}>
              <BannerWrapper image={BlackBanner}>
                <img src={SdkImg} alt="" />
                <BannerDescription>
                  <Text fontSize="1.3rem" fontFamily="Avenir Next Light">
                    <span>Trade with your algorithm through Aldrin TWAMM!</span>
                  </Text>
                </BannerDescription>
                <BannerLink>
                  <StyledA
                    href="https://github.com/aldrin-exchange/aldrin-sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    needHover
                    fontSize="1.3rem"
                    fontFamily="Avenir Next Bold"
                    whiteSpace="nowrap"
                  >
                    Open SDK{' '}
                    <SvgIcon
                      width="1.7rem"
                      height="0.89rem"
                      src={ArrowBanner}
                    />
                  </StyledA>
                </BannerLink>
              </BannerWrapper>
            </Cell>
            <Cell col={12} colSm={4}>
              <BannerWrapper image={BlackBanner}>
                <Text fontSize="1.3rem" fontFamily="Avenir Next Demi">
                  Undergoing an audit at this time. Use at your own risk.
                </Text>
              </BannerWrapper>
            </Cell>
          </Row>
        </Banners>
        <TabsStyled>
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
              orderArray={orderArray}
              handleGetOrderArray={handleGetOrderArray}
            />
          </TabPanel>
          <TabPanel>
            <RunningOrdersWrapper
              getDexTokensPricesQuery={getDexTokensPricesQuery}
            />
          </TabPanel>
          <TabPanel>
            <OrdersHistoryWrapper />
          </TabPanel>
        </TabsStyled>
      </WideContentStyled>
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
