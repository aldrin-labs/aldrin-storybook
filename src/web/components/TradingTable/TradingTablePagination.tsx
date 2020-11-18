import React from 'react'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'

import { Loading } from '@sb/components'

export const StyledLabel = styled.label`
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

export const StyledCheckox = styled(Checkbox)`
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
  loading,
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <StyledCheckox
          id="specPair"
          checked={specificPair}
          onChange={handleToggleSpecificPair}
          style={{ padding: '0  .4rem 0 1.2rem' }}
        />
        <StyledLabel theme={theme} htmlFor="specPair">
          hide other pairs
        </StyledLabel>
      </div>
      <div>
        <StyledCheckox
          id="allKeys"
          checked={!allKeys}
          onChange={handleToggleAllKeys}
          style={{ padding: '0 1.2rem' }}
        />
        <StyledLabel theme={theme} htmlFor="allKeys">
          hide other accounts
        </StyledLabel>
      </div>
      <div
        style={{
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loading && <Loading size={16} style={{ height: '16px' }} />}
      </div>
    </div>
  )
}
