import { COLORS } from '@variables/variables'
import styled from 'styled-components'

import { Button } from '@sb/components/Button'
import { Text } from '@sb/components/Typography'

import background from './banner-background.png'

export const BannerContainer = styled.div`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background: url(${background}) center -10px no-repeat;
  background-size: cover;
  margin-left: 20px;
  border-radius: 24px;
  padding: 0;
  overflow: hidden;
  height: 100%;
  position: relative;
`

export const BannerText = styled(Text)`
  font-size: 4rem;
  text-align: justify;
  text-justify: inter-word;
  text-align-last: center;
  width: 100%;
  padding: 1rem 0;
`

export const BT1 = styled(BannerText)`
  letter-spacing: 1rem;
  font-weight: bold;
`

export const BT2 = styled(BannerText)`
  letter-spacing: 0.5rem;
`

export const BT3 = styled(BannerText)`
  letter-spacing: 0.6rem;
`

export const BT4 = styled(BannerText)`
  letter-spacing: 0.6rem;
`

export const BT5 = styled(BannerText)`
  letter-spacing: 3rem;
  margin-left: 1rem;
`

export const ApplyButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  line-height: 13rem;
  border-radius: 0;
  padding: 0 18px;
  text-align: left;
  font-size: 1.8rem;
  position: absolute;
  bottom: 0;
  width: 100%;
`

export const Line = styled.span`
  flex: 1;
  border-top: 1px solid ${COLORS.white};
  margin: auto 10px;
  position: relative;
  top: 2px;

  &:after {
    content: '';
    position: absolute;
    right: 1px;
    top: -4px;
    width: 8px;
    height: 8px;
    border-right: 1px solid ${COLORS.white};
    border-bottom: 1px solid ${COLORS.white};
    transform: rotate(-45deg);
  }
`
