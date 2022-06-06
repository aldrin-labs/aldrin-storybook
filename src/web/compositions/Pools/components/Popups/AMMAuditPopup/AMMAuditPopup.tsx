import { UCOLORS } from '@variables/variables'
import React from 'react'

import AMMAudit from '@sb/AMMAudit/AldrinAMMAuditReport.pdf'
import AMMV2_Audit from '@sb/AMMAudit/StableSwapAMMAudit.pdf'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { Button } from '../../Tables/index.styles'
import { StyledPaper } from '../index.styles'

const Popup = ({ open, close }: { open: boolean; close: () => void }) => {
  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between" margin="3rem 0 2rem 0">
        <Button
          style={{
            width: 'calc(50% - 1rem)',
            fontFamily: 'Avenir Next Medium',
          }}
          isUserConfident
          href={AMMAudit}
          target="_blank"
          color={UCOLORS.green4}
        >
          AMM Audit
        </Button>
        <Button
          style={{
            width: 'calc(50% - 1rem)',
            fontFamily: 'Avenir Next Medium',
          }}
          isUserConfident
          href={AMMV2_Audit}
          target="_blank"
          color={UCOLORS.green4}
        >
          Stable Curve Audit
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}

export const AMMAuditPopup = Popup
