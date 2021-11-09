import styled from 'styled-components'
import background from './banner-background.png'
import { Text } from '@sb/components/Typography'
import { Button } from '@sb/components/Button'
import { COLORS } from '../../../../../variables/variables'

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
`

export const BannerText = styled(Text)`
  font-size: 58px;
  text-align: justify;
  text-justify: inter-word;
  text-align-last:center;
  width: 100%;
  padding: 16px 0;
`

export const BT1 = styled(BannerText)`
  letter-spacing: 18px;
  font-weight: bold;
`

export const BT2 = styled(BannerText)`
  letter-spacing: 6px;
`

export const BT3 = styled(BannerText)`
  letter-spacing: 8px;
`

export const BT4 = styled(BannerText)`
  letter-spacing: 8px;
`

export const BT5 = styled(BannerText)`
  letter-spacing: 79px;
  margin-left: 32px;
`

export const ApplyButton = styled(Button)`
  display: flex;
  flex-direction: row;
  height: 100px;
  line-height: 100px;
  border-radius: 0;
  padding: 0 18px;
  text-align: left;
  font-size: 13px;
`

export const Line = styled.span`
  flex: 1;
  border-top: 1px solid ${COLORS.white};
  margin: auto 10px;
  position: relative;
  top: 2px;

  &:after {
    content: "";
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