import tokens from 'aldrin-registry/src/tokens.json'
import React from 'react'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { MarinadeStats } from '@sb/dexUtils/staking/hooks/types'

import { toMap } from '@core/collection'
import { Farm, Harvest } from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/numberUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { DexTokensPrices } from '../Pools/index.types'
import { TooltipIcon } from './components/Icons'

export const getStakingsData = ({
  farm,
  stakedPercentage,
  RINHarvest,
  mSolInfo,
  PLDTotalStaked,
  RPCTotalStaked,
  PU238TotalStaked,
  dexTokensPricesMap,
  lidoApy,
  lidoMarketcap,
  lidoTotalStaked,
}: {
  farm: Farm
  stakedPercentage: number
  RINHarvest: Harvest
  mSolInfo: { stats: MarinadeStats }
  PLDTotalStaked: number
  RPCTotalStaked: number
  PU238TotalStaked: number
  dexTokensPricesMap: Map<string, DexTokensPrices>
  lidoApy: number | string
  lidoMarketcap: number | string
  lidoTotalStaked: number | string
}) => {
  const tokensMap = toMap(tokens, (el) => el.symbol)

  return [
    {
      token: 'RIN',
      labels: ['Auto-Compound'],
      totalStaked:
        (farm?.stakeVaultTokenAmount / 10 ** farm?.stakeVaultDecimals) *
        (dexTokensPricesMap.get('RIN')?.price || 0),
      additionalInfo: `${stripDigitPlaces(stakedPercentage, 2) || 0}%`,
      apy: stripDigitPlaces(RINHarvest?.apy, 2) || 0,
      columnName: '% of circ. supply',
      socials: {
        twitter: tokensMap.get('RIN')?.twitterLink,
        coinmarketcap: tokensMap.get('RIN')?.marketCapLink,
        discord: 'https://discord.gg/4VZyNxT2WU',
      },
    },
    {
      token: 'mSOL',
      labels: ['Liquid', 'Marinade'],
      totalStaked:
        (mSolInfo?.stats.tvl_sol || 0) *
        (dexTokensPricesMap.get('mSOL')?.price || 0),
      additionalInfo: `${stripDigitPlaces(
        mSolInfo?.epochInfo?.epochPct || 0,
        2
      )}%`,
      apy: mSolInfo?.stats.avg_staking_apy,
      columnName: (
        <DarkTooltip title="Tooltip">
          <span>
            <TooltipIcon color="white2" /> Epoch
          </span>
        </DarkTooltip>
      ),
      socials: {
        twitter: 'https://twitter.com/MarinadeFinance',
        coinmarketcap: 'https://coinmarketcap.com/ru/currencies/marinade/',
        discord: 'https://discord.gg/6EtUf4Euu6',
      },
    },
    {
      token: 'stSOL',
      labels: ['Liquid', 'Lido'],
      totalStaked: lidoTotalStaked,
      additionalInfo: (
        <>
          <InlineText color="white2">$</InlineText>{' '}
          {stripByAmountAndFormat(lidoMarketcap)}
        </>
      ),
      apy: stripByAmountAndFormat(lidoApy),
      columnName: 'Marketcap',
      socials: {
        twitter: tokensMap.get('stSOL')?.twitterLink,
        coinmarketcap:
          'https://coinmarketcap.com/ru/currencies/lido-for-solana/',
        discord: 'https://discord.com/invite/vgdPfhZ',
      },
    },
    {
      token: 'PLD',
      labels: ['Plutonians', 'NFT Rewards'],
      totalStaked: PLDTotalStaked * (dexTokensPricesMap.get('PLD')?.price || 0),
      additionalInfo: (
        <>
          <InlineText color="white2">$</InlineText>{' '}
          {stripByAmountAndFormat(dexTokensPricesMap.get('PLD')?.price || 0)}
        </>
      ),
      apy: 20,
      columnName: 'PLD Price',
      socials: {
        twitter: 'https://twitter.com/plutoniansgame',
        coinmarketcap:
          'https://coinmarketcap.com/ru/currencies/plutonians-tech/',
        discord: 'https://discord.com/invite/6PnPAPupqR',
      },
    },
    {
      token: 'RPC',
      labels: ['Plutonians', 'NFT Rewards'],
      totalStaked: RPCTotalStaked * (dexTokensPricesMap.get('RPC')?.price || 0),
      additionalInfo: (
        <>
          <InlineText color="white2">$</InlineText>{' '}
          {stripByAmountAndFormat(dexTokensPricesMap.get('RPC')?.price || 0)}
        </>
      ),
      apy: 20,
      columnName: 'RPC Price',
      socials: {
        twitter: 'https://twitter.com/plutoniansgame',
        coinmarketcap: 'https://coinmarketcap.com/ru/currencies/plutonians/',
        discord: 'https://discord.gg/6PnPAPupqR',
      },
    },
    {
      token: 'PU238',
      labels: ['Plutonians', 'NFT Rewards'],
      totalStaked:
        PU238TotalStaked * (dexTokensPricesMap.get('PU238')?.price || 0),
      additionalInfo: (
        <>
          <InlineText color="white2">$</InlineText>{' '}
          {stripByAmountAndFormat(dexTokensPricesMap.get('PU238')?.price || 0)}
        </>
      ),
      apy: 20,
      columnName: 'PU238 Price',
      socials: {
        twitter: 'https://twitter.com/plutoniansgame',
        coinmarketcap: '',
        discord: 'https://discord.gg/6PnPAPupqR',
      },
    },
  ]
}
