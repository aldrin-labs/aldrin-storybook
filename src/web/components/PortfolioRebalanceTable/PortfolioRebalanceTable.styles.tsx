import React from 'react'
import styled from 'styled-components'

import DeleteIcon from '@material-ui/icons/Delete'
import { Card, Table } from '@material-ui/core'
import Slider from '@material-ui/lab/Slider'
import { TableWithSort } from '@sb/components'

export const SDeleteIcon = styled(({ hoverColor, ...rest }) => (
  <DeleteIcon {...rest} />
))`
  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`

export const LoaderWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props: { background: string }) => props.background};

  z-index: 10000;

  & > div {
    z-index: 1;
  }
`

export const LoaderInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const ContentInner = styled(({ ...props }) => <Card {...props} />)`
  width: 100%;
  height: 100%;
  display: flex;

  & td {
    font-family: DM Sans, sans-serif;
    color: #16253d;
    background: #ffffff;
    text-transform: uppercase;
    font-weight: normal;
    font-size: 1.35rem;
    padding: 0px;
    letter-spacing: 0.5px;
    height: 48px;
    border-bottom: 1px solid #ebeef4;
  }

  & td:first-child {
    padding: 0 0 0 12px !important;
  }

  & th {
    font-family: DM Sans, sans-serif;
    color: #7284a0;
    background: #ffffff;
    text-transform: uppercase;
    font-weight: normal;
    font-size: 1.15rem;
  }

  & td {
    @media screen and (min-device-width: 1921px) and (min-device-height: 1081px) and (-webkit-min-device-pixel-ratio: 1) {
      height: 56px;
    }

    @media screen and (min-device-width: 2521px) and (min-device-height: 1481px) and (-webkit-min-device-pixel-ratio: 1) {
      height: 72px;
    }

    @media screen and (min-device-width: 3221px) and (min-device-height: 1781px) and (-webkit-min-device-pixel-ratio: 1) {
      height: 96px;
    }
  }
`

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const StyledSlider = styled(
  ({
    trackAfterBackground,
    trackBeforeBackground,
    trackAfterOpacity,
    thumbBackground,
    ...rest
  }) => <Slider {...rest} />
)`
  & .trackAfter {
    background: ${(props: { trackAfterBackground: string }) =>
      props.trackAfterBackground};
    opacity: ${(props: { trackAfterOpacity: string }) =>
      props.trackAfterOpacity};
  }

  & .trackBefore {
    background: ${(props: { trackBeforeBackground: string }) =>
      props.trackBeforeBackground};
    opacity: 1;
  }

  & .thumb {
    background: ${(props: { thumbBackground: string }) =>
      props.thumbBackground};
  }
`
export const TitleItem = styled.div``
