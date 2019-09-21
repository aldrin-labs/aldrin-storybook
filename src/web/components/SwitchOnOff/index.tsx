import React, { useState } from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { updateSignal } from '@core/graphql/mutations/signals/updateSignal'
import { graphql } from 'react-apollo'

const SwitchWrapper = styled.div`
  position: relative;
  width: 70px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`

const Checkbox = styled.input`
  display: none;

  &:checked + label .label--switch__inner {
    margin-left: 0;
  }

  &:checked + label .label--switch__ball {
    right: 0;
  }
`

const Label = styled.label`
  display: block;
  overflow: hidden;
  cursor: pointer;
  border-radius: 20px;
`

const SwitchInner = styled.span`
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s;
  &::before,
  &::after {
    display: block;
    float: left;
    width: 50%;
    height: 34px;
    padding: 0;
    line-height: 34px;
    font-size: 14px;
    color: white;
    font-family: DM Sans;
    font-weight: bold;
    box-sizing: border-box;
  }

  &::before {
    content: 'ON';
    padding-left: 10px;
    background-color: #2f7619;
    color: #ffffff;
  }

  &::after {
    content: 'OFF';
    padding-right: 10px;
    background-color: #b93b2b;
    color: #ffffff;
    text-align: right;
  }
`

const SwitchBall = styled.span`
  display: block;
  width: 28px;
  margin: 3.5px;
  background: #ffffff;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 35px;
  border-radius: 50%;
  transition: all 0.3s;
`

const SwitchOnOff = ({
  enabled,
  _id,
  onChange,
}: {
  enabled: boolean
  _id: string
  onChange: () => void
}) => {
  return (
    <SwitchWrapper key={_id}>
      <Checkbox
        key={_id}
        type="checkbox"
        name={`onoffswitch-${_id}`}
        class="onoffswitch-checkbox"
        id={`myonoffswitch-${_id}`}
        checked={enabled}
        onChange={onChange}
      />
      <Label for={`myonoffswitch-${_id}`}>
        <SwitchInner className="label--switch__inner" />
        <SwitchBall className="label--switch__ball" />
      </Label>
    </SwitchWrapper>
  )
}

export default SwitchOnOff
