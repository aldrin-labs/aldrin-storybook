import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

type RowType = {
  width?: string
  padding?: string
  height?: string
}

type BoxType = {
  height?: string
  width?: string
}

type ColumnType = {
  height?: string
  width?: string
  margin?: string
}

export const StyledModal = styled.div`
  .modal-container {
    justify-content: flex-end;
  }
  .modal-body {
    margin: 0;
    border-radius: 1.5em 1.5em 0 0;
    background: ${(props) => props.theme.colors.gray7};
    padding: 0 1em;
    height: 90%;
  }
  .modal-content {
    min-width: 35em;
  }
`

export const StyledPopupContainer = styled.div`
  width: 100%;
  border-radius: 0;
  bottom: 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    border-radius: 2em 2em 0 0;
    width: 35em;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray8};

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
    height: 7em;
  }
`

export const Row = styled.div<RowType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.padding || '0'};
  height: ${(props) => props.height || 'auto'};

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
    width: ${(props) => props.width || 'auto'};
  }
`

export const Box = styled.div<BoxType>`
  border-radius: 0.5em;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '4.5em'};
  background: ${(props) => props.theme.colors.gray6};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.5em 1em;
`
export const Column = styled.div<ColumnType>`
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || 'auto'};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
`
