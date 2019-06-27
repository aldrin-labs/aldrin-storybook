import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {IState} from './SelectElement.types'
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SelectElement extends React.Component<IState> {
  state : IState = {
    period: 'WEEKLY',
    labelWidth: 0,
  };

  componentDidMount() {
    this.setState({
     period: 'DAY10'
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, rebalanceOption } = this.props;
    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          {/* <InputLabelCustom htmlFor="age-simple">Weekly</InputLabelCustom> */}
          
          <Select
            value={this.state.period}
            onChange={this.handleChange}
            inputProps={{
              name: 'period',
             // id: 'age-simple',
            }}
          >

            {
              rebalanceOption.map(option => {
                return <MenuItem value={option}>{option}</MenuItem>
              })
            }
           
          </Select>
        </FormControl>
       
      </form>
    );
  }
}

export default withStyles(styles)(SelectElement);