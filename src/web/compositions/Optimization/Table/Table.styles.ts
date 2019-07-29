import styled from 'styled-components'
import { Card, withStyles, Theme } from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'

import { customAquaScrollBar } from '@sb/styles/cssUtils'

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
    fontSize: '3.2rem',
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
  padding: 0.8rem;
  font-family: Roboto, sans-serif;
  font-size: 1.92rem;
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

  && .custom-async-select-box {
    width: 100%;
    border-bottom: 2px solid ${(props: { color?: string }) => props.color};
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-bottom: 2px solid ${(props: { secondary?: string }) => props.secondary};
    }
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
  max-width: 80rem;
  margin: 0.8rem;
  border-bottom: 1px solid
    ${(props: { bottomCollor: string }) => props.bottomCollor};
`

const TableInput = styled.div`
  margin-left: 0.8rem;
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
  min-height: 16rem;
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
  font-size: 1.28rem;
  margin: 0.8rem;
  line-height: 1.5;
  max-width: 80rem;
  overflow: auto;

  ${customAquaScrollBar};
`

const StyledDeleteIcon = styled(DeleteIcon)`
  color: ${(props: { color: boolean }) => props.color};
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0.8rem;
  font-size: 2.4rem;
  transition: opacity 0.3s ease-in;

  ${Body}:hover & {
    opacity: 1;
  }
`
