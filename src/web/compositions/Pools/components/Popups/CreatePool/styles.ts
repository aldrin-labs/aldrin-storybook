import styled from 'styled-components'
import { Flex } from '@sb/components/Layout'
import { Button } from '@sb/components/Button'
import { BlockContent } from '@sb/components/Block'
import { Text } from '@sb/components/Typography'
import { InputField, Input } from '../../../../../components/Input'
import { COLORS } from '../../../../../../variables/variables'

export const Title = styled.span`
  font-size: 32px;
  line-height: 1.4;
  font-weight: 700;

  span {
    font-weight: 400;
  }
`

export const Footer = styled(Flex)`
  margin: 20px 0 0 0;
  flex-direction: row;

  ${Button} {
    flex: 1;
    margin: 0 10px;


    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
`

export const Body = styled(BlockContent)`
  width: 95vw;
  max-width: 730px;
`

export const CoinSelectors = styled(Flex)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`

export const Slash = styled.div`
  padding: 25px 10px 0;
`

export const CoinWrap = styled.div`
  flex: 1;
  margin: 0 10px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`

export const CheckboxWrap = styled.div`
  display: flex;
  margin: 0 0 20px 0;
  justify-content: space-between;
  align-items: center;
`

export const Error = styled(Text)`
  margin: 20px 0;
`

export const InputAppendContainer = styled.div`
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: right;
  align-items: flex-end;
`

export const TokensAvailableText = styled.div`
  color: ${COLORS.primaryWhite};
  font-size: 0.8em;
  line-height: 1.2;
  padding: 4px 0;
  cursor: pointer;

`

export const Centered = styled.div`
  text-align: center;
  padding: 5px 0;
`

export const NumberInputField = styled(InputField)`
  flex: 1;
  margin-left: 10px;
`

export const NumberInput = styled(Input)`
  flex: 1;
  margin-left: 10px;
`
