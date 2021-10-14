import React, { CSSProperties, HTMLAttributes } from 'react'
import { Tab, Tabs } from '@material-ui/core'
import styled from 'styled-components'

export interface TextInterface extends HTMLAttributes<HTMLSpanElement> {
  fontSize?: string
  paddingBottom?: string
  children: any
  style: CSSProperties
}

export const Text = styled.span`
  font-size: ${(props: TextInterface) => props.fontSize || '1.5rem'};
  padding-bottom: ${(props) => props.paddingBottom};
  text-transform: none;
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  color: ${(props) => props.color || '#ecf0f3'};
`
export const StyledTabs = styled(Tabs)`
  width: 90%;

  .MuiTabs-flexContainer {
    justify-content: center;
  }

  & > div > span {
    background: ${(props) => props.theme.customPalette.blue.serum} !important;
  }
`

export const StyledTab = styled(Tab)`
  &&& {
    min-width: auto;
    color: ${(props) => props.theme.customPalette.blue.serum};
    border-color: ${(props) => props.theme.customPalette.blue.serum};
    text-transform: capitalize;
    font-size: 1.4rem;
    font-family: Avenir Next Demi;
    white-space: nowrap;
  }
`
export const Input = styled(({ style, ...props }) => (
  <input
    {...props}
    autoComplete="off"
    onFocus={(e) => e.target.removeAttribute('readonly')}
    readOnly
  />
))`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '4.5rem'};
  color: #fff;
  font-family: Avenir Next Medium;
  border: 0.1rem solid #3a475c;
  box-sizing: border-box;
  font-size: 1.5rem;
  border-radius: 1.5rem;
  background: #222429;
  outline: none;
  padding-left: 2rem;
  padding-right: 10rem;

  // fix for autocomplete
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0px 0px 0 50px #222429 inset !important;
    -webkit-text-fill-color: #fff;
  }

  ${(props) => props.style};

  @media (max-width: 540px) {
    font-size: 1.4rem;
    height: 6rem;
  }
`
export const ListCard = styled.div`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '20rem'};
  background: #222429;
  border: 0.1rem solid #3a475c;
  border-radius: 1rem;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 0 1.6rem;
`
export const TextButton = styled.button`
  font-family: Avenir Next Medium;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: -0.457692px;
  color: ${(props) => props.color || '#f79894'};
  border: none;
  background-color: #222429;
  backgroung: #222429;
  width: ${(props) => props.width || '50%'};
  outline: none;
  cursor: pointer;
`
