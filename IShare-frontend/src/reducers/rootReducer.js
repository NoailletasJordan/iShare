import { combineReducers } from 'redux'
import snackbar from './snackbar'
import user from './user'
import profile from './profile'
import google from './google'

const rootReducer = combineReducers({
  snackbar,
  user,
  profile,
  google
})

export default rootReducer
