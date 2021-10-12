import React from 'react'
import styled from 'styled-components'

export const DropdownContainer = styled.div`
  height: 100%;
  position: relative;
  background: rgba(0, 0, 0, 0.001);

  &:hover .menu {
    display: block;
  }
`
export const DropwodnItem = styled.div`
  height: 100%;
  color: #7284A0;
  font-family: Avenir Next Demi, sans-serif;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  width: 12rem;
  letter-spacing: 0.01rem;
  line-height: 1.75rem;
  text-align: center;
  margin: 0 auto;
  justify-content: center;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: 0.35s all;
  padding-bottom: 0.2rem;
`

export const MenuDropdown = styled.div`
  position: absolute;
  left: 0;
  top: 4rem;
  width: 100%;
  display: none;
  z-index: 99;
  background: rgba(0, 0, 0, 0.001);
`

export const MenuDropdownInner = styled.div`
  margin-top: 0.9rem;
  background: #0E1016;
  padding: 1rem;
  border: 0.2rem solid rgb(46, 46, 46);
`

export const MenuDropdownLink = styled.div`
  height: 3.5rem;
  line-height: 3.5rem;
  width: 100%;
  text-align: center;
`