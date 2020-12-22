import React, { useState, Fragment } from 'react'
import PersonIcon from '@material-ui/icons/Person'
import './RegisterPage.styles.scss'
import GoogleLogin from 'react-google-login'

import { useDispatch, useSelector } from 'react-redux'
import { openSnackbar } from '../../actions/snackbar'
import { userLoad } from '../../actions/user'
import { ajaxFunction } from '../../fetch'

import {
  Typography,
  Box,
  makeStyles,
  TextField,
  Button,
} from '@material-ui/core'

// DONT FORGET TO PUT PRODUCTION URL IN GOOGLE DEV CONSOLE
import validator from 'validator'
const useStyles = makeStyles((theme) => ({
  passwordFields: {
    width: '48%',
  },
}))

const RegisterPage = (props) => {
  const dispatch = useDispatch()
  const googleClient = useSelector((state) => state.google.googleClient)
  const classes = useStyles()
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState({
    fields: [],
    message: ['', '', '', ''],
  })

  const handleChangeInput = (e, specificInput) => {
    setFields({ ...fields, [specificInput]: e.target.value })

    //removing the error of the current field
    const index = ['name', 'email', 'password', 'confirmPassword'].findIndex(
      (elt) => elt === specificInput
    )
    const newFields = error.fields.filter((elt) => elt !== index)
    const newMessage = error.message
    newMessage[index] = ''
    setError({
      fields: newFields,
      message: newMessage,
    })
  }

  const handleGoogleRejection = (res) => {
    dispatch(openSnackbar(false, 'custom', res))
  }

  const getUserInfoAndUpdateRedux = async (token) => {
    //server - auth and grab user infos
    const { err, data } = await ajaxFunction('GET', '/api/auth', null, token)
    if (err) {
      dispatch(openSnackbar(false, 'custom', err.message)) //error
      return { cancel: true }
    }

    // update redux
    const { name, email, avatar, _id: id } = data
    dispatch(userLoad({ name, email, avatar, id, token }))
    dispatch(openSnackbar(true, 'custom', 'Welcome'))

    return { cancel: false }
  }

  const handleConnectGoogleUser = async (res) => {
    //will login if exists, sign in if it dont
    //grab token
    const { profileObj } = res
    const requestBody = {
      email: profileObj.email,
      password: profileObj.googleId,
      avatar: profileObj.imageUrl,
      name: profileObj.name,
    }

    const { err, data } = await ajaxFunction(
      'POST',
      '/api/users/google',
      requestBody
    )

    if (err) {
      return dispatch(openSnackbar(false, 'custom', err.message)) //error
    } else {
      const { token } = data
      //nest because of the name matching : data
      const { cancel } = await getUserInfoAndUpdateRedux(token)
      if (cancel) return

      //back to developers
      props.history.push('/developers')
    }
  }

  const handleSubmit = async () => {
    const { error, fieldsNumber, message } = checkInputValidation()
    if (error) return setError({ fields: fieldsNumber, message }) //error

    //server - signup and grab token
    const requestBody = {
      name: titleCase(fields.name),
      email: fields.email,
      password: fields.password,
    }
    const { err, data } = await ajaxFunction('POST', '/api/users', requestBody)

    if (err) {
      return dispatch(openSnackbar(false, 'custom', err.message)) //error
    } else {
      const { token } = data
      //nest because of the name matching : data
      const getUserInfoAndUpdateRedux = async () => {
        //server - auth and grab user infos
        const { err, data } = await ajaxFunction(
          'GET',
          '/api/auth',
          null,
          token
        )
        if (err) {
          dispatch(openSnackbar(false, 'signin')) //error
          return { cancel: true }
        }

        // update redux
        const { name, email, avatar, _id: id } = data
        dispatch(userLoad({ name, email, avatar, id, token }))
        dispatch(openSnackbar(true, 'signin'))

        return { cancel: false }
      }

      const { cancel } = await getUserInfoAndUpdateRedux()
      if (cancel) return

      //push to create profile
      props.history.push('/create-profile')
    }
  }

  const checkInputValidation = () => {
    let error = false
    let fieldsNumber = []
    const message = ['', '']

    if (fields.name.length < 3) {
      error = true
      fieldsNumber = fieldsNumber.concat(0)
      message[0] = 'Name too short'
    }

    if (!validator.isEmail(fields.email)) {
      error = true
      fieldsNumber = fieldsNumber.concat(1)
      message[1] = 'Please enter a valid email'
    }

    if (fields.password.length < 6) {
      error = true
      fieldsNumber = fieldsNumber.concat(2)
      message[2] = 'Password too short'
    }

    if (fields.password !== fields.confirmPassword) {
      error = true
      fieldsNumber = fieldsNumber.concat(3)
      message[3] = 'Passwords dont match'
    }

    return {
      error,
      fieldsNumber,
      message,
    }
  }

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ')
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    // Directly return the joined string
    return splitStr.join(' ')
  }

  return (
    <div className="register-page">
      <Typography
        component="div"
        className="register-page__inner u-padding-top-32"
      >
        <Box
          component="h2"
          color="secondary.main"
          fontWeight="500"
          fontSize="h4.fontSize"
          letterSpacing={5}
        >
          Sign Up
        </Box>

        <Box display="flex" component="h4" fontWeight="500">
          <PersonIcon />
          <Box ml={1}>Create Your Account</Box>
        </Box>

        <form action="" noValidate className="u-margin-top-8">
          <TextField
            id="name"
            label="Full name"
            variant="filled"
            margin="normal"
            name="name"
            value={fields.name}
            onChange={(e) => handleChangeInput(e, 'name')}
            fullWidth
            error={error.fields.includes(0) ? true : false}
            helperText={error.fields.includes(0) ? error.message[0] : null}
          />

          <TextField
            id="email"
            label="Email"
            type="email"
            variant="filled"
            margin="normal"
            name="email"
            value={fields.email}
            onChange={(e) => handleChangeInput(e, 'email')}
            fullWidth
            error={error.fields.includes(1) ? true : false}
            helperText={error.fields.includes(1) ? error.message[1] : null}
          />

          <Box display="flex" justifyContent="space-between">
            <TextField
              className={classes.passwordFields}
              id="password"
              label="Password"
              variant="filled"
              margin="normal"
              type="password"
              name="password"
              value={fields.password}
              onChange={(e) => handleChangeInput(e, 'password')}
              helperText={
                error.fields.includes(2)
                  ? error.message[2]
                  : '6 caracters minimum'
              }
              error={error.fields.includes(2) ? true : false}
            />

            <TextField
              className={classes.passwordFields}
              id="confirm-password"
              label="Confirm Password"
              variant="filled"
              margin="normal"
              type="password"
              name="confirmPassword"
              value={fields.confirmPassword}
              onChange={(e) => handleChangeInput(e, 'confirmPassword')}
              error={error.fields.includes(3) ? true : false}
              helperText={error.fields.includes(3) ? error.message[3] : null}
            />
          </Box>

          <Box mt={2} display="flex" alignItems="center">
            <Button variant="outlined" color="primary" onClick={handleSubmit}>
              Register
            </Button>

            {googleClient ? (
              <Fragment>
                <Box component="p" mx={2}>
                  OR
                </Box>
                <GoogleLogin
                  clientId={googleClient}
                  render={(renderProps) => (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Connect with google
                    </Button>
                  )}
                  buttonText="Login"
                  onSuccess={handleConnectGoogleUser}
                  onFailure={handleGoogleRejection}
                  cookiePolicy={'single_host_origin'}
                />
              </Fragment>
            ) : null}
          </Box>
        </form>
      </Typography>
    </div>
  )
}

export default RegisterPage
