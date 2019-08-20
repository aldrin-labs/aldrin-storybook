import React, { Component } from 'react'
import moment from 'moment'

import {
    ChoosePeriodWrapper,
    ChoosePeriodButton
} from '@sb/components/ChoosePeriod/ChoosePeriod.styles'

const PERIODS = [1, 2, 3].map((num, index) => {
    const year = moment().add(1, 'years').subtract(index, 'years')
    return {
        name: year,
        label: year.format('YYYY')
    }
}).reverse()
class ChooseYear extends Component {
    render() {
        const {
            activeDateButton,
            onDateButtonClick
        } = this.props
        
        return (
            <ChoosePeriodWrapper>
                {PERIODS.map(({ name, label }, index) =>
                    <ChoosePeriodButton
                        active={activeDateButton === label}
                        key={index}
                        onClick={() => onDateButtonClick(name)}
                    >{label}</ChoosePeriodButton>
                )}
            </ChoosePeriodWrapper>
        )
    }
}

export default ChooseYear
