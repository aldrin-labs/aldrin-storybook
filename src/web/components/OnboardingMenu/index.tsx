import React from 'react'

import { Redirect } from 'react-router-dom'

import Welcome from './Welcome'
import Launch from './Launch'
import ChooseExchange from './ChooseExchange'
import ImportHelp from './ImportHelp'
import ImportKey from './ImportKey'

const OnboardingMenu = (props) => {
  const {
    page,
    fullName,
    addExchangeKey,
    changePage,
    exchange,
    selectExchange,
  } = props
  switch(page) {
    case('Welcome'): return <Welcome fullName={fullName} changePage={changePage}/>
    case('Launch'): return <Launch changePage={changePage}/>
    case('ChooseExchange'): return <ChooseExchange changePage={changePage} selectExchange={selectExchange}/>
    case('ImportHelp'): return <ImportHelp changePage={changePage}/>
    case('ImportKey'): return <ImportKey changePage={changePage} addExchangeKey={addExchangeKey} exchange={exchange} />
    default: return <Redirect to="/user" />
  }
}

export default OnboardingMenu
