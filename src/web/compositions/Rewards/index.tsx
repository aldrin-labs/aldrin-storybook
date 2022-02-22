import React from 'react'
import styled from 'styled-components'

export const BlockContainer = styled.div``

export const Card = styled.div`
  width: 35%;
  height: 45rem;
  background-color: ${(props) =>
    props.backgroundColor || props.theme.palette.white.block};
  margin: 0.7rem 1rem;
  border-radius: 0.8rem;
  border: 0.1rem solid
    ${(props) => props.border || props.theme.palette.grey.block};
  font-family: DM Sans;
  font-size: 1.12rem;
  letter-spacing: 0.06rem;
  text-transform: uppercase;
  color: ${(props) => props.color || props.theme.palette.text.grey};
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`
export const Title = styled.div`
  color: ${(props) => props.color || props.theme.palette.text.grey};
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 2.5rem;
`
export const Text = styled.div`
  color: ${(props) => props.color || props.theme.palette.text.black};
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  line-height: 2rem;
  border-bottom: none;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 1px;
  text-transform: none;
`

export const CardText = styled(Text)`
  font-weight: ${(props) => props.fontWeight || 'bold'};
  font-size: ${(props) => props.fontSize || '1.5rem'};
  .twitterRules {
    visibility: hidden;
    position: absolute;
  }

  &:hover .twitterRules {
    z-index: 100;
    visibility: visible;
    position: absolute;
  }
`

export const Value = styled.div`
  color: ${(props) => props.color || props.theme.palette.text.black};

  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 6rem;
`
export const Button = styled.button`
  width: 80%;
  height: 30%;
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  text-transform: capitalize;
  background: ${(props) => props.color || props.theme.palette.blue.serum};
  border-radius: 2px;
  border: none;
`

export const srmVolumesInUSDT = [
  100000, 600000, 1600000, 6600000, 16600000, 41600000, 91600000, 166600000,
  266600000, 466600000,
]
export const dcfiVolumes = [
  200000, 400000, 600000, 800000, 1000000, 1200000, 1400000, 1600000, 1800000,
  2000000,
]

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  & tr:last-child td {
    border-bottom: none;
  }
`
export const TableRow = styled.tr``

export const Cell = styled.td`
  border-bottom: 0.1rem solid ${(props) => props.borderBottom || '#61d8e6'};
  width: 25%;

  color: ${(props) => props.theme.palette.dark.main};
  height: 5rem;
  text-transform: none;
  margin: 3rem 1rem;
  padding-left: 2rem;

  font-size: 1.5rem;
  white-space: nowrap;

  &:first-child {
    width: 15%;
  }
`

export const HeaderCell = styled.th`
  text-align: left;
  border-bottom: 0.1rem solid ${(props) => props.borderBottom || '#61d8e6'};
  height: 5rem;

  padding-left: 2rem;
  // border: none;
  font-size: 1.6rem;
  text-transform: capitalize;
  color: ${(props) => props.theme.palette.grey.text};
  font-size: bold;
`

export const RewardsRoute = () => {
  return <div>twamm</div>
}
