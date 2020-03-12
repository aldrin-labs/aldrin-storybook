import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { DialogContent } from '@material-ui/core'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const TextComponent = styled.span`
  color: #7284a0;
  font-size: 2rem;
  font-family: DM Sans;
  text-align: center;
`

const ContentWrapper = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`

const InfoDialog = ({
  text,
  closeDialog,
  dialogStatus,
}: {
  text: string
  closeDialog: () => void
  dialogStatus: boolean
}) => {
  return (
    <DialogWrapper
      open={dialogStatus}
      maxWidth="sm"
      style={{ borderRadius: '50%' }}
      onClose={closeDialog}
    >
      <ContentWrapper>
        <TextComponent>{text}</TextComponent>
        <BtnCustom
          borderRadius={'8px'}
          btnColor={'#165BE0'}
          fontSize="1.5rem"
          padding="1rem"
          height="auto"
          borderWidth="2px"
          margin={'2rem auto 0 auto'}
          btnWidth={'10rem'}
          onClick={closeDialog}
        >
          OK
        </BtnCustom>
      </ContentWrapper>
    </DialogWrapper>
  )
}

export default InfoDialog
