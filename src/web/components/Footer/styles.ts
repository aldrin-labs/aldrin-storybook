import { FONT_SIZES, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { THEME_DARK } from '@sb/compositions/App/themes'

import { Button } from '../Button'
import { Row } from '../Layout'

export const FooterContainer = styled.div`
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${(props) => props.theme.colors.border1};
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  min-height: 9em;
  padding: 0 3em;
  background: ${(props) => props.theme.colors.white6};

  @media (max-width: ${BREAKPOINTS.md}) {
    flex-direction: column;
  }
`
export const MediaContainer = styled(Row)`
  width: 25%;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  @media (max-width: 1000px) {
    width: 100%;
  }
`

export const FooterButton = styled(Button)`
  color: ${(props) => props.theme.colors.white2};
  background: transparent;
  border: none;
  padding: 0.5em;
  font-size: ${FONT_SIZES.lg};
  transition: 0.3s;

  &:hover {
    color: ${(props) => props.theme.colors.white4};
  }

  &:last-child {
    margin: 0 0 0 1rem;
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    display: none;
  }
`

export const Copyright = styled.div`
  color: ${(props) => props.theme.colors.white2};
  margin-top: 0.25em;
  font-size: 12px;
`

export const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
`
