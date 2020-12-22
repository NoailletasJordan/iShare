import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { useSelector, useDispatch } from 'react-redux'
import { closeSnackbar } from '../../actions/snackbar'

export default function TransitionsSnackbar() {
  const dispatch = useDispatch()
  const { isShown, isSuccess, category, customMessage } = useSelector(
    state => state.snackbar
  )

  const handleClose = () => {
    dispatch(closeSnackbar())
  }

  let message
  switch (category) {
    case 'test':
      if (isSuccess) {
        message = 'This is a successful test message'
      } else message = 'This is a fail test message'
      break

    case 'signin':
      if (isSuccess) {
        message = 'Welcome, please create your profile'
      } else message = 'Error :c'
      break

    case 'login':
      if (isSuccess) {
        message = 'Welcome back'
      } else message = 'Error :c'
      break

    case 'profile':
      if (isSuccess) {
        message = 'Profile Updated !'
      } else message = 'Error :c'
      break

    case 'custom':
      message = customMessage
      break

    default:
      message = 'An error happened'
      break
  }

  return (
    <div>
      <Snackbar
        key={Math.random()}
        open={isShown}
        onClose={handleClose}
        autoHideDuration={4000}
        message="I love snacks"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={isSuccess ? 'success' : 'error'}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
