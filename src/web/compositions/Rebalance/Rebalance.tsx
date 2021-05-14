import React, { useMemo, useEffect } from 'react'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core/styles'
import {
  TokenInstructions,
} from '@project-serum/serum'

import { withPublicKey } from '@core/hoc/withPublicKey'
import { useWallet, WRAPPED_SOL_MINT } from '@sb/dexUtils/wallet'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'

import { useWalletPublicKeys } from '@sb/dexUtils/walletExtra'
import { useBalanceInfo } from '@sb/dexUtils/wallet'
import { getPricesForTokens, getTokenValuesForTokens, getSortedTokensByValue } from './utils'
import { useConnection } from '@sb/dexUtils/connection'


import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  Card,
  HeaderCell,
  Cell,
  TableRow,
  Table,
} from '@sb/compositions/Rewards/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Text } from './Rebalance.styles'

const RebalanceComposition = ({
  publicKey,
  theme,
}: {
  publicKey: string
  theme: Theme
}) => {
  const { wallet } = useWallet()
  // const [publicKeys = []] = useWalletPublicKeys();
  // console.log('publicKeys: ', publicKeys)

  const connection: Connection = useConnection()
  const isWalletConnected = !!wallet?.publicKey

  console.log('isWalletConnected: ', isWalletConnected)  

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData: ', fetchData)

      try {
        console.time('rebalance initial data set time')
        const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TokenInstructions.TOKEN_PROGRAM_ID })
        const solBalance = await connection.getBalance(wallet.publicKey) / LAMPORTS_PER_SOL
        const SOLToken = { symbol: 'SOL', amount: solBalance, decimals: 8, mint: TokenInstructions.WRAPPED_SOL_MINT }

        const parsedTokensData = parsedTokenAccounts.value.map(el => ({ 
          symbol: ALL_TOKENS_MINTS_MAP[el.account.data.parsed.info.mint] ? ALL_TOKENS_MINTS_MAP[el.account.data.parsed.info.mint] : el.account.data.parsed.info.mint,
          decimals: el.account.data.parsed.info.tokenAmount.decimals,
          amount: el.account.data.parsed.info.tokenAmount.uiAmount,
          mint: el.account.data.parsed.info.mint,
         }))


         const allTokensData = [SOLToken, ...parsedTokensData]

        const tokensWithPrices = await getPricesForTokens(allTokensData)
        const tokensWithTokenValue = getTokenValuesForTokens(tokensWithPrices)
        const sortedTokensByTokenValue = getSortedTokensByValue(tokensWithTokenValue)

        console.timeEnd('rebalance initial data set time')
        console.log('sortedTokensByTokenValue: ', sortedTokensByTokenValue)

      } catch(e) {
        // set error
        console.log('e: ', e)
      }


    }
  
    if (isWalletConnected) {
      fetchData();
    }
  }, [wallet.publicKey]);

  return (
    <RowContainer
      theme={theme}
      style={{ height: '100%', background: theme.palette.grey.additional }}
    >
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '75%',
          height: '80%',
          padding: '0',
        }}
        theme={theme}
      >
        {!publicKey && (
          <>
            <Text style={{ color: theme.palette.text.light }}>
              Connect your wallet to rebalance your coins
            </Text>
            {/* connect wallet */}
            <BtnCustom
              theme={theme}
              onClick={wallet.connect}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize="1.4rem"
              padding="1rem 2rem"
              borderRadius=".8rem"
              borderColor={theme.palette.blue.serum}
              btnColor={'#fff'}
              backgroundColor={theme.palette.blue.serum}
              textTransform={'none'}
              margin={'4rem 0 0 0'}
              transition={'all .4s ease-out'}
              style={{ whiteSpace: 'nowrap' }}
            >
              Connect wallet
            </BtnCustom>
          </>
        )}
      </Card>
    </RowContainer>
  )
}

export default compose(withTheme(), withPublicKey)(RebalanceComposition)