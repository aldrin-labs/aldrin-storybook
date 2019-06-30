import React from 'react'
import ReactDOM from 'react-dom'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import FilledInput from '@material-ui/core/FilledInput'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { NativeSelectCustom } from './SelectElement.styles'

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 80,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

class SelectElement extends React.Component {
  state = {
    period: '',
    name: 'hai',
    labelWidth: 0,
  }

  componentDidMount() {
    this.setState({
      labelWidth: 0,
    })
  }

  handleChange = (name) => (event) => {
    this.props.setRebalanceTimer();
    this.setState({ [name]: event.target.value });
  }

  render() {
    const { classes, rebalanceOption } = this.props

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          {/* <button onClick={this.props.setRebalanceTimer}>555</button> */}
          <NativeSelectCustom
            value={this.state.period}
            onChange={this.handleChange('period')}
            input={
              <Input name="period" id="period-native-label-placeholder" />
            }
          >
            {rebalanceOption.map((option) => {
              return <option value={option}>{option}</option>
            })}
          </NativeSelectCustom>
        </FormControl>
      </div>
    )
  }
}

export default withStyles(styles)(SelectElement)
