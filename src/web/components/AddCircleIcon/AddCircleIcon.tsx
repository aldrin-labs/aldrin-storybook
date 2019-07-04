import React from 'react'
import { IconCircle } from './AddCircleIcon.styles'


export const getCircleSymbol = (coin) => (
         <>
           <IconCircle
             className="fa fa-circle"
             style={{
               color: '#97C15C',
               fontSize: '10px',
               margin: 'auto 3px auto 0',
             }}
           />
           {coin}
         </>
       )
