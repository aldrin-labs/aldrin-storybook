import React from 'react'

import { Redirect } from 'react-router-dom'

import Welcome from './Welcome'
import Launch from './Launch'
import ChooseExchange from './ChooseExchange'
import ImportHelp from './ImportHelp'
import ImportKey from './ImportKey'
import Questions from './Questions'

const OnboardingMenu = (props) => {
  const {
    page,
    fullName,
    addExchangeKey,
    changePage,
    exchange,
    selectExchange,
    SendResultsApi,
  } = props

  console.log('SendResultsApi', SendResultsApi)
  switch(page) {
    case('Welcome'): return <Welcome fullName={fullName} changePage={changePage}/>
    case('Questions'): return <Questions changePage={changePage} SendResultsApi={SendResultsApi}/>
    case('Launch'): return <Launch changePage={changePage}/>
    case('ChooseExchange'): return <ChooseExchange changePage={changePage} selectExchange={selectExchange}/>
    case('ImportHelp'): return <ImportHelp changePage={changePage}/>
    case('ImportKey'): return <ImportKey changePage={changePage} addExchangeKey={addExchangeKey} exchange={exchange} />
    default: return <Redirect to="/" />
  }
}

export default OnboardingMenu
