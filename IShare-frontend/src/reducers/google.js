const initialState = {
  googleClient: ''
}

export default function google(state = initialState, action) {
  switch (action.type) {
    case 'ADD_GOOGLE_CLIENT':
      return { ...state, googleClient: action.payload.googleClient }

    default:
      return state
  }
}
