import styled from 'styled-components'

import { FONTS } from '../../../variables/variables'

export const Container = styled.div`
  min-height: 60px;
  background-color: ${({ theme }) => theme.colors.red0};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white1};
  font-family: ${FONTS.main};

  > svg {
    margin: 0 20px;
  }

  > div {
    padding: 0 20px;
    text-align: center;
  }
`
