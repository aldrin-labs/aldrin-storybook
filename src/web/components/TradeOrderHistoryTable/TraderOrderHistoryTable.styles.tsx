import React from 'react'
import styled from 'styled-components'

import TableWithSort from '@sb/components/Tables/WithSort'

export const StyledTable = styled(TableWithSort)`
  th,
  th:first-child,
  th:last-child {
    color: #abbad1;
    background: #fff;
    font-family: 'DM Sans';
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.2rem;
    border-bottom: 1px solid #e0e5ec;
    padding: 1rem 0 10rem 10rem;
    text-align: left;
    letter-spacing: 1.5px;
    span {
      text-align: left;
    }
  }

  th:first-child {
    padding-left: 2rem !important;
  }

  td {
    max-height: 24px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #16253d;
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 1.2rem;
    line-height: 31px;
    background: transparent;
    /* border-bottom: 1px solid #e0e5ec; */
    height: 48px;
    padding-left: 10px;
    text-align: left;
  }
  td:first-child {
    padding-left: 2rem !important;
  }

  @media (min-width: 2560px) {
    th,
    td {
      font-size: 1.1rem;
    }
  }
`
