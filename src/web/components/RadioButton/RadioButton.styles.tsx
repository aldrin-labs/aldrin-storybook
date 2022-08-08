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
    top: 2px;
    left: 2px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.green3};
  }
`

const Input = styled.span<{ checked: boolean }>`
  display: none;
  ${(props: { checked: boolean }) =>
    props.checked
      ? `
  & ~ ${Checkmark} {
    border: 1px solid ${props.theme.colors.green3};
    transition: all 0.25s ease-in-out;

    &:after {
      display: block;
    }
  }
  `
      : ''}
`

export { Label, Input, Checkmark, Container, AttributeContainer }
