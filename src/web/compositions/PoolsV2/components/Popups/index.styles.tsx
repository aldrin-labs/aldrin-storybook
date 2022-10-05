import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

type RowType = {
  width?: string
  padding?: string
  height?: string
  margin?: string
}

type BoxType = {
  height?: string
  width?: string
  padding?: string
}

type ColumnType = {
  height?: string
  width?: string
  margin?: string
  justify?: string
  overflow?: string
}

export const StyledModal = styled.div`
  .modal-container {
    justify-content: flex-end;
  }
  .modal-body {
    width: 39em;
    height: 45em;
    margin: 0;
    border-radius: 1.5em 1.5em 0 0;
    background: ${(props) => props.theme.colors.modal};
    padding: 0 1.5em;
  }
  .modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
  border-bottom: 1px solid ${(props) => props.theme.colors.white5};

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
  margin: ${(props) => props.margin || '0'};

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
    width: ${(props) => props.width || 'auto'};
  }
`

export const Box = styled.div<BoxType>`
  border-radius: 0.7em;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '4.5em'};
  background: ${(props) => props.theme.colors.white5};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${(props) => props.padding || '0.5em 1em'};
  border: 1px solid ${(props) => props.theme.colors.white4};
`
export const Column = styled.div<ColumnType>`
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || 'auto'};
  display: flex;
  justify-content: ${(props) => props.justify || 'space-between'};
  flex-direction: column;
  align-items: flex-start;
  margin: ${(props) => props.margin || '0'};
  overflow: ${(props) => props.overflow || 'hidden'};
`

export const SmallModal = styled.div`
  padding: 0 1em 1em 1em;
  display: flex;
  height: 100%;
  width: 35em;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
