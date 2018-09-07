import React from 'react';
import PropTypes from "prop-types";
import { StyledInput } from "./Input.style.js";
const Input = (props) => {
	return ( <StyledInput type="text" placeholder={props.placeholder}/> );
};
export default Input;
Input.propTypes = {
	content: PropTypes.string.isRequired 
}

Input.defaultProps = {
	content: "should use propTypes"
}