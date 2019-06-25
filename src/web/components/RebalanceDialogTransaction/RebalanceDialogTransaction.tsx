import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { GridCustom, DialogWrapper, DialogTitleCustom, DialogSubTitle, TypographyTopDescription, LinkCustom } from "./RebalanceDialogTransaction.styles";
import SvgIcon from '../../components/SvgIcon'
import Stroke from '../../../icons/Stroke.svg'

import TransactionTable from './TransactionTable'
import { borderRadius } from 'react-select/lib/theme'

import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import AccordionTable from './AccordionTable'
// TODO chnage png => svg 
import Ellipse from '../../../icons/Ellipse.svg'

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

class RebalanceDialogTransaction extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      dialogHedaing,
      titleDescription,
      subTitleDescription,
      fee,
      btnFirst,
      btnSecond,
      accordionTitle,
      data
    } = this.props;


    return (
      <div>
        <LinkCustom background={Stroke} onClick={this.handleClickOpen}>
          <SvgIcon width='90' height='90' src={Ellipse} />
        </LinkCustom>

        <DialogWrapper
          style={{borderRadius: "50%"}}
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <DialogTitleCustom id="customized-dialog-title" onClose={this.handleClose}>
              <Typography color="primary">{dialogHedaing}</Typography>
          </DialogTitleCustom>

          <DialogContent justify="center">
            <TypographyTopDescription style={{textAlign: "center"}}>
                {titleDescription}
            </TypographyTopDescription>

            <TypographyTopDescription>
                {subTitleDescription} {fee}
            </TypographyTopDescription>

            <GridCustom container justify="center">
              <BtnCustom onClick={this.handleClose} btnColor="#D93B28">
                { btnFirst }
              </BtnCustom>

              <BtnCustom btnColor="#5085EC" >
                { btnSecond }
              </BtnCustom>
            </GridCustom>

            {/* <DialogSubTitle id="customized-dialog-sub-title">
                <Typography>{accordionTitle}</Typography>
            </DialogSubTitle> */}

            <AccordionTable accordionTitle={accordionTitle} data={data} accordionTitle={accordionTitle}/>

            {/* <TransactionTable /> */}

          </DialogContent>
        </DialogWrapper>
      </div>
    );
  }
}

export default RebalanceDialogTransaction;