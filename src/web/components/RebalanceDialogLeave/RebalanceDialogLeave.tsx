import React, { useState } from 'react'
import { Dialog } from '@material-ui/core'
import {
  TypographyCustomHeading,
  GridCustom,
  DialogContent,
  DialogTitleCustom,
  TypographyTopDescription,
  StyledPaper,
} from '@sb/components/RebalanceDialogTransaction/RebalanceDialogTransaction.styles'
import AccordionTable from '@sb/components/RebalanceDialogTransaction/AccordionTable'
import RebalanceSlippageSlider from '@sb/components/RebalanceSlippageSlider'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const RebalanceDialogLeave = ({
  visible = false,
  slippageValue,
  onChangeSlippage,
  handleClose,
  handleConfirm,
  transactionsData,
}) => {
  const [isFinished, setFinished] = useState(false)
  const [showLoader, setLoader] = useState(true)

  const isCompletedTransaction = () => {
    setFinished(true)
    setLoader(false)
  }
  return (
    <Dialog
      PaperComponent={StyledPaper}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={visible}
    >
      <DialogTitleCustom id="customized-dialog-title" onClose={handleClose}>
        <TypographyCustomHeading
          fontWeight={'bold'}
          borderRadius={'1rem'}
          // color={black.custom}
        >
          {`Leave rebalance`}
        </TypographyCustomHeading>
      </DialogTitleCustom>
      <DialogContent justify="center" style={{ borderRadius: '20px' }}>
        <TypographyTopDescription margin="20px auto 32px auto">
          If you leave this page your rebalance processing will be canceled.
        </TypographyTopDescription>
        <GridCustom>
          <RebalanceSlippageSlider
            disabled={true}
            slippageValue={slippageValue}
            onChangeSlippage={onChangeSlippage}
          />
        </GridCustom>
        <GridCustom container justify="center">
          <BtnCustom
            height="40px"
            borderRadius={'1rem'}
            btnWidth="15rem"
            onClick={handleConfirm}
            color={'#b93b2b'}
            margin="0 5px"
          >
            Cancel and leave
          </BtnCustom>
          <BtnCustom
            height="40px"
            borderRadius={'1rem'}
            btnWidth="15rem"
            color={'#165be0'}
            margin="0 5px"
            onClick={handleClose}
          >
            wait for execution
          </BtnCustom>
        </GridCustom>

        <AccordionTable
          accordionTitle={'Status'}
          transactionsData={transactionsData}
          getError={() => {}}
          isCompleted={isCompletedTransaction}
          isFinished={isFinished}
          showLoader={showLoader}
        />
      </DialogContent>
    </Dialog>
  )
}

export default RebalanceDialogLeave
