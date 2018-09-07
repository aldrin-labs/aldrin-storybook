import React from 'react';
import { StyledButton } from "./Button.style";
import PropTypes from "prop-types";
const Styled = (props) => {
	return (<StyledButton>Search</StyledButton>);
};
export default Styled;
Styled.propTypes = {
	content: PropTypes.string.isRequired 
}

Styled.defaultProps = {
	content: "should use propTypes"
}