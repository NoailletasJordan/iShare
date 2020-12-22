export const profileUpdate = profile => {
  return {
    type: 'PROFILE_UPDATE',
    payload: profile
  }
}

export const profileLogout = profile => {
  return {
    type: 'PROFILE_LOGOUT',
    payload: profile
  }
}
