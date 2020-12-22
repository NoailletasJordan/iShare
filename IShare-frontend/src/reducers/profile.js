import { setupProfileForRedux } from './utility'
const initialState = {
  status: '',
  company: '',
  website: '',
  location: '',
  skills: [],
  githubUsername: '',
  bio: '',
  experience: [],
  education: []
}

export default function profile(state = initialState, action) {
  switch (action.type) {
    case 'PROFILE_UPDATE':
      return setupProfileForRedux(action.payload)

    case 'PROFILE_LOGOUT':
      return initialState

    default:
      return state
  }
}
