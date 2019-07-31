import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const Wrapper = styled.div`
  & > span:last-child {
    margin: 0 4.8rem 0 0;
  }
`;

export const StyledButton = styled(({
  ...rest
}) => <Button size="small" {...rest} />)`
  margin: auto;
  font-family: DM Sans;
  font-size: 1.32rem;
  font-style: normal;
  font-weight: bold;
  font-size: 1.08rem;
  letter-spacing: .1rem;
  color: #7284A0;
  text-transform: uppercase;
`;

export const StyledArrow = styled('div')`
  width: 10px;
  height: 10px;
  margin-left: 15px;
  border-top: 1.5px solid ${props => props.color};
  border-right: 1.5px solid ${props => props.color};
  transform: rotate(45deg);
`;

export const Period = styled((
  { margin, color, ...rest }) => <span {...rest} />
)`
  margin: ${props => props.margin || '5px'};
  color: ${props => props.color};
  cursor: pointer;
  padding: 0 .64rem;
  font-family: DM Sans;
  font-size: 1.08rem;
  font-style: normal;
  font-weight: 600;
  letter-spacing: .1rem;
  text-transform: uppercase;
`;

