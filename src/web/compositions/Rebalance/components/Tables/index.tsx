import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  TableHeader,
  TableRow,
  Table,
  TableBody,
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
    <RowContainer height={'80%'} align={'flex-end'}>
      <BlockTemplate
        width={'100%'}
        height={'100%'}
        align={'flex-end'}
        theme={theme}
        direction={'column'}
        justify={'end'}
      >
        <RowContainer
          height={'10rem'}
          padding="2rem"
          justify={'space-between'}
          align="center"
          style={{ borderBottom: '0.1rem solid #383B45' }}
        >
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
        <RowContainer
          align="flex-start"
          style={{ height: 'calc(100% - 15rem)', overflow: 'scroll' }}
        >
          <Table>
            <TableHeader>
              <RowTd>Asset</RowTd>
              <RowTd>Current Value</RowTd>
              <RowTd>Allocation</RowTd>
              <RowTd>Target Value</RowTd>
            </TableHeader>
            <TableBody>
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
                        <Text
                          fontSize={'2rem'}
                          fontFamily={'Avenir Next Medium'}
                        >
                          {el.symbol}
                        </Text>
                      </Row>
                    </RowTd>
                    <RowTd>
                      <TextColumnContainer>
                        <Text
                          theme={theme}
                          style={{
                            whiteSpace: 'nowrap',
                            paddingBottom: '1rem',
                          }}
                        >
                          {el.amount} {el.symbol}
                        </Text>
                        <Text
                          theme={theme}
                          color={theme.palette.grey.new}
                          style={{
                            whiteSpace: 'nowrap',
                            paddingBottom: '1rem',
                          }}
                        >
                          ${el.tokenValue.toFixed(2)}
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
                          style={{
                            whiteSpace: 'nowrap',
                            paddingBottom: '1rem',
                          }}
                        >
                          {el.targetAmount || 0} {el.symbol}
                        </Text>
                        <Text
                          theme={theme}
                          color={theme.palette.grey.new}
                          style={{
                            whiteSpace: 'nowrap',
                            paddingBottom: '1rem',
                          }}
                        >
                          {el.targetTokenValue || 0}$
                        </Text>
                      </TextColumnContainer>
                    </RowTd>{' '}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </RowContainer>
        <RowContainer
          height={'5rem'}
          padding="0 2rem"
          justify={'space-between'}
          align="center"
          style={{ borderTop: '0.1rem solid #383B45' }}
        >
          <Text theme={theme}>
            Want to earn fees from Rebalance transactions? Add liquidity!{' '}
          </Text>
          <a
            href={'/pools'}
            style={{
              textDecoration: 'none',
              fontFamily: 'Avenir Next Medium',
              fontSize: '1.5rem',
              textAlign: 'right',
              letterSpacing: '-0.523077px',
              color: '#A5E898',
            }}
          >
            View Pools
            <svg
              style={{ marginLeft: '1rem' }}
              width="13"
              height="8"
              viewBox="0 0 13 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.3536 4.35355C12.5488 4.15829 12.5488 3.84171 12.3536 3.64645L9.17157 0.464467C8.97631 0.269205 8.65973 0.269205 8.46447 0.464467C8.2692 0.659729 8.2692 0.976311 8.46447 1.17157L11.2929 4L8.46447 6.82843C8.2692 7.02369 8.2692 7.34027 8.46447 7.53553C8.65973 7.7308 8.97631 7.7308 9.17157 7.53553L12.3536 4.35355ZM-4.37114e-08 4.5L12 4.5L12 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                fill="#A5E898"
              />
            </svg>
          </a>
        </RowContainer>
      </BlockTemplate>
    </RowContainer>
  )
}

export default RebalanceTable
