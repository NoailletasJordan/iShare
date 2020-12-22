export const userLoad = credentials => {
  return {
    type: 'USER_LOAD',
    payload: { credentials }
  }
}

export const userLogin = credentials => {
  return {
    type: 'USER_LOGIN',
    payload: { credentials }
  }
}

export const userLogout = () => {
  return {
    type: 'USER_LOGOUT'
  }
}
