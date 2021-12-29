import styled from "styled-components";
import { Tabs, TabList, Tab } from 'react-tabs';
import {WideContent} from "@sb/components/Layout";

export const WideContentStyled = styled(WideContent)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const TabsStyled = styled(Tabs)`
  margin-bottom: 4.8rem;
`;

export const TabsListWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.7rem;
  marginTop: 2.4rem;
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`

export const TabListStyled = styled(TabList)`
  width: 100%;
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  margin-right: 0;
  padding: 0;
  background-color: #222429;
  box-shadow: 0px 0px 2.66rem rgba(18, 0, 49, 0.24);
  border-radius: 1.33rem;
  @media (max-width: 768px) {
    align-items: stretch;
    margin-right: 0;
    margin-bottom: 2.7rem;
  }
`

export const TabStyled =  styled(Tab)`
  width: 33.33%;
  text-align: center;
  cursor: pointer;
  border-radius: 1.33rem;
  &.react-tabs__tab--selected {
    background-color: #383B45;
  }
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export const TabTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  line-height: 4rem;
  @media (max-width: 768px) {
    line-height: 1;
    padding: 1.5rem 0.7rem;
  }
`

export const Banners = styled.div`
  margin: 4.8rem -1.2rem 4.4rem
`

type WrapperProps = {
  image?: string
}

export const BannerWrapper = styled.div`
  border-radius: 1.2rem;
  overflow: hidden;
  padding: 0.444rem 2.4rem;
  margin: 0 1.2rem 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 8.3rem;
  background-image: ${(props: WrapperProps) => `url(${props.image})`};
  background-size: cover;
  box-shadow: 0 0 4.8rem rgba(0, 0, 0, 0.55);

  img {
    margin-right: 1.6rem;
  }

  @media (min-width: 540px) and (max-width: 991px) {
    flex-direction: column;
  }

  @media (max-width: 540px) {
    height: auto;
    margin-bottom: 2rem;
  }
`

export const BannerDescription = styled.div`
  width: 50%;
  max-width: 15.6rem;

  @media (min-width: 540px) and (max-width: 991px) {
    width: 100%;
    max-width: 100%;
    text-align: center;
  }
`

export const BannerLink = styled.div`
  margin-left: auto;
  padding-left: 1rem;

  @media (min-width: 540px) and (max-width: 991px) {
    margin-right: auto;
    padding-left: 0;
  }
`
