import styled from 'styled-components'

import { Title } from '@sb/components/OldTable/Table'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

export const CardTitle = styled(TypographyFullWidth)`
  font-family: Avenir Next;
  font-style: normal;
  font-weight: normal;
  line-height: 1.5rem;
  text-transform: capitalize;
  letter-spacing: 0.01rem;
  font-size: 1.3rem;
  text-align: center;
  color: ${(props) => props.theme.colors.white1};
`

type TriggerTitleProps = {
  padding?: string
}

export const TriggerTitle = styled(Title)`
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  line-height: 1rem;
  position: relative;
  padding: ${(props: TriggerTitleProps) => props.padding || '1rem 0'};
  transition: opacity 0.75s ease-in-out;
  background: ${(props) => props.theme.colors.white6};
  border-radius: 0;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: 600px) {
    display: none;
  }
`
