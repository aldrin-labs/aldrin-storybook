import React from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { GridCard } from '@sb/compositions/Profile/Profile.styles'
import { Typography } from '@sb/compositions/Profile/compositions/ProfileSidebar/ProfileSidebar.styles'

export const GridBlock = styled(GridCard)`
  margin-top: ${(props) => (props.needMarginTop ? '1.5rem' : '0')};
  height: ${(props) =>
    props.needMarginTop ? `calc(${props.height} - 1.5rem)` : `${props.height}`};

  margin-left: ${(props) => (props.needMarginLeft ? '1.5rem' : '0')};
  width: ${(props) =>
    props.needMarginLeft ? `calc(${props.width} - 1.5rem)` : `${props.width}`};
`

export const LogsGrid = styled(Grid)`
  display: flex;
  height: calc(51% - 1.5rem);
  margin-top: 1.5rem;
`

export const ProfileSettingsContainer = styled.div`
  display: flex;
  justify-content: center;
  alignitems: center;
  width: 100%;
  height: 100%;
`

export const ProfileSettingsCentredBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const GridTitle = styled.div`
  background-color: #f2f4f6;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border-bottom: 0.1rem solid #e0e5ec;
  text-align: center;
`

export const TextTitle = styled(Typography)`
  margin: 0;
  padding: 1.2rem 0;
  color: #16253d;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
`

export const SettingsLeftBlock = styled(Grid)`
  width: 58.3%;
  margin-right: 1.5rem;
`

export const SettingsRightBlock = styled(Grid)`
  width: calc(41.7% - 1.5rem);
`

export const ProfileSettingsGrid = ({
  title = '',
  height = '100%',
  width = '100%',
  needMarginTop = false,
  needMarginLeft = false,
  children,
  style,
}) => {
  return (
    <GridBlock
      height={height}
      width={width}
      needMarginTop={needMarginTop}
      needMarginLeft={needMarginLeft}
      style={style}
    >
      <GridTitle>
        <TextTitle>{title}</TextTitle>
      </GridTitle>
      {children}
    </GridBlock>
  )
}

export const SettingsBlock = styled.div`
  padding: 2rem;
`

export const MFASettingsBlock = styled(({ ...props }) => <Grid {...props} />)`
  padding: 0 0 1rem 0;
`

export const MFATypography = styled(({ textColor, ...props }) => (
  <Typography {...props} />
))`
  ${({ textColor }) => (textColor ? `color: ${textColor};` : '')}
  font-weight: bold;
  font-size: 1.6rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`

export const WhatIsBlock = styled(({ ...props }) => <Grid {...props} />)`
  padding: 0 0 2rem 0;
`

export const WhatIsText = styled(({ textColor, ...props }) => (
  <Typography {...props} />
))`
  ${({ textColor }) => (textColor ? `color: ${textColor};` : '')}
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 1rem;
`

export const ButtonContainer = styled(({ ...props }) => <Grid {...props} />)`
  padding: 2rem 0 2rem 0;
`

