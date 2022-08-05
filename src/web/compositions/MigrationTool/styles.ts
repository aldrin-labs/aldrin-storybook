import { BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

import { Button } from '@sb/components/Button'
import { Input } from '@sb/components/Input'
import { StretchedBlock } from '@sb/components/Layout'

const MigrationToolBlockContainer = styled(StretchedBlock)`
  min-height: 80%;
  background: ${({ theme }) => theme.colors.white6};
  border-radius: ${BORDER_RADIUS.lg};
  padding: 2em;
`

const StyledButton = styled(Button)`
  height: 4em;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ColumnStretchBlock = styled(StretchedBlock)`
  flex-direction: column;
`

const StyledLink = styled.a`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue1};
`

const StyledInput = styled(Input)`
  margin-top: 1em;
  border: 1px solid ${({ theme }) => theme.colors.white4};
  background: ${({ theme }) => theme.colors.white5};
  border-radius: ${BORDER_RADIUS.lg};

  input {
    width: 100%;
    color: ${({ theme }) => theme.colors.white1};

    &:placeholder {
      color: ${({ theme }) => theme.colors.white2};
    }
  }

  div {
    width: 100%;
  }
`

const UserLiquidityContainer = styled(ColumnStretchBlock)`
  background: ${({ theme }) => theme.colors.white5};
  padding: 3em 1.5em;
  margin-top: 1em;
  max-height: 12em;
  overflow-y: auto;

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.blue1};
  }
`

export {
  MigrationToolBlockContainer,
  StyledButton,
  ColumnStretchBlock,
  StyledLink,
  StyledInput,
  UserLiquidityContainer,
}
