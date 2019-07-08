import styled from 'styled-components'
import Select from 'react-select'

export const SelectCustom = styled(Select)`
  font-family: 'DM Sans', sans-serif;
  width: 100px;
  font-size: 12px;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-weight: bold;
  letter-spacing: 1px;
  background: transparent;
  
`

export const CustomOption = styled.div`
  display: flex;
  justify-content: center;
  color: #7284a0;
  text-align: center;
  padding: 5px 3px;
  font-size: 11px;
  text-transform: capitalize;
  line-height: 15px;
  cursor: pointer;
  &:hover {
    color: black;
    border-radius: 24px;
    background: #e7ecf3;
  }
  &:last-child {
    border-top: 1px solid #e7ecf3;
    color: #d93b28;
  }
`

// export const Note = ({ Tag = 'span', ...props }: { Tag?: string }) => (
//   <Tag
//     css={{
//       color: 'hsl(0, 0%, 40%)',
//       display: 'inline-block',
//       fontSize: 12,
//       fontStyle: 'italic',
//       marginTop: '1em',
//     }}
//     {...props}
//   />
// )
