import styled from 'styled-components'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'

export const SelectR = styled(ReactSelectComponent)`
  width: 9rem;
  font-size: 0.8rem;
  display: flex;
`

export const SelectContainer = styled.div`
  border-radius: 24px;
  border: 2px solid ${(props: { border: string }) => props.border};
  padding: 0 16px;
  height: 38px;
  place-content: center;
  display: flex;
  width: 130px;
  background: transparent;
`
