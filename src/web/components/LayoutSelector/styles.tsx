import styled from 'styled-components'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'

export const SelectR = styled(ReactSelectComponent)`
  width: 14.4rem;
  font-size: 1.28rem;
  display: flex;
`

export const SelectContainer = styled.div`
  margin-left: 1.12rem;
  border-radius: 0;
  border: 2px solid ${(props: { border: string }) => props.border};
  padding: 0 16px;
  height: 38px;
  place-content: center;
  display: flex;
  background: transparent;
`

export const OptionContainer = styled.div`
  display: flex;
`
