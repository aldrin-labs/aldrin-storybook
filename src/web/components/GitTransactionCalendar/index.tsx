import React from 'react'
import moment from 'moment'

import ChooseYear from './ChooseYear'
import Calendar from './Calendar'

class GitTransactionCalendarWrapper extends React.PureComponent {
  state = {
    startDate: moment().startOf('year'),
    endDate: moment().endOf('year'),
    activeDateButton: moment().format('YYYY'),
  }

  onDateButtonClick = async (stringDate: string) => {
    this.setState(
      {
        activeDateButton: moment(stringDate).format('YYYY'),
        startDate: moment(stringDate).startOf('year'),
        endDate: moment(stringDate).endOf('year'),
      },
      () => {
        // TODO: there should be mutation for search:
      }
    )
  }

  render() {
    const { endDate, activeDateButton, startDate } = this.state

    return (
      <>
        <ChooseYear
          {...{
            activeDateButton,
            startDate,
            endDate,
            onDateButtonClick: this.onDateButtonClick,
          }}
        />
        {/* TODO: Fix this when fixing layout */}
        <div style={{ position: 'relative', height: '27vh' }}>
          <Calendar
            {...{
              endDate,
              startDate,
              ...this.props,
            }}
          />
        </div>
      </>
    )
  }
}

export default GitTransactionCalendarWrapper
