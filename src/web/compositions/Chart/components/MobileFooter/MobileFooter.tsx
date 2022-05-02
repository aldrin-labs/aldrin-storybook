import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { SvgIcon } from '../../../../components'
import DashboardIcon from './icons/dashboard.svg'
import DocsIcon from './icons/docs.svg'
import RebalancerIcon from './icons/rebalancer.svg'
import RoadmapIcon from './icons/roadmap.svg'
import SdkIcon from './icons/sdk.svg'
import {
  TradeLink,
  StakingLink,
  SwapsLink,
  PoolsLink,
  MoreLink,
} from './NavIconsComponents'
import {
  FooterComponent,
  MoreLinksPopup,
  MoreLinksContent,
  MoreLinkContainer,
} from './styles'

export const MobileFooter = () => {
  const [popupOpened, setPopupOpened] = useState(false)

  const history = useHistory()

  useEffect(() => {
    setPopupOpened(false)
  }, [history.location.pathname])

  return (
    <FooterComponent justify="space-around">
      <TradeLink />
      <SwapsLink />
      <PoolsLink />
      <StakingLink />
      <MoreLink onClick={() => setPopupOpened(!popupOpened)} />

      <MoreLinksPopup
        onClick={() => setPopupOpened(false)}
        opened={popupOpened}
      >
        <MoreLinksContent>
          <h4>More</h4>
          <MoreLinkContainer as={Link} to="/rebalance">
            <SvgIcon src={RebalancerIcon} width="0.75em" />
            <span>Rebalancer</span>
          </MoreLinkContainer>
          <MoreLinkContainer as={Link} to="/dashboard">
            <SvgIcon src={DashboardIcon} width="0.75em" />
            <span>Dashboard</span>
          </MoreLinkContainer>

          <MoreLinkContainer
            as="a"
            target="_blank"
            href="https://github.com/aldrin-exchange/aldrin-sdk"
          >
            <SvgIcon src={SdkIcon} width="0.75em" />
            <span>SDK</span>
          </MoreLinkContainer>
          <MoreLinkContainer
            as="a"
            target="_blank"
            href="https://docs.aldrin.com"
          >
            <SvgIcon src={DocsIcon} width="0.75em" />
            <span>Read Me</span>
          </MoreLinkContainer>

          <MoreLinkContainer
            as="a"
            target="_blank"
            href="https://rin.aldrin.com/"
          >
            <SvgIcon src={RoadmapIcon} width="0.75em" />
            <span> Roadmap</span>
          </MoreLinkContainer>
        </MoreLinksContent>
      </MoreLinksPopup>
    </FooterComponent>
  )
}
