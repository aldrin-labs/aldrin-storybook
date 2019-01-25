import styled from 'styled-components'

// put overflow-x hidden since
// we dont need it to horizontal scrollbar
// on whole page
export const AppGridLayout = styled.div`
  overflow-x: hidden;
  min-height: calc(100vh - 50px);
`
