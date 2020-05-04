import React from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { HeaderProperties, BlockProperties, InputRowProps } from './types'
import Switch from '@material-ui/core/Switch'

export const TerminalBlocksContainer = styled(Grid)`
  padding-top: 1rem;
  height: 90%;
`

export const TerminalHeaders = styled.div`
  display: flex;
  position: relative;
`

export const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props: HeaderProperties) => props.justify};

  width: ${(props: HeaderProperties) => props.width};
  padding: ${(props: HeaderProperties) => props.padding || '.8rem 1.5rem'};
  margin: ${(props: HeaderProperties) => props.margin || '0'};

  background: #f2f4f6;
  border: 0.1rem solid #e0e5ec;
  border-radius: 0.2rem;
`

export const HeaderLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #16253d;
  border-bottom: 0.1rem dashed #5c8cea;
  cursor: pointer;
`

export const HeaderTitle = styled.span`
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #16253d;
`

export const BlockHeader = styled(HeaderTitle)`
  color: #7284a0;
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
`

export const InputTitle = styled(HeaderTitle)`
  color: #7284a0;
  margin-right: 1rem;
`

export const TimeoutTitle = styled(HeaderTitle)`
  font-size: 1.1rem;
  text-transform: capitalize;
  border: none;
  color: #7284a0;
`

export const TargetValue = styled(HeaderTitle)`
  border: 0;
`

export const TargetTitle = styled(TargetValue)`
  color: #7284a0;
  letter-spacing: 0.1rem;
`

export const CloseHeader = styled(TerminalHeader)`
  position: absolute;
  right: 0;
  cursor: pointer;
`

export const TerminalBlock = styled(({ borderRight, ...rest }) => (
  <Grid {...rest} />
))`
  width: ${(props: BlockProperties) => props.width};
  padding: ${(props) => props.padding || '0rem 1rem 0rem 1.2rem'};
  border-right: ${(props) => props.borderRight || '0.1rem solid #abbad1'};
  position: relative;
  overflow: hidden scroll;
  height: 100%;
`

export const FieldsContainer = styled.div`
  padding: ${(props) => props.padding || '0.9rem 0 0 0'};
`

export const SubBlocksContainer = styled.div`
  width: 50%;
  border-right: ${(props) => props.needBorder && '.1rem solid #e0e5ec'};
  padding-right: 0.4rem;
`

export const InputRowContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: ${(props: InputRowProps) => props.width || '100%'};
  flex-direction: ${(props: InputRowProps) => props.direction || 'row'};
  justify-content: ${(props: InputRowProps) => props.justify};
  padding: ${(props: InputRowProps) => props.padding || '0 0 .6rem 0'};

  @media (min-width: 1921px) {
    padding-bottom: ${(props) => props.padding || '0 0 .8rem 0'};
  }
`

export const SwitcherContainer = styled.div`
  align-items: center;
  display: flex;
`

export const BluredBackground = styled.div`
  position: absolute;
  z-index: 11;
  top: -0.5rem;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(0.4rem);

  display: flex;
  justify-content: center;
  align-items: center;
`

export const BeforeCharacter = styled.span`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  z-index: 10;
  transform: translateY(-55%);
  display: ${(props) => (props.needCharacter ? 'block' : 'none')};
  font-size: 1.2rem;
  color: ${(props) => (props.beforeSymbol === '+' ? '#29AC80' : '#DD6956')};
`

export const AdditionalSettingsButton = styled(
  ({ isActive, children, ...rest }) => (
    <BtnCustom
      btnWidth="30%"
      height={'2.5rem'}
      fontSize="1.2rem"
      fontWeight="normal"
      padding="0"
      borderRadius=".8rem"
      borderColor={isActive ? '#5C8CEA' : '#E0E5EC'}
      btnColor={isActive ? '#fff' : '#7284A0'}
      backgroundColor={isActive ? '#5C8CEA' : '#F2F4F6'}
      hoverColor={'#fff'}
      hoverBorderColor={'#5C8CEA'}
      hoverBackground={'#5C8CEA'}
      transition={'all .25s ease-out'}
      textTransform="none"
      boxShadow={'0px .2rem .3rem rgba(8, 22, 58, 0.15)'}
      margin={'0 3% 0 0'}
      {...rest}
    >
      {children}
    </BtnCustom>
  )
)`
  @media (min-width: 1921px) {
    height: calc(2.5rem - 0.5rem);
    font-size: 1.1rem;
    padding-top: 0.2rem;
  }
`

export const StyledSwitch = styled(Switch)`
  height: 3rem;

  & > span:first-child {
    height: 3rem;
  }
`

const IOSSwitcherContainer = styled.div`
  .el-switch {
    display: inline-block;
    font-size: 100%;
    height: 1.6em;
    position: relative;
    .el-switch-style {
      height: 1.6em;
      left: 0;
      background: #c0ccda;
      -webkit-border-radius: 0.8em;
      border-radius: 0.8em;
      display: inline-block;
      position: relative;
      top: 0;
      -webkit-transition: all 0.3s ease-in-out;
      transition: all 0.3s ease-in-out;
      width: 3em;
      cursor: pointer;
      &:before {
        display: block;
        content: '';
        height: 1.4em;
        position: absolute;
        width: 1.4em;
        background-color: #fff;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        left: 0.1em;
        top: 0.1em;
        -webkit-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
      }
    }
    & > input[type='checkbox'] {
      display: none;
      &[disabled] + .el-switch-style {
        cursor: not-allowed;
        background-color: #d3dce6;
      }
      &:checked + .el-switch-style {
        background-color: #20a0fd;
        &:before {
          left: 50%;
        }
      }
    }
  }
`

export const Switcher = ({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) => {
  return (
    <IOSSwitcherContainer>
      <label className="el-switch">
        <input
          checked={checked}
          onChange={onChange}
          type="checkbox"
          name="switch"
        />
        <span className="el-switch-style" />
      </label>
    </IOSSwitcherContainer>
  )
}
