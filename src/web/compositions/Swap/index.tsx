import { FormikProvider, useFormik } from 'formik'
import React, { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router'
import { compose } from 'recompose'

import {
  BlockContent,
  BlockContentStretched,
  BlockTitle,
} from '@sb/components/Block'
import { Cell, FlexBlock } from '@sb/components/Layout'
import SvgIcon from '@sb/components/SvgIcon'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { withRegionCheck } from '@core/hoc/withRegionCheck'

import { TokenIcon } from '../../components/TokenIcon'
import { InlineText } from '../../components/Typography'
import { getTokenNameByMintAddress } from '../../dexUtils/markets'
import { useTokenInfos, useTokenSymbol } from '../../dexUtils/tokenRegistry'
import { Chart } from './components/Chart'
import { SwapForm } from './components/SwapForm'
import { SwapFormModel } from './components/SwapForm/types'
import { SwapSearch } from './components/SwapSearch'
import { SearchItem } from './components/SwapSearch/types'
import { TokensList } from './components/TokensList'
import StakeIcon from './img/stake.svg'
import {
  RootRow,
  SPage,
  Content,
  SBlock,
  StakeBlock,
  StakingLink,
  FormBlock,
  SCell,
} from './styles'
import { SwapPageProps, SwapPageBaseProps, TokenWithSymbol } from './types'

const SwapPageInner: React.FC<SwapPageProps> = (props) => {
  const { tokens, poolsInfoRefetch } = props

  const { search } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const tokenFrom = params.get('base') || params.get('from')
  const tokenTo = params.get('quote') || params.get('to')

  const [_, refreshUserTokens] = useUserTokenAccounts()

  const refreshAll = () => {
    poolsInfoRefetch()
    refreshUserTokens()
  }

  const defaultMarketFrom =
    tokens.find(
      (token) => token.symbol.toLowerCase() === tokenFrom?.toLowerCase()
    ) || tokens.find((token) => token.symbol === 'SOL')

  const defaultMarketTo =
    tokens.find(
      (token) => token.symbol.toLowerCase() === tokenTo?.toLowerCase()
    ) || tokens.find((token) => token.symbol === 'RIN')

  const form = useFormik<SwapFormModel>({
    initialValues: {
      marketFrom: defaultMarketFrom || tokens[0],
      marketTo: defaultMarketTo || tokens[1],
      amountFrom: '0',
      amountTo: '0',
      slippageTolerance: 0.1,
    },
    enableReinitialize: false,
    validate: async (values) => {
      const { marketFrom, marketTo } = values
      if (marketFrom.mint === marketTo.mint) {
        return { marketFrom: 'Same token selected' }
      }
      return null
    },
    onSubmit: (values) => {
      console.log('Values: ', values)
    },
  })

  // Start validation of formik after mount, https://github.com/jaredpalmer/formik/issues/3348
  useEffect(() => {
    setTimeout(() => form.validateForm())
  }, [])

  const fromName = useTokenSymbol(form.values.marketFrom.mint)
  const toName = useTokenSymbol(form.values.marketTo.mint)
  const onSearchSelect = (selected: SearchItem) => {
    form.setFieldValue('marketFrom', selected.tokenFrom)
    form.setFieldValue('marketTo', selected.tokenTo)
  }

  return (
    <>
      <Cell col={12} colMd={9} colXl={5}>
        <SBlock>
          <BlockContent border>
            <BlockTitle>
              <FlexBlock alignItems="center">
                <TokenIcon
                  mint={form.values.marketFrom.mint}
                  width="24px"
                  height="24px"
                />
                &nbsp;
                <TokenIcon
                  mint={form.values.marketTo.mint}
                  width="24px"
                  height="24px"
                />
                &nbsp;
                {fromName} / {toName}
              </FlexBlock>
            </BlockTitle>
          </BlockContent>
          <Chart />
        </SBlock>
      </Cell>
      <Cell col={12} colXl={4}>
        <SwapSearch onSelect={onSearchSelect} tokens={tokens} />
        <FormBlock>
          <FormikProvider value={form}>
            <SwapForm tokens={tokens} refreshAll={refreshAll} />
          </FormikProvider>
        </FormBlock>
      </Cell>
    </>
  )
}

const SwapPage: React.FC<SwapPageBaseProps> = (props) => {
  const { poolsInfo, poolsInfoRefetch } = props

  const [userTokens] = useUserTokenAccounts()
  const tokensInfo = useTokenInfos()
  const allTokens = useMemo(() => {
    const poolMints = new Set(
      poolsInfo.getPoolsInfo.map((pool) => [pool.tokenA, pool.tokenB]).flat()
    )

    const tokens: TokenWithSymbol[] = userTokens
      .filter((token) => poolMints.has(token.mint))
      .map((ut) => ({
        mint: ut.mint,
        account: ut.address,
        balance: ut.amount,
        symbol: ut.symbol,
      }))
      .sort((a, b) => a.mint.localeCompare(b.mint))

    const userTokensMints = new Set(userTokens.map((ut) => ut.mint))

    const tokensWithoutUserAccount: TokenWithSymbol[] = [...poolMints]
      .filter((token) => !userTokensMints.has(token))
      .map((mint) => ({
        mint,
        balance: 0,
        symbol: tokensInfo.get(mint)?.symbol || getTokenNameByMintAddress(mint),
      }))

    return [...tokens, ...tokensWithoutUserAccount]
  }, [userTokens, poolsInfo])

  return (
    <SPage>
      <Content>
        <RootRow>
          <SCell col={12} colMd={3} colXl={3}>
            <SBlock>
              <TokensList />
            </SBlock>
            <StakeBlock>
              <StakingLink to="/staking">
                <BlockContentStretched>
                  <FlexBlock justifyContent="space-between" alignItems="center">
                    <InlineText size="lg">
                      <b> Stake RIN</b>
                    </InlineText>
                    <SvgIcon src={StakeIcon} width="24px" />
                  </FlexBlock>
                  <div>
                    <InlineText>
                      with <b>34% APR!</b>
                    </InlineText>
                  </div>
                </BlockContentStretched>
              </StakingLink>
            </StakeBlock>
          </SCell>
          <SwapPageInner
            poolsInfoRefetch={poolsInfoRefetch}
            poolsInfo={poolsInfo}
            tokens={allTokens}
          />
        </RootRow>
      </Content>
    </SPage>
  )
}

export default compose(
  withRegionCheck,
  queryRendererHoc({
    name: 'poolsInfo',
    query: getPoolsInfo,
    fetchPolicy: 'cache-and-network',
  })
)(SwapPage)
