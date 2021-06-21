import React from 'react'
import SvgIcon from '@sb/components/SvgIcon'
import SolanaExplorerIcon from '@icons/SolanaExplorerIcon.svg'
import styled from 'styled-components'
import { Loading } from '@sb/components'

const StyleLink = styled.a`
  padding: 0.3rem 1rem 0rem 1rem;
`

const LoaderWrapper = styled.div`
  padding: 0.3rem 1rem 0rem 1rem;
`

const LinkToSolanaExp = ({ marketAddress }: { marketAddress?: string }) => {
  if (!marketAddress) {
    return (
      <LoaderWrapper>
        <Loading size={18} />
      </LoaderWrapper>
    )
  }

  return (
    <StyleLink
      href={`https://explorer.solana.com/address/${marketAddress}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <SvgIcon
        width="5rem"
        height="2rem"
        alt="View on Solan explorer"
        src={SolanaExplorerIcon}
      />
    </StyleLink>
  )
}

export default LinkToSolanaExp
