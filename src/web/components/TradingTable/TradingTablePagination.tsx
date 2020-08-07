import React from 'react'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'

const StyledLabel = styled.label`
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.light) ||
    '#7284A0'};
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`

const StyledCheckox = styled(Checkbox)`
  & svg {
    width: 2rem;
    height: 2rem;
  }
`

export const PaginationBlock = ({
  theme,
  allKeys,
  specificPair,
  handleToggleAllKeys,
  handleToggleSpecificPair,
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <StyledCheckox
          id="specPair"
          checked={!specificPair}
          onChange={handleToggleSpecificPair}
          style={{ padding: '0  .4rem 0 1.2rem' }}
        />
        <StyledLabel theme={theme} htmlFor="specPair">
          all pairs
        </StyledLabel>
      </div>
      <div>
        <StyledCheckox
          id="allKeys"
          checked={allKeys}
          onChange={handleToggleAllKeys}
          style={{ padding: '0 1.2rem' }}
        />
        <StyledLabel theme={theme} htmlFor="allKeys">
          all accounts
        </StyledLabel>
      </div>
    </div>
  )
}
