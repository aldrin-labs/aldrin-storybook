import React, {FC, useEffect, useState} from 'react'

import {compose} from "recompose";
import withTheme from "@material-ui/core/styles/withTheme";
import {Theme} from "@material-ui/core";
import PlaceOrder from "@sb/compositions/Twamm/PlaceOrder/PlaceOrder";
import {Cell, Page} from "@sb/components/Layout";
import { TabPanel } from 'react-tabs';
import {
  TabListStyled,
  TabStyled,
  TabsListWrapper,
  TabTitle,
  Banners,
  BannerWrapper,
  BannerDescription,
  BannerLink,
  WideContentStyled, TabsStyled
} from "@sb/compositions/Twamm/styles";
import {BtnCustom} from "@sb/components/BtnCustom/BtnCustom.styles";
import {useConnection} from "@sb/dexUtils/connection";
import {useWallet} from "@sb/dexUtils/wallet";
import {Row} from "@sb/compositions/AnalyticsRoute/index.styles";
import PinkBanner from '@icons/pinkBanner.png';
import BlackBanner from '@icons/blackBanner.png'
import {StyledLink, Text} from "@sb/compositions/Addressbook";
import {SvgIcon} from "@sb/components";
import ArrowBanner from "@icons/arrowBanner.svg";
import GuideImg from './img/guideImg.svg';
import SdkImg from './img/sdkImg.svg';
import {getPairSettings} from "@sb/dexUtils/twamm/getPairSettings";
import {getOrderArray} from "@sb/dexUtils/twamm/getOrderArray";
import {getOpenOrders} from "@sb/dexUtils/twamm/getOpenOrders";

const TwammComponent = ({
  theme,
}: {
  theme: Theme
}) => {
  const {wallet} = useWallet();
  const connection = useConnection();

  const [pairSettings, setPairSettings] = useState([]);
  const [orderArray, setOrderArray] = useState([]);

  useEffect(() => {
    getPairSettings({
      wallet,
      connection,
    }).then(pairSettingsRes => {
      setPairSettings(pairSettingsRes);
    });

    handleGetOrderArray();
  }, [])

  const handleGetOrderArray = () => {
    getOrderArray({
      wallet,
      connection,
    }).then(orderArrayRes => {
      setOrderArray(orderArrayRes);
    });
  }

  if(!pairSettings.length || !orderArray.length) {
    return null;
  }

  return (
    <Page>
      <WideContentStyled>
        <Banners>
          <Row width={'100%'} align="stretch">
            <Cell col={12} colSm={4}>
              <BannerWrapper image={PinkBanner}>
                <img src={GuideImg} alt=""/>
                <BannerDescription>
                  <Text
                    fontSize={'1.3rem'}
                    fontFamily={'Avenir Next Light'}
                  >
                    <span>Learn why and how to use Aldrin TWAMM.</span>
                  </Text>
                </BannerDescription>
                <BannerLink>
                  <StyledLink
                    to={'/pools'}
                    needHover
                    fontSize={'1.3rem'}
                    fontFamily={'Avenir Next Bold'}
                    whiteSpace="nowrap"
                  >
                    Open Guide{' '}
                    <SvgIcon width={'1.7rem'} height={'0.89rem'} src={ArrowBanner} />
                  </StyledLink>
                </BannerLink>
              </BannerWrapper>
            </Cell>
            <Cell col={12} colSm={4}>
              <BannerWrapper image={BlackBanner}>
                <img src={SdkImg} alt=""/>
                <BannerDescription>
                  <Text
                    fontSize={'1.3rem'}
                    fontFamily={'Avenir Next Light'}
                  >
                    <span>Trade with your algorithm through Aldrin TWAMM!</span>
                  </Text>
                </BannerDescription>
                <BannerLink>
                  <StyledLink
                    to={'/pools'}
                    needHover
                    fontSize={'1.3rem'}
                    fontFamily={'Avenir Next Bold'}
                    whiteSpace="nowrap"
                  >
                    Open SDK{' '}
                    <SvgIcon width={'1.7rem'} height={'0.89rem'} src={ArrowBanner} />
                  </StyledLink>
                </BannerLink>
              </BannerWrapper>
            </Cell>
            <Cell col={12} colSm={4}>
              <BannerWrapper image={BlackBanner}>
                <Text
                  fontSize={'1.3rem'}
                  fontFamily={'Avenir Next Demi'}
                >
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
            {/*<BtnCustom*/}
            {/*  theme={theme}*/}
            {/*  onClick={() => {}}*/}
            {/*  needMinWidth={false}*/}
            {/*  btnWidth="21.3rem"*/}
            {/*  height="4rem"*/}
            {/*  fontSize="1.4rem"*/}
            {/*  borderRadius="1.1rem"*/}
            {/*  borderColor="#45AC14"*/}
            {/*  btnColor="#fff"*/}
            {/*  backgroundColor="#45AC14"*/}
            {/*  textTransform="none"*/}
            {/*  margin="0"*/}
            {/*  transition="all .4s ease-out"*/}
            {/*  style={{ whiteSpace: 'nowrap' }}*/}
            {/*>*/}
            {/*  Trade on TWAMM*/}
            {/*</BtnCustom>*/}
          </TabsListWrapper>

          <TabPanel>
            <PlaceOrder
              pairSettings={pairSettings}
              orderArray={orderArray}
              handleGetOrderArray={handleGetOrderArray}
            />
          </TabPanel>
          <TabPanel>
            <h2>Running Orders</h2>
          </TabPanel>
          <TabPanel>
            <h2>Order History</h2>
          </TabPanel>
        </TabsStyled>
      </WideContentStyled>
    </Page>
  )
}

export default compose(
  withTheme(),
)(TwammComponent)
