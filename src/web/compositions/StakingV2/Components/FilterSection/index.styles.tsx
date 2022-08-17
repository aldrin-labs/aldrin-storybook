/* eslint-disable no-nested-ternary */
import { BORDER_RADIUS, BREAKPOINTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { PADDINGS } from '@sb/components/Button'

import { RootRow } from '../../Index.styles'

type LabelContainerProps = {
  background: string
  hoverBackground?: string
  hoverColor: string
}

type SCheckboxProps = {
  color: string
  hoverColor: string
}

type LabelProps = {
  color: string
  hoverColor: string
}

type IconProps = {
  checked: boolean
  color: string
  hoverColor: string
}

type ContainerProps = {
  width?: string
}

type SortByLabelProps = {
  isActive: boolean
}

type CheckboxContainerProps = {
  marginRight?: string
}

export const SRootRow = styled(RootRow)`
  @media (min-width: ${BREAKPOINTS.sm}) {
    width: auto;
    justify-content: flex-start;
    margin: 0;
  }
  width: ${(props) => props.width || '90%'};
  justify-content: flex-start;
  transition: 0.4s ease-in;
  flex-direction: row;
  margin: 0 auto;
`
export const Container = styled.div<ContainerProps>`
  width: 100%;
  background: ${(props) => props.theme.colors.gray7};
  border-radius: ${BORDER_RADIUS.lg};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-bottom: 1em;
  height: 8em;
  padding: ${PADDINGS.xxxl};

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: ${(props) => props.width || '58%'};
    height: 6em;
    justify-content: space-between;
  }
`

export const StretchedRow = styled(RootRow)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    justify-content: space-between;
    margin: 0;
  }
`

export const LabelContainer = styled.div<LabelContainerProps>`
  background: ${(props) => props.theme.colors[props.background || 'gray16']};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${PADDINGS.md};
  border-radius: ${BORDER_RADIUS.md};
  position: relative;
  cursor: pointer;
  margin-right: 1em;
  transition: 0.5s;

  &:hover {
    label {
      color: ${(props) => props.theme.colors[props.hoverColor]};
    }
    svg {
      path {
        stroke: ${(props) => props.theme.colors[props.hoverColor]};
      }
    }
    background: ${(props) =>
      props.theme.colors[props.hoverBackground || props.background]};
  }
`
export const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 16px;
  width: 16px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  opacity: 0;
  position: absolute;
  white-space: nowrap;
`
export const StyledCheckbox = styled.div<SCheckboxProps>`
  display: inline-block;
  width: 11px;
  height: 11px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors[props.color || 'gray13']};
  border-radius: 2px;
  transition: all 150ms;
  &:hover {
    color: ${(props) => props.theme.colors[props.hoverColor || props.color]};
  }
`
export const CheckboxContainer = styled.div<CheckboxContainerProps>`
  display: inline-block;
  vertical-align: middle;
  margin-right: ${(props) => props.marginRight || '5px'};
  position: relative;
  cursor: pointer;
`
export const Icon = styled.svg<IconProps>`
  fill: none;
  stroke: ${(props) => props.theme.colors[props.color || 'gray13']};
  stroke-width: 2px;
  display: ${(props) => (props.checked ? 'block' : 'none')};
`
export const Label = styled.label<LabelProps>`
  color: ${(props) => props.theme.colors[props.color || 'gray13']};
  cursor: pointer;
  font-size: ${FONT_SIZES.sm};
  font-weight: 700;
  display: flex;
  align-items: center;

  svg {
    path {
      stroke: ${(props) => props.theme.colors.gray13};
    }
  }

  &:hover {
    svg {
      path {
        stroke: ${(props) => props.theme.colors.yellow3};
      }
    }
  }
`
export const SortByLabel = styled.div<SortByLabelProps>`
  background: ${(props) =>
    props.isActive ? props.theme.colors.gray14 : props.theme.colors.gray15};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${PADDINGS.sm};
  border-radius: ${BORDER_RADIUS.md};
  position: relative;
  cursor: pointer;
  margin-right: 1em;
  font-size: ${FONT_SIZES.sm};
  color: ${(props) =>
    props.isActive ? props.theme.colors.gray0 : props.theme.colors.gray13};
`
