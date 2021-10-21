import React, { useState, useEffect } from 'react'
import copy from 'clipboard-copy'

import { Theme } from '@sb/types/materialUI'

import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import { TextButton } from '@sb/compositions/Rebalance/Rebalance.styles'
import { RoundButton } from '../Staking.styles'
import { RoundInputWithTokenName } from './Input'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import { Text } from '@sb/compositions/Addressbook/index'
import { SvgIcon } from '@sb/components'
import { useWallet } from '@sb/dexUtils/wallet'
import { notify } from '@sb/dexUtils/notifications'
import { useConnection } from '@sb/dexUtils/connection'
import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { CCAI_MINT } from '@sb/dexUtils/utils'
import { stripByAmount } from '@core/utils/chartPageUtils'

import pinkBackground from './assets/pinkBackground.png'
import StakeBtn from '@icons/stakeBtn.png'

import locksIcon from './assets/lockIcon.svg'

import {
  RootRow,
  StyledTextDiv,
  WalletRow,
  WalletBalanceBlock,
  TotalStakedBlock,
  RewardsBlock,
  BalanceRow,
  Digit,
} from '../Staking.styles'
import {
  Block,
  BlockTitle,
  BlockContent,
  BlockSubtitle,
} from '../../../components/Block'
import { Row, Cell, StretchedBlock } from '../../../components/Layout'
import { Button } from '../../../components/Button'
import { BorderButton } from '@sb/compositions/Pools/components/Tables/index.styles'
import { RestakePopup } from './RestakePopup'

interface StakingComponentProps {}

export const StakingComponent: React.FC<StakingComponentProps> = ({}) => {
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [isRestakePopupOpen, setIsRestakePopupOpen] = useState(false)
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])

  const { wallet } = useWallet()
  const connection = useConnection()

  const walletAddress = wallet?.publicKey?.toString() || ''

  useEffect(() => {
    const fetchData = async () => {
      const allTokensData = await getAllTokensData(wallet.publicKey, connection)

      setAllTokensData(allTokensData)
    }
    fetchData()
  }, [])

  const tokenData = allTokensData?.find((token) => token.mint === CCAI_MINT)

  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6}>
          <Block>
            <BlockContent border>
              <WalletRow>
                <div>
                  <StretchedBlock align="center">
                    <BlockTitle>Your RIN Staking</BlockTitle>
                    <SvgIcon
                      src={
                        isBalancesShowing
                          ? ImagesPath.eye
                          : ImagesPath.closedEye
                      }
                      width={'1.5em'}
                      height={'auto'}
                      onClick={() => {
                        setIsBalancesShowing(!isBalancesShowing)
                      }}
                    />
                  </StretchedBlock>
                  <StyledTextDiv>
                    {isBalancesShowing ? walletAddress : '＊＊＊'}
                  </StyledTextDiv>
                </div>
                <WalletBalanceBlock>
                  <BlockSubtitle>Available in wallet:</BlockSubtitle>
                  <BalanceRow>
                    <Digit>
                      {isBalancesShowing
                        ? stripByAmount(tokenData?.amount)
                        : '＊＊＊'}
                    </Digit>
                    &nbsp;RIN
                  </BalanceRow>
                </WalletBalanceBlock>
              </WalletRow>
            </BlockContent>
            <BlockContent>
              <Row>
                <Cell colLg={4}>
                  <TotalStakedBlock inner>
                    <BlockContent>
                      <BlockSubtitle>Total staked:</BlockSubtitle>
                    </BlockContent>
                  </TotalStakedBlock>
                </Cell>
                <Cell colLg={8}>
                  <RewardsBlock inner>
                    <BlockContent>
                      <BlockSubtitle>Rewards:</BlockSubtitle>
                    </BlockContent>
                  </RewardsBlock>
                </Cell>
              </Row>

              <Button
                backgroundImage={StakeBtn}
                fontSize="xs"
                padding="lg"
                borderRadis="xxl"
                onClick={() => {
                  setIsRestakePopupOpen(true)
                }}
              >
                Stake
              </Button>
              <Button
                backgroundImage={StakeBtn}
                disabled
                fontSize="xs"
                padding="lg"
                borderRadis="xxl"
              >
                Stake
              </Button>
            </BlockContent>
          </Block>
        </Cell>
        <Cell col={12} colLg={6}>
          <Row>
            <Cell colMd={6}>
              <Block icon={locksIcon}>
                <BlockContent>
                  <BlockTitle>Total Staked</BlockTitle>
                </BlockContent>
              </Block>
            </Cell>
            <Cell colMd={6}>
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
                  <BlockTitle>RIN Stats </BlockTitle>
                </BlockContent>
              </Block>
            </Cell>
          </Row>
        </Cell>
        <RestakePopup
          open={isRestakePopupOpen}
          close={() => setIsRestakePopupOpen(false)}
        />
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
    //         <Row
    //           onClick={() => {
    //             setIsBalancesShowing(!isBalancesShowing)
    //           }}
    //         >
    //           <SvgIcon
    //             src={isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye}
    //             width={'2.7rem'}
    //             height={'auto'}
    //             style={{ cursor: 'pointer' }}
    //           />
    //         </Row>
    //       </RowContainer>
    //       <StyledTextDiv>
    //         {isBalancesShowing ? walletAddress : '***'}
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
    //         <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
    //           {isBalancesShowing ? stripByAmount(tokenData?.amount) : '***'}
    //         </span>{' '}
    //         RIN
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
    //             {isBalancesShowing ? stripByAmount(1, 255) : '***'}
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
    //             Rewards:{' '}
    //           </Text>{' '}
    //           <Text
    //             color={'#96999C'}
    //             fontFamily={'Avenir Next Demi'}
    //             fontSize={'1.8rem'}
    //           >
    //             <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
    //               {isBalancesShowing ? stripByAmount(2.255) : '***'}
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
    //             Available to claim:
    //           </Text>{' '}
    //           <Text
    //             color={'#96999C'}
    //             fontFamily={'Avenir Next Demi'}
    //             fontSize={'1.8rem'}
    //           >
    //             <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
    //               {isBalancesShowing ? stripByAmount(2.6) : '***'}
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
