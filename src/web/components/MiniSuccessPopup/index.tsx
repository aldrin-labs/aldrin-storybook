import React from 'react'
import {
  Dialog,
  DialogTitle,
} from '@material-ui/core'

import { TypographyTitle, StyledPaper } from './MiniSuccessPopup.styles';

const MiniSuccessPopup = ({
  text,
  isOpen
}: {
  text: string
  isOpen: boolean
}) => (
    <Dialog
      PaperComponent={StyledPaper}
      fullScreen={false}
      maxWidth={'md'}
      open={isOpen}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        disableTypography
        id="responsive-dialog-title"
        style={{ background: '#16253D', padding: '0' }}
      ><TypographyTitle>{text}</TypographyTitle></DialogTitle>
    </Dialog>
  );

export default MiniSuccessPopup;
