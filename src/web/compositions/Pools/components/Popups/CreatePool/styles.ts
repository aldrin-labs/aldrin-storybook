import { COLORS, BORDER_RADIUS, SIZE } from '@variables/variables'

import styled from 'styled-components'
import { BlockContent } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { Flex } from '@sb/components/Layout'
import { InlineText, Text } from '@sb/components/Typography'

export const Title = styled.span`
  font-size: 32px;
  line-height: 1.4;
  font-weight: 700;

  span {
    font-weight: 400;
  }
`

export const Footer = styled(Flex)`
  margin: 30px 0 0 0;
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

export const RadioGroupContainer = styled(Flex)`
  align-items: center;
  min-height: 72px;
  margin-bottom: auto;
`

export const ErrorText = styled(Text)`
  margin: 5px 0;
`

export const InputAppendContainer = styled.div`
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: right;
  align-items: flex-end;
  margin-left: auto;
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

export const NumberInputContainer = styled.div`
  flex: 1;
  margin-left: 10px;

  &:first-child {
    margin-left: 0;
  }
`

interface ConfirmationBlockProps {
  border?: boolean
}

export const ConfirmationBlock = styled.div<ConfirmationBlockProps>`
  padding: 10px 24px;
  ${(props: ConfirmationBlockProps) =>
    props.border
      ? `
  border-radius: ${BORDER_RADIUS.lg};
  border: 1px solid ${COLORS.border};
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.45);
  `
      : ''}
`
// export const ConfirmationBlock = styled.div``

export const ConfirmationRow = styled(Flex)`
  padding: 10px 0;
  justify-content: space-between;
  align-items: center;
`

export const SvgIconContainer = styled.span`
  padding-left: 6px;
  position: relative;
  top: 2px;
  cursor: help;
`

export const Warning = styled(Flex)`
  padding: 22px 44px;
  margin-bottom: 20px;
  background: ${COLORS.warningDark};
  border-radius: ${BORDER_RADIUS.lg};
`

export const WarningIcon = styled.div`
  margin-right: 20px;
`

export const PoolProcessingBlock = styled(BlockContent)`
  width: 100vw;
  max-width: 400px;
`
export const PoolProcessingContent = styled(Flex)`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const PoolProcessingButton = styled(Button)`
  margin-top: 40px;
`

export const VestingExplanation = styled.div`
  border: 1px solid ${COLORS.background};
  padding: ${SIZE.defaultPadding} 30px;
  margin-top: ${SIZE.defaultPadding};
  border-radius: ${BORDER_RADIUS.md};
  display: flex;
  flex-direction: row;

  ${InlineText} {
    margin-left: 30px;
  }
`
