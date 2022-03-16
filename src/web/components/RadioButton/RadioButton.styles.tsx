import { COLORS } from '@variables/variables'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
`

const AttributeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 13px;
`

const Label = styled.label`
  position: relative;
  padding-left: 16px;
  cursor: pointer;
  font-size: 11px;
  color: #818181;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover {
    color: #4eb3ff;
  }
`

const Checkmark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 13px;
  width: 13px;
  border: 1px solid #818181;
  border-radius: 50%;
  &::after {
    content: '';
    position: absolute;
    display: none;
    top: 1.5px;
    left: 1.5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${COLORS.newGreen};
  }
`

const Input = styled.input`
  display: none;
  &:checked ~ ${Checkmark} {
    border: 1px solid ${COLORS.newGreen};
    transition: all 0.25s ease-in-out;
  }
  &:checked ~ ${Checkmark}:after {
    display: block;
  }
`

export { Label, Input, Checkmark, Container, AttributeContainer }
