import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'
import MockedToken from '@icons/ccaiToken.svg'
import { SearchInputWithLoop } from '../../Tables/components/index'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 45rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
`
const SelectorRow = styled(RowContainer)`
  border-bottom: 0.1rem solid #383b45;
  height: 5rem;
`

export const SelectCoinPopup = ({ theme, open, close }) => {
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
      <RowContainer justify={'space-between'}>
        <Text fontSize={'2rem'}>Create Pool</Text>
        <SvgIcon
          style={{ cursor: 'pointer' }}
          onClick={() => close()}
          src={Close}
        />
      </RowContainer>
      <RowContainer padding={'3rem 0'}>
        {' '}
        <SearchInputWithLoop placeholder={'Search'} />
      </RowContainer>
      <RowContainer>
        <SelectorRow justify={'space-between'}>
          <Row style={{ flexWrap: 'nowrap' }}>
            <SvgIcon src={MockedToken} width={'18px'} height={'18px'} />
            <Text
              style={{ margin: '0 0.5rem' }}
              fontSize={'2rem'}
              fontFamily={'Avenir Next Demi'}
            >
              CCAI
            </Text>
          </Row>{' '}
          <Row style={{ flexWrap: 'nowrap' }}>
            <Text
              style={{ margin: '0 0.5rem' }}
              fontSize={'2rem'}
              fontFamily={'Avenir Next Demi'}
            >
              45.3
            </Text>
          </Row>
        </SelectorRow>{' '}
        <SelectorRow justify={'space-between'}>
          <Row style={{ flexWrap: 'nowrap' }}>
            <SvgIcon src={MockedToken} width={'18px'} height={'18px'} />
            <Text
              style={{ margin: '0 0.5rem' }}
              fontSize={'2rem'}
              fontFamily={'Avenir Next Demi'}
            >
              CCAI
            </Text>
          </Row>{' '}
          <Row style={{ flexWrap: 'nowrap' }}>
            <Text
              style={{ margin: '0 0.5rem' }}
              fontSize={'2rem'}
              fontFamily={'Avenir Next Demi'}
            >
              45.3
            </Text>
          </Row>
        </SelectorRow>{' '}
        <SelectorRow justify={'space-between'}>
          <Row style={{ flexWrap: 'nowrap' }}>
            <SvgIcon src={MockedToken} width={'18px'} height={'18px'} />
            <Text
              style={{ margin: '0 0.5rem' }}
              fontSize={'2rem'}
              fontFamily={'Avenir Next Demi'}
            >
              CCAI
            </Text>
          </Row>{' '}
          <Row style={{ flexWrap: 'nowrap' }}>
            <Text
              style={{ margin: '0 0.5rem' }}
              fontSize={'2rem'}
              fontFamily={'Avenir Next Demi'}
            >
              45.3
            </Text>
          </Row>
        </SelectorRow>
      </RowContainer>
    </DialogWrapper>
  )
}
