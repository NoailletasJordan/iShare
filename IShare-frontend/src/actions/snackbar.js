//provide a 3rd argument only for custom snackbars
export const openSnackbar = (isSuccess, category, customMessage) => {
  return {
    type: 'OPEN_SNACKBAR',
    payload: { isSuccess, category, customMessage }
  }
}

export const closeSnackbar = () => {
  return {
    type: 'CLOSE_SNACKBAR'
  }
}
