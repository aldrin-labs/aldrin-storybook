import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import { TextButton } from '@sb/compositions/Rebalance/Rebalance.styles'
import React from 'react'
import { RoundButton } from '../Staking.styles'
import { RoundInputWithTokenName } from './Input'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import { MAIN_BLOCK, } from '../Staking.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { SvgIcon } from '@sb/components'

import pinkBackground from './assets/pinkBackground.png'

import { Row, RootRow, StyledTextDiv } from '../Staking.styles'
import { Block, BlockTitle, BlockContent, BlockSubtitle } from '../../../components/Block'
import { Cell, StretchedBlock } from '../../../components/Layout'

interface StakingComponentProps {
  isBalancesShowing: boolean
}
export const StakingComponent: React.FC<StakingComponentProps> = ({
  isBalancesShowing,
}) => {
  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6} >
          <Block>
            <BlockContent border>
              <StretchedBlock>
                <div>
                  <StretchedBlock>
                    <BlockTitle>
                      Your RIN Staking
                  </BlockTitle>
                    <Row>
                      <SvgIcon
                        src={isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye}
                        width={'1.5em'}
                        height={'auto'}
                      />
                    </Row>
                  </StretchedBlock>
                  <StyledTextDiv>
                    GHvybfUhsKxmWvrVZ5KDdWQGPCYSZoRKefWYyVyRHGYc
                  </StyledTextDiv>
                </div>
                <div>
                  <BlockSubtitle>
                    Available in wallet:
                  </BlockSubtitle>
                  <Text
                    color={'#96999C'}
                    fontFamily={'Avenir Next Demi'}
                    fontSize={'1.8rem'}
                  >
                    <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>0</span> RIN
                  </Text>
                </div>
              </StretchedBlock>

            </BlockContent>
            <BlockContent>
              asd
          </BlockContent>
          </Block>
        </Cell>
        <Cell col={12} colLg={6}>
          <Row>
            <Cell colLg={6}>
              <Block>
                <BlockContent>
                  <BlockTitle>Total Staked</BlockTitle>
                </BlockContent>
              </Block>
            </Cell>
            <Cell colLg={6}>
              <Block backgroundImage={pinkBackground}>
                <BlockContent>
                  <BlockTitle>Estimated Rewards</BlockTitle>
                </BlockContent>
              </Block>
            </Cell>
          </Row>
          <Row>
            <Cell>
              <Block>
                <BlockContent>
                  <BlockTitle>RIN Stats</BlockTitle>
                </BlockContent>
              </Block>
            </Cell>
          </Row>
        </Cell>
      </RootRow>
    </>
    // <BlockTemplate
    //   direction={'column'}
    //   theme={theme}
    //   style={MAIN_BLOCK(isMobile)}
    // >
    //   <RowContainer
    //     height={'33%'}
    //     justify={'space-between'}
    //     padding="3rem"
    //     style={{ borderBottom: '0.2rem solid #383B45' }}
    //   >
    //     <Row
    //       width={'60%'}
    //       height={'100%'}
    //       direction={'column'}
    //       justify={'space-between'}
    //     >
    //       <RowContainer justify={'space-between'}>
    //         <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
    //           Your RIN Staking{' '}
    //         </Text>
    //         <Row>
    //           <SvgIcon
    //             src={isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye}
    //             width={'2.7rem'}
    //             height={'auto'}
    //           />
    //         </Row>
    //       </RowContainer>
    //       <StyledTextDiv>
    //         GHvybfUhsKxmWvrVZ5KDdWQGPCYSZoRKefWYyVyRHGYc
    //       </StyledTextDiv>
    //     </Row>
    //     <Row
    //       width={'30%'}
    //       height={'100%'}
    //       direction={'column'}
    //       justify={'space-between'}
    //       align={'flex-end'}
    //     >
    //       <Text
    //         color={'#96999C'}
    //         fontFamily={'Avenir Next Demi'}
    //         fontSize={'1.8rem'}
    //         style={{ lineHeight: '4rem' }}
    //       >
    //         Available in wallet:
    //       </Text>{' '}
    //       <Text
    //         color={'#96999C'}
    //         fontFamily={'Avenir Next Demi'}
    //         fontSize={'1.8rem'}
    //       >
    //         <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>0</span> RIN
    //       </Text>
    //     </Row>
    //   </RowContainer>{' '}
    //   <RowContainer padding="3rem" height={'67%'}>
    //     <RowContainer justify={'space-between'} height={'50%'}>
    //       <BlockTemplate
    //         direction={'column'}
    //         align="flex-start"
    //         justify={'space-between'}
    //         theme={theme}
    //         padding="3rem"
    //         background="#383b45"
    //         width={'27%'}
    //       >
    //         <Text
    //           color={'#96999C'}
    //           fontFamily={'Avenir Next Demi'}
    //           fontSize={'1.8rem'}
    //           padding={'0 0 2rem 0'}
    //           style={{ whiteSpace: 'nowrap' }}
    //         >
    //           Total Staked:
    //         </Text>{' '}
    //         <Text
    //           color={'#96999C'}
    //           fontFamily={'Avenir Next Demi'}
    //           fontSize={'1.8rem'}
    //           style={{ whiteSpace: 'nowrap' }}
    //         >
    //           <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
    //             1,255
    //           </span>{' '}
    //           RIN
    //         </Text>
    //       </BlockTemplate>
    //       <BlockTemplate
    //         width={'70%'}
    //         padding="3rem"
    //         background="#383b45"
    //         theme={theme}
    //         justify={'space-between'}
    //       >
    //         <Row
    //           direction={'column'}
    //           align="flex-start"
    //           justify={'space-between'}
    //         >
    //           <Text
    //             color={'#96999C'}
    //             fontFamily={'Avenir Next Demi'}
    //             fontSize={'1.8rem'}
    //             padding={'0 0 2rem 0'}
    //           >
    //             Total Staked:
    //           </Text>{' '}
    //           <Text
    //             color={'#96999C'}
    //             fontFamily={'Avenir Next Demi'}
    //             fontSize={'1.8rem'}
    //           >
    //             <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
    //               1,255
    //             </span>{' '}
    //             RIN
    //           </Text>
    //         </Row>
    //         <Row
    //           direction={'column'}
    //           align="flex-start"
    //           justify={'space-between'}
    //         >
    //           <Text
    //             color={'#96999C'}
    //             fontFamily={'Avenir Next Demi'}
    //             fontSize={'1.8rem'}
    //             padding={'0 0 2rem 0'}
    //           >
    //             Total Staked:
    //           </Text>{' '}
    //           <Text
    //             color={'#96999C'}
    //             fontFamily={'Avenir Next Demi'}
    //             fontSize={'1.8rem'}
    //           >
    //             <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
    //               1,255
    //             </span>{' '}
    //             RIN
    //           </Text>
    //         </Row>
    //         <Row
    //           direction={'column'}
    //           align="flex-end"
    //           justify={'space-between'}
    //         >
    //           <RoundButton needImage style={{ margin: '0 0 1.5rem 0' }}>
    //             Claim
    //           </RoundButton>
    //           <TextButton style={{ margin: '0 auto' }} color="#53DF11">
    //             Restake
    //           </TextButton>
    //         </Row>
    //       </BlockTemplate>{' '}
    //     </RowContainer>
    //     <RowContainer justify={'space-between'}>
    //       <RoundInputWithTokenName text={'RIN'} />
    //       <RoundButton needImage>Stake</RoundButton>
    //       <RoundButton>Unstake All</RoundButton>
    //     </RowContainer>
    //   </RowContainer>{' '}
    // </BlockTemplate>
  )
}
