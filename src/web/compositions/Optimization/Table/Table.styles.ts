import styled from 'styled-components'
import { Card, withStyles, Theme } from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'

import { customAquaScrollBar } from '@storybook/styles/cssUtils'

export {
  AddStyled,
  StyledCard,
  Input,
  Head,
  TableInput,
  StyledTable,
  StyledTableWithoutInput,
  Col,
  Body,
  StyledDeleteIcon,
  Item,
  HeadItem,
}

const AddStyled = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.primary,
    fontSize: '2rem',
    cursor: 'pointer',
  },
}))(AddIcon)



const StyledCard = styled(Card)`
  height: 190px;
  width: 100%;
`

const Input = styled.input`
  color: ${(props: { color: boolean }) => props.color};
  box-sizing: border-box;
  background: transparent;
  border-top: none;
  border-left: none;
  border-bottom: 2px solid rgba(78, 216, 218, 0.3);
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0px;
  transition: all 0.25s ease-out;

  &:focus {
    border-bottom: 2px solid rgb(78, 216, 218);
  }
`

const Item = styled.div`
  width: calc(100% - 2px);
  position: relative;
  color: white;
  justify-content: center;
  padding: 0.5rem;
  font-family: Roboto, sans-serif;
  font-size: 1.2rem;
  font-weight: normal;
  text-align: center;
  display: flex;
  flex-flow: row nowrap;
  flex-grow: 1;
  flex-basis: 0;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0px;
  white-space: nowrap;
  background: ${(props: { background: string }) => props.background};
  
  }
`

const HeadItem = styled(Item)`
  top: -1px;
  & > p {
    font-weight: 500;
  }
`

const Head = styled.div`
  display: flex;
  width: 95%;
  flex-direction: row;
  justify-content: center;
  max-width: 50rem;
  margin: 0.5rem;
  border-bottom: 1px solid
    ${(props: { bottomCollor: string }) => props.bottomCollor};
`

const TableInput = styled.div`
  margin-left: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 95%;
`
const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background: ${(props: { background: string }) => props.background};
  transition: all 0.3s linear;
`

const StyledTableWithoutInput = styled(StyledTable)`
  width: 212px;
  min-height: 10rem;
`

const Col = styled.div`
  flex: 1;
  flex-direction: column;

  &:first-child ${Item} p {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const Body = styled.div`
  max-height: 180px;
  width: 98%;
  border-radius: 2px;
  display: flex;
  font-size: 0.8rem;
  margin: 0.5rem;
  line-height: 1.5;
  max-width: 50rem;
  overflow: auto;

  ${customAquaScrollBar};
`

const StyledDeleteIcon = styled(DeleteIcon)`
  color: ${(props: { color: boolean }) => props.color};
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0.5rem;
  font-size: 1.5rem;
  transition: opacity 0.3s ease-in;

  ${Body}:hover & {
    opacity: 1;
  }
`
