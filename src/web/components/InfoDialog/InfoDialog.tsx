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
  dialogStatus,
  updateDialogStatus,
}: {
  text: string
  dialogStatus: boolean
  updateDialogStatus: (newStatus: boolean) => void
}) => {
  return (
    <DialogWrapper
      open={dialogStatus}
      maxWidth="sm"
      style={{ borderRadius: '50%' }}
      onClose={() => updateDialogStatus(false)}
    >
      <ContentWrapper>
        <TextComponent>{text}</TextComponent>
        <BtnCustom
          height={'auto'}
          margin={'2rem auto 0 auto'}
          padding={'.5rem 0 .4rem 0'}
          borderRadius={'1.5rem'}
          fontSize={'1.5rem'}
          btnColor={'#0B1FD1'}
          btnWidth={'10rem'}
          onClick={() => updateDialogStatus(false)}
        >
          OK
        </BtnCustom>
      </ContentWrapper>
    </DialogWrapper>
  )
}

export default InfoDialog
