import React from 'react'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Button } from '../../Tables/index.styles'
import { StyledPaper } from '../index.styles'
import { Theme, withTheme } from '@material-ui/core'

import AMMAudit from '@sb/AMMAudit/AldrinAMMAuditReport.pdf'
import AMMV2_Audit from '@sb/AMMAudit/StableSwapAMMAudit.pdf'

const Popup = ({
  theme,
  open,
  close,
}: {
  theme: Theme,
  open: boolean
  close: () => void
}) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          style={{ width: 'calc(50% - 1rem)', fontFamily: 'Avenir Next Medium' }}
          isUserConfident={true}
          href={AMMAudit}
          target="_blank"
          theme={theme}
          color={theme.palette.blue.serum}
        >
          AMM Audit
        </Button>
        <Button
          style={{ width: 'calc(50% - 1rem)', fontFamily: 'Avenir Next Medium' }}
          isUserConfident={true}
          href={AMMV2_Audit}
          target="_blank"
          theme={theme}
          color={theme.palette.blue.serum}
        >
          Stable Curve Audit
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}

export const AMMAuditPopup = withTheme()(Popup)