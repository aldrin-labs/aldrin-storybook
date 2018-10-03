import styled from 'styled-components'
import { TypographyWithCustomColor } from '@styles/StyledComponents/TypographyWithCustomColor'
import ReactSelectComponent from '@components/ReactSelectComponent'

export const customAquaScrollBar = `
  &::-webkit-scrollbar {
    width: 3px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }`

export const TypographyFullWidth = styled(TypographyWithCustomColor)`
  width: 100%;
  flex-grow: 1;
`

export const SelectR = styled(ReactSelectComponent)`
  font-family: Roboto;
  font-size: 16px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
`

export const SelectT = styled(ReactSelectComponent)`
`

export const Span = styled.span``

export const Label = styled.label``

export const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 18px;

    height: 18px;

    cursor: pointer;
    vertical-align: middle;

    border: 1.5px solid #909294;
    border-radius: 3px;
    background-color: transparent;
  }

  & + ${Label}:hover ${Span} {
    border-color: #4ed8da;
  }

  &:checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

export const Icon = styled.i`
  padding-right: 5px;
`
