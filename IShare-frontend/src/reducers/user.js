const initialState = {
  isLogged: false,
  id: null,
  name: null,
  email: null,
  avatar: null,
  token: null,
  isGoogle: false
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOAD':
      return {
        ...state,
        isLogged: true,
        id: action.payload.credentials.id,
        name: action.payload.credentials.name,
        email: action.payload.credentials.email,
        token: action.payload.credentials.token,
        avatar: action.payload.credentials.avatar,
        isGoogle: action.payload.credentials.isGoogle ? true : false
      }

    case 'USER_LOGOUT':
      return initialState

    default:
      return state
  }
}
