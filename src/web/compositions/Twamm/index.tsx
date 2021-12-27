import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import React, { useEffect } from 'react'
import { Tabs, TabPanel } from 'react-tabs'
import { compose } from 'recompose'

import { SvgIcon } from '@sb/components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Cell, Page, WideContent } from '@sb/components/Layout'
import { StyledLink, Text } from '@sb/compositions/Addressbook'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import PlaceOrder from '@sb/compositions/Twamm/PlaceOrder/PlaceOrder'
import {
  TabListStyled,
  TabStyled,
  TabsListWrapper,
  TabTitle,
  Banners,
  BannerWrapper,
  BannerDescription,
  BannerLink,
} from '@sb/compositions/Twamm/styles'
import { useConnection } from '@sb/dexUtils/connection'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { getParsedRunningOrders } from '@sb/dexUtils/twamm/getParsedRunningOrders'
import { loadOrdersArrayForTwamm } from '@sb/dexUtils/twamm/loadOrdersArrayForTwamm'
import { useWallet } from '@sb/dexUtils/wallet'

import ArrowBanner from '@icons/arrowBanner.svg'
import BlackBanner from '@icons/blackBanner.png'
import PinkBanner from '@icons/pinkBanner.png'

import { OrdersHistoryWrapper } from './components/OrdersHistory/OrdersHistory.Wrapper'
import { RunningOrdersWrapper } from './components/RunningOrders/RunningOrders.Wrapper'
import GuideImg from './img/guideImg.svg'
import SdkImg from './img/sdkImg.svg'

const TwammComponent = ({ theme }: { theme: Theme }) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  useEffect(() => {
    if (wallet.publicKey) {
      getAllAccounts()
    }

    const getOrders = async () => {
      const a = await loadOrdersArrayForTwamm({ connection })
      const b = await getParsedRunningOrders({ connection, wallet })
      console.log('orders', a, b)
    }
    getOrders()
  }, [wallet.publicKey])

  const getAllAccounts = () => {
    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: TWAMM_PROGRAM_ADDRESS,
    })

    console.log('program.account', program.account.pairSettings)
  }

  return (
    <Page>
      <WideContent>
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
                  <StyledLink
                    to="/pools"
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
                  </StyledLink>
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
        <Tabs>
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
            <BtnCustom
              theme={theme}
              onClick={() => {}}
              needMinWidth={false}
              btnWidth="21.3rem"
              height="4rem"
              fontSize="1.4rem"
              borderRadius="1.1rem"
              borderColor="#45AC14"
              btnColor="#fff"
              backgroundColor="#45AC14"
              textTransform="none"
              margin="0"
              transition="all .4s ease-out"
              style={{ whiteSpace: 'nowrap' }}
            >
              Trade on TWAMM
            </BtnCustom>
          </TabsListWrapper>

          <TabPanel>
            <PlaceOrder />
          </TabPanel>
          <TabPanel>
            <RunningOrdersWrapper />
          </TabPanel>
          <TabPanel>
            <OrdersHistoryWrapper />
          </TabPanel>
        </Tabs>
      </WideContent>
    </Page>
  )
}

export default compose(withTheme())(TwammComponent)
