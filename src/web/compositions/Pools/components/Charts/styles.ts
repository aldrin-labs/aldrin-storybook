import styled from 'styled-components'
import { BlockSubtitle } from '@sb/components/Block'
import { Row } from '@sb/components/Layout'

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`

export const SubTitle = styled(BlockSubtitle)`
  white-space: nowrap;
  margin: 0 1em 0 0;
  line-height: 1;
`

export const RootRow = styled(Row)`
  margin-top: 40px;
`