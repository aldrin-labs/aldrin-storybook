import React from 'react'
import styled from 'styled-components'
import { Theme } from "@material-ui/core"

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader } from '@sb/compositions/Pools/components/Popups/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'

import { Stroke, BlockForCoins } from './styles'
import { TextColumnContainer } from '@sb/compositions/Pools/components/Tables/index.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components'
import GreenCheckMark from '@icons/greenDoneMark.svg'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem 0;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
  overflow: hidden;
`

export const RebalancePopup = ({
  rebalanceStep,
  changeRebalanceStep,
  theme,
  open,
  close,
}: {
  rebalanceStep: 'initial' | 'pending' | 'done'
  changeRebalanceStep: (step: 'initial' | 'pending' | 'done') => void
  theme: Theme
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
      <RowContainer
        justify={'space-between'}
        style={{ borderBottom: '0.1rem solid #383B45', padding: '2rem' }}
      >
        <BoldHeader>Rebalance</BoldHeader>
        <SvgIcon
          style={{ cursor: 'pointer' }}
          onClick={() => close()}
          src={Close}
        />
      </RowContainer>
      <RowContainer style={{ maxHeight: '40rem', overflowY: 'scroll' }}>
        <Stroke>
          <Row>
            <BlockForCoins symbols={['SOL']} />
          </Row>
          <Row>
            <TextColumnContainer style={{ alignItems: 'flex-end' }}>
              <Row padding={'1rem'}>
                <Text
                  theme={theme}
                  color={theme.palette.grey.new}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  Est. Slippage:
                </Text>
                 
                <Text
                  theme={theme}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  0.1%
                </Text>
              </Row>

              <Row>
                <Text
                  theme={theme}
                  color={theme.palette.grey.new}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  Est. Price:
                </Text>
                 
                <Text
                  theme={theme}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  1 SOL = 0.001 BTC
                </Text>
              </Row>
            </TextColumnContainer>
          </Row>
        </Stroke>{' '}
        <Stroke>
          <Row>
            <BlockForCoins />
          </Row>
          <Row>
            <TextColumnContainer style={{ alignItems: 'flex-end' }}>
              <Row padding={'1rem'}>
                <Text
                  theme={theme}
                  color={theme.palette.grey.new}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  Est. Slippage:
                </Text>
                 
                <Text
                  theme={theme}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  0.1%
                </Text>
              </Row>

              <Row>
                <Text
                  theme={theme}
                  color={theme.palette.grey.new}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  Est. Price:
                </Text>
                 
                <Text
                  theme={theme}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  1 SOL = 0.001 BTC
                </Text>
              </Row>
            </TextColumnContainer>
          </Row>
        </Stroke>{' '}
        <Stroke>
          <Row>
            <BlockForCoins />
          </Row>
          <Row>
            <TextColumnContainer style={{ alignItems: 'flex-end' }}>
              <Row padding={'1rem'}>
                <Text
                  theme={theme}
                  color={theme.palette.grey.new}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  Est. Slippage :
                </Text>
                 
                <Text
                  theme={theme}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  0.1%
                </Text>
              </Row>

              <Row>
                <Text
                  theme={theme}
                  color={theme.palette.grey.new}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  Est. Price :
                </Text>
                 
                <Text
                  theme={theme}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.4rem',
                  }}
                >
                  1 SOL = 0.001 BTC
                </Text>
              </Row>
            </TextColumnContainer>
          </Row>
        </Stroke>
      </RowContainer>
      <RowContainer
        style={{ borderTop: '1px solid #383B45' }}
        height={'15rem'}
        padding={'2rem'}
      >
        {rebalanceStep === 'initial' && (
          <RowContainer direction={'column'}>
            <RowContainer justify={'space-between'}>
              <Text
                theme={theme}
                color={theme.palette.grey.new}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '1.6rem',
                }}
              >
                Est. Fees Amount
              </Text>
              <Row>
                <Text
                  theme={theme}
                  fontFamily={'Avenir Next Demi'}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.9rem',
                  }}
                >
                  $
                </Text>
                
                <Text
                  theme={theme}
                  color={'#A5E898'}
                  fontFamily={'Avenir Next Demi'}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '1.9rem',
                  }}
                >
                  2.00
                </Text>
              </Row>
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <BtnCustom
                theme={theme}
                onClick={() => close()}
                needMinWidth={false}
                btnWidth="calc(50% - 1rem)"
                height="auto"
                fontSize="1.4rem"
                padding="1.5rem 8rem"
                borderRadius="1.1rem"
                borderColor={'#f2fbfb'}
                btnColor={'#fff'}
                backgroundColor={'none'}
                textTransform={'none'}
                margin={'4rem 0 0 0'}
                transition={'all .4s ease-out'}
                style={{ whiteSpace: 'nowrap' }}
              >
                Cancel{' '}
              </BtnCustom>
              <BtnCustom
                theme={theme}
                onClick={() => {
                  changeRebalanceStep('pending')
                }}
                needMinWidth={false}
                btnWidth="calc(50% - 1rem)"
                height="auto"
                fontSize="1.4rem"
                padding="1.5rem 8rem"
                borderRadius="1.1rem"
                borderColor={theme.palette.blue.serum}
                btnColor={'#fff'}
                backgroundColor={theme.palette.blue.serum}
                textTransform={'none'}
                margin={'4rem 0 0 0'}
                transition={'all .4s ease-out'}
                style={{ whiteSpace: 'nowrap' }}
              >
                Start Rebalance
              </BtnCustom>
            </RowContainer>
          </RowContainer>
        )}
        {rebalanceStep === 'pending' && (
          <RowContainer
            style={{ height: '100%', alignItems: 'center', display: 'flex' }}
            direction={'column'}
          >
            {' '}
            <Loading color={'#F29C38'} size={42} />
            <Text color={'#F29C38'} style={{ marginTop: '1rem' }}>
              Pending
            </Text>
          </RowContainer>
        )}
        {rebalanceStep === 'done' && (
          <RowContainer
            style={{ height: '100%', alignItems: 'center', display: 'flex' }}
            direction={'column'}
          >
            <SvgIcon src={GreenCheckMark} width={'3rem'} height={'3rem'} />{' '}
            <Text color={'#A5E898'} style={{ marginTop: '1rem' }}>
              Done
            </Text>
          </RowContainer>
        )}
      </RowContainer>
    </DialogWrapper>
  )
}
