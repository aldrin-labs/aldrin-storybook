import React from 'react'

import Calendar from './Calendar'

class GitTransactionCalendarWrapper extends React.PureComponent {
  constructor(props) {
    super(props)

    this.wrapperRef = React.createRef()
  }

  render() {
    const { wrapperRef } = this
    return (
      <>
        {/* TODO: Fix this when fixing layout */}
        <div style={{ position: 'relative', height: '25vh' }} ref={wrapperRef}>
          <Calendar wrapperRef={wrapperRef} {...this.props}/>
        </div>
      </>
    )
  }
}

export default GitTransactionCalendarWrapper
