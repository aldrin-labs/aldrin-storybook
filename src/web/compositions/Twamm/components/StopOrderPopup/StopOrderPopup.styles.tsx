import styled from "styled-components";
import {BtnCustom} from "@sb/components/BtnCustom/BtnCustom.styles";
import React from "react";

export const MainButtonWrapper = styled.div`
  width: 48%;
`

export const FeeInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const RedButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || 'calc(50% - .5rem)'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
    backgroundColor={props.disabled ? props.theme.palette.grey.dark : props.background || '#D54D32'}
    borderColor={props.disabled ? props.theme.palette.grey.dark : props.background || '#D54D32'}
    btnColor={props.color || props.theme.palette.white.main}
    borderRadius={'1rem'}
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`
