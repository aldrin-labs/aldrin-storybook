import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  TableHeader,
  TableRow,
  Table,
  BorderButton,
  RowTd,
  TextColumnContainer,
} from '@sb/compositions/Pools/components/Tables/index.styles'

import { BlockTemplate } from '@sb/compositions/Pools/index.styles'

import TooltipIcon from '@icons/TooltipImg.svg'

import { Text } from '@sb/compositions/Addressbook/index'
import SvgIcon from '@sb/components/SvgIcon'
import { TokenIconsContainer } from '@sb/compositions/Pools/components/Tables/components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import Slider from '@sb/components/Slider/Slider'

import MockedToken from '@icons/ccaiToken.svg'

const RebalanceTable = ({
  theme,
  mockedData,
}: {
  theme: Theme
  mockedData: any
}) => {
  return (
    <RowContainer height={'75%'} align={'flex-end'}>
      <BlockTemplate
        width={'100%'}
        height={'95%'}
        style={{ marginTop: '2rem' }}
        align={'flex-end'}
        theme={theme}
        direction={'column'}
        justify={'end'}
      >
        <RowContainer padding="2rem" justify={'space-between'} align="center">
          <Text theme={theme}>Set up your allocation </Text>
          <a
            href={'https://wallet.cryptocurrencies.ai/wallet'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <BtnCustom
              theme={theme}
              onClick={() => {}}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize="1.4rem"
              padding="1rem 2.5rem"
              borderRadius="1.7rem"
              borderColor={theme.palette.blue.serum}
              btnColor={'#fff'}
              backgroundColor={theme.palette.blue.serum}
              textTransform={'none'}
              transition={'all .4s ease-out'}
              style={{ whiteSpace: 'nowrap' }}
            >
              Add Coin{' '}
            </BtnCustom>
          </a>
        </RowContainer>
        <RowContainer>
          <Table>
            <TableHeader>
              <RowTd>Asset</RowTd>
              <RowTd>Current Value</RowTd>
              <RowTd>Allocation</RowTd>
              <RowTd>Target Value</RowTd>
            </TableHeader>
            {mockedData.map((el) => {
              return (
                <TableRow>
                  <RowTd>
                    <Row justify={'flex-start'}>
                      <SvgIcon
                        src={MockedToken}
                        width={'30px'}
                        height={'30px'}
                        style={{ marginRight: '1rem' }}
                      />
                      <Text fontSize={'2rem'} fontFamily={'Avenir Next Medium'}>
                        {el.symbol}
                      </Text>
                    </Row>
                  </RowTd>
                  <RowTd>
                    <TextColumnContainer>
                      <Text
                        theme={theme}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        45.61 SOL{' '}
                      </Text>
                      <Text
                        theme={theme}
                        color={theme.palette.grey.new}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        $2,000{' '}
                      </Text>
                    </TextColumnContainer>
                  </RowTd>
                  <RowTd>
                    <Slider
                      thumbWidth="2.4rem"
                      thumbHeight="2.4rem"
                      sliderWidth="18rem"
                      sliderHeight="1.7rem"
                      sliderHeightAfter="2rem"
                      borderRadius="3rem"
                      borderRadiusAfter="3rem"
                      thumbBackground="#165BE0"
                      borderThumb="2px solid #f2fbfb"
                      trackAfterBackground={'#383B45'}
                      trackBeforeBackground={'#366CE5'}
                      value={50}
                      // onChange={handleSlideChange}
                      max={100}
                    />
                  </RowTd>{' '}
                  <RowTd>
                    <TextColumnContainer>
                      <Text
                        theme={theme}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        45.61 SOL{' '}
                      </Text>
                      <Text
                        theme={theme}
                        color={theme.palette.grey.new}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        $2,000{' '}
                      </Text>
                    </TextColumnContainer>
                  </RowTd>{' '}
                </TableRow>
              )
            })}
          </Table>
        </RowContainer>
      </BlockTemplate>
    </RowContainer>
  )
}

export default RebalanceTable
