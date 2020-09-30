import React from 'react';
// import { useSnackbar } from 'notistack'
import { notification } from 'antd';
import Link from '../components/Link';

export const notify = ({
  message,
  description,
  txid,
  type = 'info',
  placement = 'bottomLeft',
}) => {
  // const { enqueueSnackbar } = useSnackbar()
  console.log('notification')
  // if (txid) {
  //   description = (
  //     <Link
  //       external
  //       to={'https://explorer.solana.com/tx/' + txid}
  //       style={{ color: '#0000ff' }}
  //     >
  //       View transaction {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
  //     </Link>
  //   );
  // }

  // enqueueSnackbar(message, {
  //   variant: type,
  // })

  return null
}
