import styled from 'styled-components'
import { TypographyFullWidth } from '@storybook/styles/cssUtils'
import { Cell, Body } from '@storybook/components/OldTable/Table'

export const EmptyCell = styled(Cell)`
  position: relative;
`

export const NotScrollableBody = styled(Body)`
  overflow-y: hidden;
`

export const StyledTypography = styled(TypographyFullWidth)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
  }
`

export const RowWithVolumeChart = styled.div`
  width: 100%;
  position: relative;
  display: flex;

  background-color: ${(props: { isHead?: boolean; background: string }) =>
    props.background};
  height: ${(props: { isHead?: boolean }) => (props.isHead ? '100%' : '2rem')};

  &:before {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: ${(props: { colored?: string }) => Number(props.colored)}%;
    height: 100%;
    content: '';
    background: ${(props: { volumeColor?: string; colored?: string }) =>
      props.volumeColor};
  }
`
