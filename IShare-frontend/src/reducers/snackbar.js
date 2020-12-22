const initialState = {
  isShown: false,
  isSuccess: true,
  category: '',
  customMessage: ''
}

export default function snackbar(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_SNACKBAR':
      if (action.payload.customMessage) {
        //custom message
        return {
          ...state,
          isShown: true,
          isSuccess: action.payload.isSuccess,
          category: action.payload.category,
          customMessage: action.payload.customMessage
        }
      }
      //not custom message
      return {
        ...state,
        isShown: true,
        isSuccess: action.payload.isSuccess,
        category: action.payload.category
      }

    case 'CLOSE_SNACKBAR':
      return {
        ...state,
        isShown: false
      }
    default:
      return state
  }
}
