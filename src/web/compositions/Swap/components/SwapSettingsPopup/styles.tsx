import { FONT_SIZES } from '@variables/variables'
import styled, { DefaultTheme } from 'styled-components'

import { Button } from '@sb/components/Button'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { InvisibleInput } from '@sb/compositions/Pools/components/Popups/index.styles'

const SlippageButton = styled(Button)`
  width: 32%;
  height: 2.5em;
  background: ${({ theme }) => theme.colors.gray7};
  border: 1px solid
    ${({ theme, isActive }: { isActive: boolean; theme: DefaultTheme }) =>
      isActive ? theme.colors.blue7 : theme.colors.gray7};
`

const CustomSlippageContainer = styled(RowContainer)`
  position: relative;
  border-radius: 8px;
  height: 2.5em;
  background: ${({ theme }) => theme.colors.gray7};
  border: 1px solid
    ${({ theme, isActive }: { isActive: boolean; theme: DefaultTheme }) =>
      isActive ? theme.colors.blue7 : theme.colors.gray7};
`

const CustomSlippageInput = styled(InvisibleInput)`
  width: auto;
  text-align: right;
  font-size: ${FONT_SIZES.esm};
  padding-right: 1em;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray2};
  }
`

const PercentageSymbol = styled(Row)`
  right: 0.75em;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
`

export {
  SlippageButton,
  CustomSlippageContainer,
  CustomSlippageInput,
  PercentageSymbol,
}
