import styled from 'styled-components'

import { Paper, Theme } from '@material-ui/core'

import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import React from 'react'
import { Loading } from '../Loading/Loading'

export const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 60rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`
export const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
  font-size: 2.5rem;
  margin-bottom: 0;
`
export const BlueButton = styled(
  ({ isUserConfident, showLoader, children, ...props }) => (
    <BtnCustom {...props}>
      {showLoader ? (
        <Loading
          color="#fff"
          size={24}
          style={{ display: 'flex', alignItems: 'center', height: '4.5rem' }}
        />
      ) : (
        children
      )}
    </BtnCustom>
  )
)`
  font-size: 1.4rem;
  height: 4.5rem;
  text-transform: capitalize;
  background-color: ${(props: { isUserConfident: boolean; theme: Theme }) =>
    props.isUserConfident
      ? props.theme.palette.blue.serum
      : props.theme.palette.grey.title};
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: ${(props: { isUserConfident: boolean }) =>
    props.isUserConfident ? '#f8faff' : '#222429'};
  border: none;
`
