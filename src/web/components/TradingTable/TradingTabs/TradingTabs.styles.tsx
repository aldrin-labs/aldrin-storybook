import React from 'react'
import styled from 'styled-components'
import { Tab, Tabs } from '@material-ui/core'

export const TitleTab = styled(({ primary, ...rest }) => <Tab {...rest} />)`
  &&& {
    min-height: 30px;
    color: ${(props: { selected?: boolean; primary: string }) =>
      props.selected ? props.primary : ''};
    background-color: #f2f4f6;
  }
`

export const TitleTabsGroup = styled(({ ...rest }) => <Tabs {...rest} />)`
  &&& {
    min-height: 30px;
  }
`
