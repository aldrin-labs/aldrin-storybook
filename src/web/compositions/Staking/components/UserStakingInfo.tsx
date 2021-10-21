import StakeBtn from '@icons/stakeBtn.png'
import { SvgIcon } from '@sb/components'
import React, { useState, useEffect } from 'react'
import { stripByAmount } from '@core/utils/chartPageUtils'
import {
  Block,
  BlockContent,
  BlockSubtitle, BlockTitle
} from '../../../components/Block'
import { Button } from '../../../components/Button'
import { Cell, Row, StretchedBlock } from '../../../components/Layout'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import {
  BalanceWrap, RewardsBlock, StyledTextDiv,
  TotalStakedBlock, WalletBalanceBlock, WalletRow, BalanceRow, Digit
} from '../Staking.styles'
import { useWallet } from '../../../dexUtils/wallet'
import { useConnection } from '../../../dexUtils/connection'
import { getAllTokensData } from '../../Rebalance/utils'
import { TokenInfo } from '../../Rebalance/Rebalance.types'
import { CCAI_MINT } from '../../../dexUtils/utils'


interface UserBalanceProps {
  value: number
  visible: boolean
}
const UserBalance: React.FC<UserBalanceProps> = (props) => (
  <BalanceRow>
    <Digit>{props.visible ? stripByAmount(props.value) : '＊＊＊'}</Digit>&nbsp;RIN
  </BalanceRow>
)

export const UserStakingInfo: React.FC = () => {
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])

  const { wallet } = useWallet()
  const connection = useConnection()

  const walletAddress = wallet?.publicKey?.toString() || ''

  useEffect(() => {
    const fetchData = async () => {
      const atd = await getAllTokensData(wallet.publicKey, connection)

      setAllTokensData(atd)
    }
    fetchData()
  }, [])

  const tokenData = allTokensData?.find((token) => token.mint === CCAI_MINT)

  return (
    <Block>
      <BlockContent border>
        <WalletRow>
          <div>
            <StretchedBlock align="center">
              <BlockTitle>
                Your RIN Staking
              </BlockTitle>
              <SvgIcon
                src={isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye}
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
            <BlockSubtitle>
              Available in wallet:
          </BlockSubtitle>
            <BalanceWrap>
              <UserBalance visible={isBalancesShowing} value={tokenData?.amount || 0} />
            </BalanceWrap>
          </WalletBalanceBlock>
        </WalletRow>
      </BlockContent>
      <BlockContent>
        <Row>
          <Cell colMd={4} colLg={12} colXl={4}>
            <TotalStakedBlock inner>
              <BlockContent>
                <BlockSubtitle>Total staked:</BlockSubtitle>
                <UserBalance visible={isBalancesShowing} value={1} />
              </BlockContent>
            </TotalStakedBlock>
          </Cell>
          <Cell colMd={8} colLg={12} colXl={8}>
            <RewardsBlock inner>
              <BlockContent>
                <StretchedBlock>
                  <div>
                    <BlockSubtitle>Rewards:</BlockSubtitle>
                    <UserBalance visible={isBalancesShowing} value={2} />
                  </div>
                  <div>
                    <BlockSubtitle>Available to claim:</BlockSubtitle>
                    <UserBalance visible={isBalancesShowing} value={33} />
                  </div>
                  <div>
                    <Button backgroundImage={StakeBtn} fontSize="xs" padding="lg" borderRadis="xxl">Claim</Button>
                  </div>
                </StretchedBlock>

              </BlockContent>
            </RewardsBlock>
          </Cell>
        </Row>

        <Button backgroundImage={StakeBtn} fontSize="xs" padding="lg" borderRadis="xxl">Stake</Button>
        <Button backgroundImage={StakeBtn} disabled fontSize="xs" padding="lg" borderRadis="xxl">Stake</Button>
      </BlockContent>
    </Block>
  )
}