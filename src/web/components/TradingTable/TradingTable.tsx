import React from 'react'
import MoreVertIcon from '@material-ui/icons/NetworkCellSharp'

import { Table } from '@sb/components'
import { IProps, IState } from './TradingTable.types'
import { openOrdersColumnNames, openOrdersBody } from './TradingTable.mocks'

export default class TradingTable extends React.PureComponent<IProps, IState> {
  render() {
    return (
      <Table
        withCheckboxes={false}
        title={new Array(4).fill(undefined).map(el => <div>Button</div>)}
        data={{body: openOrdersBody}}
        columnNames={openOrdersColumnNames}
        // actions={[
        //   {
        //     id: '1',
        //     icon: <MoreVertIcon />,
        //     onClick: action('1'),
        //     color: 'primary',
        //   },
        //   {
        //     id: '2',
        //     icon: <MoreVertIcon />,
        //     onClick: action('2'),
        //   },
        // ]}
      />
    )
  }
}
