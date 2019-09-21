import React from 'react'
import styled from 'styled-components'

import TableWithSort from '@sb/components/Tables/WithSort'

export const StyledTable = styled(TableWithSort)`
  th,
  th:first-child,
  th:last-child {
    background: transparent;
    color: #abbad1;
    font-family: 'DM Sans';
    text-transform: uppercase;
    font-weight: 700;
    font-size: 1.2rem;
    border-bottom: 1px solid #e0e5ec;
    padding: 1rem 1.5rem;
    text-align: left;

    span {
      text-align: left;
    }
  }

  td {
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #16253d;
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 1.2rem;
    line-height: 101.5%;
    background: transparent;
    border-bottom: 1px solid #e0e5ec;
    height: 48px;
    padding-left: 1.5rem;
    text-align: left;
    white-space: nowrap;

    &:first-child {
      padding: .75rem 1.5rem !important;
    }
    &:last-child {
      width: 5rem;
      padding: 1px 1.5rem;
    }
  }

  @media (min-width: 2560px) {
    th,
    td {
      font-size: 1.1rem;
    }
  }
`
