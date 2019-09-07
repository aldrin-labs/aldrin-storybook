import React from 'react'

import Calendar from './Calendar'

class GitTransactionCalendarWrapper extends React.PureComponent {
  render() {
    return (
      <>
        {/* TODO: Fix this when fixing layout */}
        <div style={{ position: 'relative', height: '25vh' }}>
          <Calendar {...this.props}/>
        </div>
      </>
    )
  }
}

export default GitTransactionCalendarWrapper
