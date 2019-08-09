import React, { Component } from 'react'

import {
    ChoosePeriodWrapper,
    ChoosePeriodButton,
    ChoosePeriodDate
} from './ChoosePeriod.styles'

const PERIODS = [
    { id: 0, label: '24H' },
    { id: 1, label: 'Week' },
    { id: 2, label: '2W' },
    { id: 3, label: 'Month' },
    { id: 4, label: '3MO' },
    { id: 5, label: '6MO' }
]
class ChoosePeriod extends Component {
    state = {
        chosen: 0
    }

    render() {
        return (
            <ChoosePeriodWrapper>
                {PERIODS.map(({ id, label }) =>
                    <ChoosePeriodButton active={this.state.chosen === id}>{label}</ChoosePeriodButton>
                )}
                {/*<ChoosePeriodDate type="date"/>*/}
            </ChoosePeriodWrapper>
        )
    }
}

export default ChoosePeriod
