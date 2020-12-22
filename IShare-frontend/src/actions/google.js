export const addGoogleClient = googleClient => {
  return {
    type: 'ADD_GOOGLE_CLIENT',
    payload: { googleClient }
  }
}
