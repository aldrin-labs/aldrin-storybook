import * as React from 'react';
import { StyledApp } from './App.style';
import Button from './components/Button/Button' 
import Input from './components/Input/Input' 
class App extends React.Component {
  render() {
    return (
      <StyledApp>
        <Input placeholder="Input" />
        <Button>Click</Button>
      </StyledApp>
      );
  }
}
export default App;