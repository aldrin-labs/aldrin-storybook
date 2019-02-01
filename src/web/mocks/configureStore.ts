import rootReducer from '@core/redux/rootReducer'

import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'

const history = createHistory()

const routesMiddleware = routerMiddleware(history)

const initialState = {}
const middlewares = [routesMiddleware]

export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
)

export const persistor = persistStore(store)
