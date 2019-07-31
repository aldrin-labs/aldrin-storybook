import React from 'react'
import styled from 'styled-components'
import {
  Typography,
  Button,
  IconButton,
  DialogTitle,
  FormControlLabel
} from '@material-ui/core'

import { Link } from 'react-router-dom';

export const ButtonShare = styled(Button)`
  background: ${props => props.active ? '#165be0' : '#FFFFFF'};
  color: ${props => props.active ? '#fff' : '#7284A0'};
  padding: ${props => props.padding || '1rem 2.5rem'};
  border: 2px solid #e0e5ec;
  box-sizing: border-box;
  border-radius: 24px;
  font-size: 1rem;

  &:hover {
    color: #fff;
    background-color: #165be0;
    border: 2px solid #165be0;
  }
`

export const StyledButton = styled(({ padding, ...rest }) => <Button {...rest} />)`
  padding: ${props => props.padding || '.5rem 1rem'};
  font-weight: bold;
  border-radius: 12px;
  border: 1.5px solid #165BE0;
  color: #165BE0;
`;

export const ClearButton = styled(IconButton)`
  color: #B93B2B;
  padding: .5rem;
`

export const Line = styled.div`
  content: '';
  width: 100%;
  background-color: #E0E5EC;
  margin-left: 1rem;
  height: 1px;
`;

export const SLink = styled(Link)`
  text-decoration: none;
  color: #165BE0;
`;

export const TypographySectionTitle = styled(Typography)`
  padding: .5rem 0;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1.16rem;
  line-height: 23px;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  color: #16253D;
`
export const TypographySubTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 31px;
  color: #7284a0;
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  line-height: 31px;
  color: #7284a0;
`

export const TypographyFooter = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  text-transform: uppercase;
  line-height: 31px;
  color: #fff;
`

export const DialogFooter = styled(DialogTitle)`
  text-align: center;
  color: #fff;
  background: #2f7619;
  border-radius: 0px 0px 20px 20px;
`
// TODO: replace inline to styled components
// styled components just doesnt effect

export const FormInputTemplate = ({
  name,
  handleChange,
  children,
}) => (
    <StyledInputTemplate
      value={name}
      label={name}
      labelPlacement="start"
      onChange={handleChange}
      control={children}
    />
  )

export const StyledInputTemplate = styled(FormControlLabel)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  flex-basis: 45%;
  margin-left: 0;

  & > span {
    color: #7284A0;
    font-size: 1rem;
  }
`;

export const StyledTextField = styled.input`
  width: 80%;
  padding: .8rem;
  border-radius: 8px;
  margin-left: -.8rem;
  border: 1px solid #EAECEE;
  color: #7284A0;
  font-size: 1rem;

  &::placeholder {
    color: #7284A0;
    font-size: 1rem;
  }
`;
