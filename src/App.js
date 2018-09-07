import React, { Component } from 'react';
import PropTypes from "prop-types";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";
import { StyledApp } from "./App.style.js";
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      placeholders: [
      "First Name",
      "Second Name",
      "Passport ID"
      ]
    };
  }
  render() {
    const listItems = this.state.placeholders.map((text, i) => <Input key={i} placeholder={text}/> );
    return (
      <StyledApp>
      {listItems}
      <Button />
      </StyledApp>
      );
  }
}
console.clear();
export default App;
App.propTypes = {
  content: PropTypes.string.isRequired 
}

App.defaultProps = {
  content: "should use propTypes"
}