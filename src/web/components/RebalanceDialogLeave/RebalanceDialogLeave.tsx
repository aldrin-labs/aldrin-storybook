import React, { useState, useEffect } from 'react'
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

import { StyledLink } from './RebalanceDialogLeave.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const RebalanceDialogLeave = ({
  visible = false,
  lastLocation,
  slippageValue,
  onChangeSlippage,
  handleClose,
  transactionsData,
  hideLeavePopup,
}) => {
  const [isFinished, setFinished] = useState(false)
  const [showLoader, setLoader] = useState(true)

  const isCompletedTransaction = () => {
    setFinished(true)
    setLoader(false)
  }

  const lineStatuses = transactionsData.map((t) => t.isDone).join('')

  useEffect(() => {
    const transactionStatuses = transactionsData.map((t) => t.isDone)
    const consistFailTransaction = transactionStatuses.includes('fail')
    const consistLoadingTransaction =
      transactionStatuses.includes('loading') ||
      transactionStatuses.includes(null)

    if (consistFailTransaction || !consistLoadingTransaction) hideLeavePopup()
  }, [lineStatuses])

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
        <TypographyTopDescription
          margin="3rem auto 2rem"
          style={{ color: '#16253D' }}
        >
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
          <StyledLink
            href={lastLocation && `${location.origin}${lastLocation.pathname}`}
            target={'_blank'}
            rel={'noreferrer noopener'}
          >
            open in a new tab
          </StyledLink>
          <BtnCustom
            height="4rem"
            fontSize={'1.2rem'}
            borderRadius={'1rem'}
            btnWidth="17rem"
            color={'#2F7619'}
            margin="0 .6rem"
            padding={'.5rem 0 .2rem 0'}
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
