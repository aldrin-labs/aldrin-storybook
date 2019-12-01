import React from 'react'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch'

export const StyledSwitcher = styled(Switch)`
  // toggler
  & > span:first-child {
    height: auto;
    color: #ffffff;

    & span span {
      border: 0.1rem solid #e0e5ec;
      box-shadow: 0px 0.4rem 0.6rem rgba(8, 22, 58, 0.3);
    }
  }

  // bg
  && > span:last-child {
    opacity: 1;
    background-color: ${(props) => (props.checked ? '#29AC80' : '#F2F4F6;')};
    border: 0.1rem solid #e0e5ec;
  }
`

const GreenSwitcher = ({
  checked,
  handleToggle,
}: {
  checked: boolean
  handleToggle: () => void
}) => {
  return <StyledSwitcher checked={checked} onChange={handleToggle} />
}

export default GreenSwitcher
