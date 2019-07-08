import React from 'react'
import { IconCircle } from './AddCircleIcon.styles'


export const getCircleSymbol = (coin: string, coinColor: string) => (
         <>
           <IconCircle
             className="fa fa-circle"
             style={{
               justifySelf: 'flex-start',
               color: `${coinColor}`,
               fontSize: '10px',
               margin: 'auto 3px auto 0',
             }}
           />
           {coin}
         </>
       )
