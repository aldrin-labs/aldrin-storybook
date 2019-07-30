import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const StyledButton = styled(({
  ...rest
}) => <Button size="small" {...rest} />)`
  height: 40px;
  padding: 6px 8px 5px 8px;
  margin: auto;
  font-family: DM Sans;
  font-size: .825rem;
  font-style: normal;
  font-weight: bold;
  font-size: 0.875rem;
  letter-spacing: 1.5px;
  color: ##7284A0;
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
  { margin, color, ...rest }) => <span {...rest} />)`
  position: relative;
  top: 2px;
  cursor: pointer;
  padding: 5px;
  margin: ${props => props.margin || '5px'};
  color: ${props => props.color};

  font-family: DM Sans;
  font-size: .825rem;
  font-style: normal;
  font-weight: bold;
  font-size: 0.875rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  @media (min-width: 2560px) {
    top: 7px;
  }
`;
