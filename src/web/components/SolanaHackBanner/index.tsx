import React from 'react'

import { Container } from './styles'

export const SolanaHackBanner = () => {
  return (
    <Container>
      <svg
        width="38"
        height="34"
        viewBox="0 0 38 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.0312 25.5312C17.0312 26.0534 17.2386 26.5542 17.6078 26.9234C17.977 27.2926 18.4778 27.5 18.9999 27.5C19.5221 27.5 20.0228 27.2926 20.3921 26.9234C20.7613 26.5542 20.9687 26.0534 20.9687 25.5312C20.9687 25.0091 20.7613 24.5083 20.3921 24.1391C20.0228 23.7699 19.5221 23.5625 18.9999 23.5625C18.4778 23.5625 17.977 23.7699 17.6078 24.1391C17.2386 24.5083 17.0312 25.0091 17.0312 25.5312ZM17.6874 13.0625V20.6094C17.6874 20.7898 17.8351 20.9375 18.0156 20.9375H19.9843C20.1648 20.9375 20.3124 20.7898 20.3124 20.6094V13.0625C20.3124 12.882 20.1648 12.7344 19.9843 12.7344H18.0156C17.8351 12.7344 17.6874 12.882 17.6874 13.0625ZM37.1986 31.1094L20.1361 1.57812C19.8818 1.13926 19.4429 0.921875 18.9999 0.921875C18.557 0.921875 18.114 1.13926 17.8638 1.57812L0.801308 31.1094C0.296816 31.9871 0.928456 33.0781 1.93744 33.0781H36.0624C37.0714 33.0781 37.7031 31.9871 37.1986 31.1094ZM5.06283 29.965L18.9999 5.83965L32.937 29.965H5.06283Z"
          fill="#FAFAFA"
        />
      </svg>

      <div>
        Solana wallets got attacked. In order to keep you funds in safety please
        move them to CEX or clear wallet. Do not withdraw funds from staking or
        liquidity positions for your safety, our team is working on positions
        migration tool.
      </div>
    </Container>
  )
}
