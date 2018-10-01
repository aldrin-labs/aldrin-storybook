import * as React from 'react';
import { StyledInput } from "./Input.style";

const Input = (props:any) => {
	return ( <StyledInput type="text" placeholder={props.placeholder}/> );
};
export default Input;