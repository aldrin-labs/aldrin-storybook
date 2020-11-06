import React from 'react'
import { CardText, Card } from '@sb/compositions/Rewards/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index'
import styled from 'styled-components'
import { compose } from 'recompose'

import { withTheme } from '@material-ui/styles'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const HarvestPop = styled.div``

export const HarvestPopup = (props) => {
  return (
    <DialogWrapper
      onClose={() => {
        props.toggleIsOpen()
      }}
      open={props.isHarvestPopupOpen}
    >
      <HarvestPop>
        <div
          style={{
            alignItems: 'flex-start',
          }}
        >
          <Card style={{ width: '58rem', height: '30rem' }} theme={theme}>
            <RowContainer style={{ width: '90%' }}>
              <CardText theme={theme}>Harvest will be available soon</CardText>
            </RowContainer>
            <RowContainer>
              <CardText
                fontWeight={'400'}
                theme={theme}
                style={{ width: '90%', textAlign: 'left' }}
              >
                Now you earn non-transferrable virtual DCFI tokens. Which will
                be converted into real DCFI tokens in the ratio of 1:1 exactly
                six months after it was earned.
              </CardText>
            </RowContainer>
            <RowContainer>
              <CardText
                fontWeight={'400'}
                theme={theme}
                style={{ width: '90%' }}
              >
                The start of award payments will be announced in
              </CardText>
              <CardText
                fontWeight={'400'}
                theme={theme}
                style={{ width: '90%' }}
              >
                <a
                  href="https://twitter.com/decefi_official"
                  style={{ textDecoration: 'none', color: '#c7ffd0' }}
                >
                  @Decefi_Official&nbsp;
                </a>
                <span> and </span>
                <a
                  href="https://twitter.com/CCAI_Official"
                  style={{ textDecoration: 'none', color: '#c7ffd0' }}
                >
                  &nbsp;@CCAI_Official&nbsp;
                </a>{' '}
                twitters. <strong> &nbsp;Stay tuned.</strong>
              </CardText>
            </RowContainer>
            <RowContainer>
              <BtnCustom
                theme={theme}
                btnColor={theme.palette.grey.main}
                backgroundColor={'#C7FFD0'}
                hoverBackground={'#C7FFD0'}
                height={'5rem'}
                fontSize={'1.6rem'}
                btnWidth={'50%'}
                textTransform={'none'}
                onClick={() => {
                  props.toggleIsOpen()
                }}
              >
                Ok
              </BtnCustom>
            </RowContainer>
          </Card>
        </div>
      </HarvestPop>
    </DialogWrapper>
  )
}

export default compose(withTheme())(HarvestPopup)
