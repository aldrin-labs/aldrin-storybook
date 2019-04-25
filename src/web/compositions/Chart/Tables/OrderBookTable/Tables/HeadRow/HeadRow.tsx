import React, { memo } from 'react'

import {
  Head,
  HeadCell,
} from '@sb/components/OldTable/Table'
import { TypographyFullWidth } from '@sb/styles/cssUtils'
import {
  EmptyCell,
} from '../../../SharedStyles'
import { TriggerRow } from './HeadRow.styles'

export const HeadRow = memo(
  ({ primary, type, palette, quote, spread, digitsAfterDecimalForSpread }) => (
    <Head background={primary[type]} style={{ height: '21px' }} border={'none'}>
      <TriggerRow isHead={true} background={primary[type]}>
        <EmptyCell width="10%" />
        <HeadCell width={'45%'}>
          <TypographyFullWidth
            textColor={palette.getContrastText(primary[type])}
            variant="body1"
            align="right"
          >
            {quote || 'Fiat'} spread{' '}
          </TypographyFullWidth>
        </HeadCell>
        <HeadCell width={'45%'}>
          <TypographyFullWidth
            textColor={palette.getContrastText(primary[type])}
            variant="body1"
            align="right"
            color="secondary"
          >
            {+spread.toFixed(digitsAfterDecimalForSpread) <= 0
              ? '~ 0'
              : spread.toFixed(digitsAfterDecimalForSpread)}
          </TypographyFullWidth>
        </HeadCell>
      </TriggerRow>
    </Head>
  ),
  (prevProps, nextProps) =>
    nextProps.spread === prevProps.spread &&
    nextProps.quote === prevProps.quote &&
    nextProps.type === prevProps.type
)
