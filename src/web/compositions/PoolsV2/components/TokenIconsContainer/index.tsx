import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { Container, IconsContainer, WaveElement } from './index.styles'

export const TokenIconsContainer = ({ mint }: { mint: string }) => {
  return (
    <Container>
      <IconsContainer>
        <TokenIcon mint={getTokenMintAddressByName('RIN')} size={32} />{' '}
        <TokenIcon mint={getTokenMintAddressByName('USDC')} size={32} />{' '}
      </IconsContainer>
      <WaveElement>
        <svg
          width="116"
          height="18"
          viewBox="0 0 116 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44 2.125L46.8052 4.25C49.6104 6.375 56.1558 10.625 61.7662 9.5625C68.3117 8.5 73.9221 1.0625 80.4675 2.125C86.0779 2.125 91.6883 9.5625 98.2338 10.625C103.844 11.6875 110.39 5.3125 113.195 3.1875L116 0V17H113.195C110.39 17 103.844 17 98.2338 17C91.6883 17 86.0779 17 80.4675 17C73.9221 17 68.3117 17 61.7662 17C56.1558 17 49.6104 17 46.8052 17H44V2.125Z"
            fill="#14141F"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.953379 1.5208L4.06228 3.74896C7.17118 5.97712 14.42 10.4262 20.5982 9.25764C27.8074 8.08184 33.938 0.163467 41.1631 1.23761C47.3492 1.19404 54.677 9.00131 60.8634 8.5C67.0495 8.99869 70.4228 6.27173 73.5 4L80.4559 2.48314L80.4527 16.7113L77.3597 16.7331C74.2666 16.7549 67.0495 16.8057 60.8634 16.8493C53.6462 16.9001 47.4601 16.9437 41.274 16.9872C34.0569 17.0381 27.8708 17.0816 20.6537 17.1324C14.4675 17.176 7.25041 17.2268 4.15736 17.2486L1.0643 17.2704L0.953379 1.5208Z"
            fill="#14141F"
          />
        </svg>
      </WaveElement>
    </Container>
  )
}
