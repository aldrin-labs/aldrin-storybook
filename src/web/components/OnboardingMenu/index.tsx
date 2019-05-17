import React from 'react'

import Welcome from './Welcome'
import Launch from './Launch'
import ChooseExchange from './ChooseExchange'
import ExchangeTable from './ExchangeTable'
import ImportHelp from './ImportHelp'
import ImportKey from './ImportKey'

const OnboardingMenu = (props) => {
  const { page, fullName } = props
  switch(page) {
    case('Welcome'): return <Welcome fullName={fullName}/>
    case('Launch'): return <Launch />
    case('ChooseExchange'): return <ChooseExchange />
    case('ExchangeTable'): return <ExchangeTable />
    case('ImportHelp'): return <ImportHelp />
    case('ImportKey'): return <ImportKey />
  }
}

export default OnboardingMenu
