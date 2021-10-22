import React from 'react'
import { Cell } from '../../../components/Layout'
import { RootRow } from '../Staking.styles'
import StatsComponent from './StatsComponent'
import { UserStakingInfo } from './UserStakingInfo'

export const StakingComponent: React.FC = () => {
  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6}>
          <UserStakingInfo />
        </Cell>
        <Cell col={12} colLg={6}>
          <StatsComponent />
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
